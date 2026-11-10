---
{"title":"ProSign 3","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"sign_time 안의 변수 n은 곡선 차수가 아니라 현재 초(second)로 덮어쓰기된다. ECDSA nonce k=randrange(1,n)은 최대 59이므로 한 서명에서 r=(kG)_x mod q를 비교해 k를 찾는다. d=(s·k-z…","section":["CryptoHack","Elliptic Curves"]}
---

## 풀이 원리

`sign_time` 안의 변수 `n`은 곡선 차수가 아니라 현재 초(second)로 덮어쓰기된다. ECDSA nonce `k=randrange(1,n)`은 최대 59이므로 한 서명에서 `r=(kG)_x mod q`를 비교해 k를 찾는다. `d=(s·k-z)·r^-1 mod q`로 개인키를 복원하고 `unlock`에 대한 새 서명을 만든다.

## 최종 익스플로잇

Python 3에서 실행한다. `curveball`과 `ps3`에는 `ecdsa` 패키지, `digestive`에는 `requests` 패키지가 필요하다.

```python
import socket,json,hashlib,re
from ecdsa.ecdsa import generator_192
N=generator_192.order()
with socket.create_connection(('socket.cryptohack.org',13381),timeout=10) as sock:
 io=sock.makefile('rwb',buffering=0);io.readline()
 while True:
  io.write(json.dumps({'option':'sign_time'}).encode()+b'\n')
  q=json.loads(io.readline())
  if 'msg' in q:break
 r=int(q['r'],16);s=int(q['s'],16);z=int.from_bytes(hashlib.sha1(q['msg'].encode()).digest(),'big')
 sec=int(q['msg'].rsplit(':',1)[1]);k=next(k for k in range(1,sec) if int((k*generator_192).x())%N==r)
 d=(s*k-z)*pow(r,-1,N)%N
 msg='unlock';h=int.from_bytes(hashlib.sha1(msg.encode()).digest(),'big');k2=42
 r2=int((k2*generator_192).x())%N;s2=(h+r2*d)*pow(k2,-1,N)%N
 io.write(json.dumps({'option':'verify','msg':msg,'r':hex(r2),'s':hex(s2)}).encode()+b'\n')
 reply=json.loads(io.readline())
 print(reply['flag'])

```

## 검증 방법

스크립트를 실행해 아래 출력과 일치하는지 확인한다. `curveball`은 `2g=Q`, `digestive`는 서명 대상의 앞 24바이트가 동일함을 `assert`한다.

```text
crypto{ECDSA_700_345y_70_5cr3wup}
```

## 최종 플래그

`crypto{ECDSA_700_345y_70_5cr3wup}`
