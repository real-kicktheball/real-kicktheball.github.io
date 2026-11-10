---
{"title":"Logon Zero","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AES-CFB8에서 IV와 암호문이 모두 0이면 1/256 확률로 평문도 전부 0이 된다(Zerologon, CVE-2020-1472).","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**CFB-8**은 1바이트씩 처리하는 CFB 모드다.

1. 16바이트 시프트 레지스터(처음엔 IV)를 암호화한다.
2. 결과의 첫 바이트를 평문과 XOR한다.
3. 암호문 바이트를 레지스터 뒤에 밀어 넣는다.

IV와 암호문이 모두 0이면 레지스터는 계속 0으로 유지된다. 그러면 매 바이트 $E_K(0^{16})$의 첫 바이트 $b$가 XOR된다. 결과적으로 평문은 $b$ 하나가 반복된다. 키에 따라 $b = 0$일 확률이 $1/256$이다.

Windows Netlogon의 **Zerologon** 취약점(CVE-2020-1472)이 이것이다. 0으로 채운 인증값이 256번에 한 번꼴로 통과됐다.

## 문제

서버의 `reset_password`는 토큰을 CFB-8로 복호화한다. 마지막 4바이트는 비밀번호 길이, 앞부분은 새 비밀번호로 쓴다. 이후 `authenticate`로 로그인하면 플래그를 준다. `reset_connection`으로 키를 새로 뽑을 수 있다.

## 풀이

1. 토큰을 0바이트 28개로 보낸다(IV 16 + 데이터 12). 복호화 결과 12바이트는 모두 $b$가 된다.
2. $b = 0$이면 길이 0 → 빈 비밀번호다.
3. $b \ne 0$이면 길이가 매우 커서 비밀번호 8바이트 전체가 $b$ 문자가 된다.
4. 그래서 빈 문자열과 같은 문자 8개(`chr(b)*8`)를 모두 시도했다.
5. 실패하면 연결을 리셋해서 키를 바꾸고 다시 했다.

## 풀이 코드
```python
import socket,json,re
with socket.create_connection(('socket.cryptohack.org',13399),timeout=15) as s:
 f=s.makefile('rwb',buffering=0)
 print(f.readline().decode().strip())
 def ask(obj):
  f.write((json.dumps(obj)+'\n').encode())
  line=f.readline()
  if not line:raise EOFError
  return json.loads(line)
 for round in range(10):
  print(round,ask({'option':'reset_password','token':'00'*28}))
  for b in range(128):
   pwd='' if b==0 else chr(b)*8
   r=ask({'option':'authenticate','password':pwd})
   if 'crypto{' in str(r):
    print('FLAG',re.search(r'crypto\{[^}]+\}',str(r)).group());raise SystemExit
  print('reset',ask({'option':'reset_connection'}))
```

## 플래그
```text
crypto{Zerologon_Windows_CVE-2020-1472}
```
