---
{"title":"Inferius Prime","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"법 n의 소인수를 FactorDB API에서 조회한다. 인수의 소수성과 곱을 확인한 다음 φ(n)을 계산하여 e의 역원 d로 복호화한다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

법 n의 소인수를 FactorDB API에서 조회한다. 인수의 소수성과 곱을 확인한 다음 φ(n)을 계산하여 e의 역원 d로 복호화한다.

## 최종 풀이 코드

```python
import re, requests
from sympy import isprime
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_cf39018a5db981bd454ddcdcf6595167.txt'
data=requests.get(url,timeout=20).text
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']
r=requests.get('https://factordb.com/api',params={'query':str(n)},timeout=20)
r.raise_for_status()
factors=[int(p) for p,mult in r.json()['factors'] for _ in range(mult)]
assert all(isprime(p) for p in factors)
from math import prod
assert prod(factors)==n
phi=prod(p-1 for p in factors)
d=pow(e,-1,phi)
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

코드를 실행해 아래 결과를 얻었다. 코드의 `assert`로 인수의 소수성, 곱, 복호화 후 재암호화 관계를 검사했다. FactorDB 조회 결과를 이용했으므로 실행 시 네트워크가 필요하다.

```text
crypto{N33d_b1g_pR1m35}
```

## 최종 답

`crypto{N33d_b1g_pR1m35}`
