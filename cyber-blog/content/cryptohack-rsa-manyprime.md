---
{"title":"Manyprime","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"멀티프라임 RSA는 φ(N) = ∏(p_i - 1)이다. 소수들이 작으면 ECM으로 쉽게 인수분해된다.","section":["CryptoHack","RSA"]}
---

## 개념

$N$을 두 개가 아니라 **여러 소수의 곱**으로 만들 수도 있다(멀티프라임 RSA).

$$
N = p_1 p_2 \cdots p_k, \qquad \varphi(N) = \prod_i (p_i - 1)
$$

$N$의 전체 크기가 같아도 인수 하나하나는 작아진다. **타원곡선 인수분해(ECM)**는 작은 인수를 찾는 데 특히 강하다. 그래서 인수가 많을수록 불리하다.

## 문제

2033비트 $N$과 $e$, 암호문이 주어진다. $N$은 64비트 정도의 작은 소수 32개를 곱한 수다.

## 풀이

1. $N$의 모든 소인수를 구한다(FactorDB에 등록돼 있었다).
2. $\varphi(N) = \prod (p_i - 1)$로 $d$를 계산해 복호화한다.

## 풀이 코드
```python
import re, requests
from sympy import isprime
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_5a478a5d4764257d0bbdfaed340fcbdd.txt'
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
`crypto{700_m4ny_5m4ll_f4c70r5}`
