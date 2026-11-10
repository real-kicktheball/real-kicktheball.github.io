---
{"title":"Pad Thai","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CBC 복호화 후 PKCS#7 패딩 성공 여부를 돌려주는 오라클이다. 메시지는 32자리 16진수 문자로 구성됨이 소스에 드러나므로 각 평문 바이트 후보는 16개다. 뒤에서부터 원하는 패딩값으로 이전 암호 블록을 조정하고, 성공하는 후보를 하…","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

CBC 복호화 후 PKCS#7 패딩 성공 여부를 돌려주는 오라클이다. 메시지는 32자리 16진수 문자로 구성됨이 소스에 드러나므로 각 평문 바이트 후보는 16개다. 뒤에서부터 원하는 패딩값으로 이전 암호 블록을 조정하고, 성공하는 후보를 하나씩 확정한다.

## 최종 익스플로잇

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

## 최종 플래그

```text
crypto{if_you_ask_enough_times_you_usually_get_what_you_want}
```
