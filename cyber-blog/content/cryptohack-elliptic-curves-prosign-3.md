---
{"title":"ProSign 3","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"ECDSA의 nonce k가 작은 범위에서 나오면 r을 비교해 k를 찾고 개인키를 바로 계산할 수 있다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

**ECDSA 서명**은 다음과 같다. $G$의 위수는 $n$, 개인키는 $d$, 해시는 $z$다.

1. 랜덤 nonce $k$를 고른다.
2. $r = (kG)_x \bmod n$을 계산한다.
3. $s = k^{-1}(z + rd) \bmod n$을 계산한다.

$k$를 알면 식을 정리해서 개인키가 바로 나온다.

$$
d = (sk - z) \cdot r^{-1} \bmod n
$$

그래서 nonce는 완전히 랜덤이고 비밀이어야 한다. 재사용하거나 범위가 좁으면 안 된다. PS3 서명 키가 nonce 재사용으로 유출된 사건이 유명하다(문제 이름의 유래).

## 문제

서버가 현재 시각 메시지에 ECDSA(P-192) 서명을 해준다(`sign_time`). `unlock`에 대한 유효한 서명을 보내면 플래그를 준다.

## 풀이

1. 코드를 보면 `n`이 곡선 위수가 아니라 **현재 초(0~59)**로 덮어써진다. 그래서 `k = randrange(1, n)`은 59 이하다.
2. 서명 하나를 받아서 $k = 1, 2, \dots$마다 $(kG)_x$를 계산하고 $r$과 같은 $k$를 찾는다.
3. 위 식으로 $d$를 구한다.
4. `unlock`에 직접 서명해서 보내면 플래그를 받는다.

## 풀이 코드
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

## 플래그
`crypto{ECDSA_700_345y_70_5cr3wup}`
