---
{"title":"Monoprime","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"RSA 법 n 자체가 소수이므로 φ(n)=n−1이다. e의 역원을 구해 복호화한다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

RSA 법 n 자체가 소수이므로 φ(n)=n−1이다. e의 역원을 구해 복호화한다.

## 최종 풀이 코드

```python
import re, urllib.request
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_086036e35349a406b94bfac9a7af6cca.txt'
data=urllib.request.urlopen(url).read().decode()
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']

from sympy import isprime
assert isprime(n)
d=pow(e,-1,n-1)
m=pow(c,d,n)
assert pow(m,e,n)==c
flag=long_to_bytes(m).decode()
print(flag)
```

## 최종 플래그

`crypto{0n3_pr1m3_41n7_pr1m3_l0l}`
