---
{"title":"Smooth Criminal","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"곡선 군의 위수가 작은 소인수로만 이루어지면(smooth) Pohlig–Hellman으로 ECDLP가 쉽게 풀린다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

**Pohlig–Hellman 알고리즘**은 군의 위수 $n$을 소인수분해해서 이산로그를 작은 문제들로 쪼갠다.

$$
n = \prod p_i^{e_i}
$$

1. 각 $p_i^{e_i}$ 부분군에서 $k \bmod p_i^{e_i}$를 구한다. 작은 군이라 BSGS 등으로 금방 된다.
2. CRT로 합쳐서 $k$를 얻는다.

그래서 이산로그의 난이도는 위수의 **가장 큰 소인수**가 결정한다. 안전한 곡선은 위수가 큰 소수(또는 큰 소수 × 작은 cofactor)여야 한다.

## 문제

128비트 소수 $p$ 위의 곡선 $y^2 = x^3 + 2x + 3$, 생성점 $G$, Alice의 공개점 $A$, Bob의 공개점 $B$, 암호문이 주어진다.

## 풀이

1. $G$의 위수를 소인수분해하면 큰 인수 없이 작은 소수들로만 이루어져 있다.
2. SageMath의 `A.log(G)`가 내부에서 Pohlig–Hellman으로 $n$을 구한다.
3. $nB$의 x 좌표로 키를 만들어 복호화한다.

## 풀이 코드
```python
from sage.all import *
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import hashlib
p=310717010502520989590157367261876774703
E=EllipticCurve(GF(p),[2,3])
G=E(179210853392303317793440285562762725654,105268671499942631758568591033409611165)
A=E(280810182131414898730378982766101210916,291506490768054478159835604632710368904)
B=E(272640099140026426377756188075937988094,51062462309521034358726608268084433317)
assert G.order() == 155358505251260494795103074529582338902
n=A.log(G);assert n*G==A
S=n*B;key=hashlib.sha1(str(int(S[0])).encode()).digest()[:16]
iv=bytes.fromhex('07e2628b590095a5e332d397b8a59aa7');ct=bytes.fromhex('8220b7c47b36777a737f5ef9caa2814cf20c1c1ef496ec21a9b4833da24a008d0870d3ac3a6ad80065c138a2ed6136af')
print(unpad(AES.new(key,AES.MODE_CBC,iv).decrypt(ct),16).decode())

```

## 플래그
`crypto{n07_4ll_curv3s_4r3_s4f3_curv3s}`
