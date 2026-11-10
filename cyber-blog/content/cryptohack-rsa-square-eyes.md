---
{"title":"Square Eyes","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"법 n=p²이므로 p=√n이고 φ(n)=p(p−1)이다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

법 n=p²이므로 p=√n이고 φ(n)=p(p−1)이다.

## 최종 풀이 코드

```python
import re, urllib.request
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_00dace150c0bc52f7abf03fc3e9529d2.txt'
data=urllib.request.urlopen(url).read().decode()
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']

from math import isqrt
p=isqrt(n)
assert p*p==n
d=pow(e,-1,p*(p-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. p²=n 및 RSA 재암호화를 확인한다.

```text
crypto{squar3_r00t_i5_f4st3r_th4n_f4ct0r1ng!}
```

## 최종 플래그

`crypto{squar3_r00t_i5_f4st3r_th4n_f4ct0r1ng!}`
