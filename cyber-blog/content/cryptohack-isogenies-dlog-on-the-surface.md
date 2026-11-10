---
{"title":"DLOG on the Surface","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"곡선의 두 기저 P,Q에 대해 Weil pairing의 쌍선형성을 이용한다. g=e_n(P,Q)라면 e_n(R,Q)=g^a이고 e_n(P,R)=g^b다. 같은 방식으로 S의 계수 c,d도 구한다. n=p+1=2^{127}이므로 이 군의 이산…","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

곡선의 두 기저 $P,Q$에 대해 Weil pairing의 쌍선형성을 이용한다. $g=e_n(P,Q)$라면 $e_n(R,Q)=g^a$이고 $e_n(P,R)=g^b$다. 같은 방식으로 $S$의 계수 $c,d$도 구한다. $n=p+1=2^{127}$이므로 이 군의 이산로그는 Pohlig–Hellman 방식으로 쉽게 계산된다. 복원한 네 정수의 십진 문자열을 이어 붙여 SHA-256 키를 만들고 AES-CBC를 복호화한다.

## 최종 풀이 코드

```python
from sage.all import *
from urllib.request import urlopen
import re,hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
p=2**127-1;n=p+1
F.<i>=GF(p^2,modulus=[1,0,1])
E=EllipticCurve(F,[1,0])
text=urlopen('https://cryptohack.org/static/challenges/output_a9fcd0db30822de938de639df287ab54.txt').read().decode()
pts={}
for label,x,y in re.findall(r'([PQRS]) = \((.*?) : (.*?) : 1\)',text):
 pts[label]=E(sage_eval(x,locals={'i':i}),sage_eval(y,locals={'i':i}))
P,Q,R,S=[pts[x] for x in 'PQRS']
base=P.weil_pairing(Q,n)
a=discrete_log(R.weil_pairing(Q,n),base,ord=n)
b=discrete_log(P.weil_pairing(R,n),base,ord=n)
c=discrete_log(S.weil_pairing(Q,n),base,ord=n)
d=discrete_log(P.weil_pairing(S,n),base,ord=n)
assert R==a*P+b*Q and S==c*P+d*Q
key=hashlib.sha256((str(a)+str(b)+str(c)+str(d)).encode()).digest()
iv=bytes.fromhex(re.search(r"iv = '(.*?)'",text).group(1))
ct=bytes.fromhex(re.search(r"ct = '(.*?)'",text).group(1))
print(unpad(AES.new(key,AES.MODE_CBC,iv).decrypt(ct),16).decode())
```

## 최종 플래그

```text
crypto{now_try_writing_a_function_for_fast_torsion_basis_generation!}
```
