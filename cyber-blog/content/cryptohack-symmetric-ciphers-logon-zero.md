---
{"title":"Logon Zero","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CFB-8에서 IV와 모든 암호문 바이트를 0으로 지정하면 내부 상태가 계속 0이므로 복호화된 12바이트가 하나의 값 b로 반복된다. 토큰 마지막 4바이트가 비밀번호 길이가 되고 앞 8바이트가 새 비밀번호가 된다. b=0이면 빈 비밀번호, …","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

CFB-8에서 IV와 모든 암호문 바이트를 0으로 지정하면 내부 상태가 계속 0이므로 복호화된 12바이트가 하나의 값 `b`로 반복된다. 토큰 마지막 4바이트가 비밀번호 길이가 되고 앞 8바이트가 새 비밀번호가 된다. `b=0`이면 빈 비밀번호, `1≤b<128`이면 해당 ASCII 문자를 8번 반복한 비밀번호다. 후보를 시도하고 필요하면 연결의 키를 재설정한다.

## 최종 익스플로잇

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

## 검증 방법

Python 3에서 위 코드를 실행해 서버 응답의 최종 플래그가 아래 문자열과 일치하는지 확인한다.

## 최종 플래그

```text
crypto{Zerologon_Windows_CVE-2020-1472}
```
