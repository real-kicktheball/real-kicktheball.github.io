---
{"title":"Pad Thai","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"패딩 오류 여부만 알려주는 서버로도 CBC 암호문을 완전히 복호화할 수 있다(패딩 오라클 공격).","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**PKCS#7 패딩**은 블록을 채우려고 부족한 바이트 수 $n$을 $n$개 붙인다(예: `03 03 03`). 복호화 후 이 형식이 맞는지 검사한다.

**패딩 오라클 공격**은 "패딩이 맞다/틀리다"만 알려주는 서버를 이용한다. CBC에서 $P_i = D(C_i) \oplus C_{i-1}$이므로 다음처럼 진행한다.

1. $C_{i-1}$의 마지막 바이트를 바꿔가며 $C_{i-1}' \| C_i$를 보낸다.
2. 패딩이 맞다고 하면 복호화 결과 마지막 바이트가 `01`이라는 뜻이다.
3. 그러면 $D(C_i)$의 마지막 바이트 $= C'_{i-1}[15] \oplus 01$이다.
4. 다음엔 `02 02`, `03 03 03`… 순서로 앞 바이트를 하나씩 알아낸다.

## 문제

서버가 랜덤 메시지(32자리 16진수 문자열)를 CBC로 암호화해서 준다. `unpad`로 패딩이 유효한지만 알려준다. 메시지를 맞히면 플래그를 준다.

## 풀이

1. 블록마다 끝 바이트부터 패딩 값을 맞추도록 이전 블록을 조작한다.
2. 메시지가 16진수 문자로만 이루어져 있다. 그래서 후보를 256개가 아니라 `0-9a-f` 16개만 시도해 요청 수를 줄였다.
3. 두 블록을 모두 복원해 메시지를 보내면 플래그를 받는다.

## 풀이 코드
```python
import socket,json
with socket.create_connection(('socket.cryptohack.org',13421),timeout=20) as s:
 f=s.makefile('rwb',buffering=0)
 print(f.readline().decode().strip())
 def ask(obj):
  f.write((json.dumps(obj)+'\n').encode())
  return json.loads(f.readline())
 c=bytes.fromhex(ask({'option':'encrypt'})['ct'])
 blocks=[c[i:i+16] for i in range(0,len(c),16)]
 out=b''
 for block_index in [1,2]:
  prev=blocks[block_index-1];target=blocks[block_index];known=[0]*16
  for pos in range(15,-1,-1):
   pad=16-pos;valid=[]
   for guess in b'0123456789abcdef':
    forged=bytearray(prev)
    for j in range(pos+1,16):forged[j]=prev[j]^known[j]^pad
    forged[pos]=prev[pos]^guess^pad
    if ask({'option':'unpad','ct':(forged+target).hex()})['result']:valid.append(guess)
   if len(valid)!=1:raise RuntimeError((block_index,pos,valid))
   known[pos]=valid[0]
  out+=bytes(known)
  print('block',block_index,bytes(known),flush=True)
 print('message',out.decode())
 print(ask({'option':'check','message':out.decode()}))
```

## 플래그
```text
crypto{if_you_ask_enough_times_you_usually_get_what_you_want}
```
