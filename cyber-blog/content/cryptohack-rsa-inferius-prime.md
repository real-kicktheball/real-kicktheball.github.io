---
{"title":"Inferius Prime","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"N이 작으면 바로 인수분해되어 RSA가 깨진다.","section":["CryptoHack","RSA"]}
---

## 개념

RSA 공격의 가장 기본적인 형태다. $N$을 인수분해할 수 있으면 개인키가 바로 나온다.

$$
N = pq \ \rightarrow\ \varphi(N) = (p-1)(q-1) \ \rightarrow\ d = e^{-1} \bmod \varphi(N)
$$

## 문제

키 생성 코드가 100비트 소수를 써서 $N$이 200비트밖에 안 된다. $n$, $e$, 암호문이 주어진다.

## 풀이

1. $n$을 인수분해한다(FactorDB 조회). 인수들이 소수이고 곱이 $n$인지 확인한다.
2. $\varphi(n)$과 $d$를 계산한다.
3. $m = c^d \bmod n$을 바이트로 바꾸면 플래그가 나온다.

## 풀이 코드
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

## 정답
`crypto{N33d_b1g_pR1m35}`
