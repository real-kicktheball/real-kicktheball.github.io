---
{"title":"Factoring","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"150비트 정도의 법은 FactorDB에 소인수분해 결과가 올라와 있어서 API로 바로 조회할 수 있다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

150비트 법은 공개된 소인수분해 결과를 FactorDB API에서 조회할 수 있다. 두 소수의 곱이 원래 법과 같은지, 각 인수가 실제 소수인지 독립 확인했다.

## 최종 풀이 코드

```python
import requests
from sympy import isprime
n=510143758735509025530880200653196460532653147
r=requests.get('https://factordb.com/api',params={'query':str(n)},timeout=20)
r.raise_for_status()
factors=[int(p) for p,mult in r.json()['factors'] for _ in range(mult)]
assert len(factors)==2 and all(isprime(p) for p in factors)
assert factors[0]*factors[1]==n
print(min(factors))
```

## 최종 답

`19704762736204164635843`
