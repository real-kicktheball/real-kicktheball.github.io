---
{"title":"Smooth Criminal","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"곡선 군의 차수를 소인수분해하면 큰 인수가 없고 Pohlig–Hellman으로 이산로그를 빠르게 계산할 수 있다. Alice 공개키 A=nG에서 n을 복원한 뒤 Bob 공개키 B에 곱해 공유점의 x 좌표를 구한다. 이를 10진 문자열로 SH…","section":["CryptoHack","Elliptic Curves"]}
---

## 풀이 원리

곡선 군의 차수를 소인수분해하면 큰 인수가 없고 Pohlig–Hellman으로 이산로그를 빠르게 계산할 수 있다. Alice 공개키 `A=nG`에서 `n`을 복원한 뒤 Bob 공개키 `B`에 곱해 공유점의 x 좌표를 구한다. 이를 10진 문자열로 SHA-1 해시한 앞 16바이트가 AES-CBC 키다.

## 최종 풀이 코드

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

## 최종 플래그

`crypto{n07_4ll_curv3s_4r3_s4f3_curv3s}`
