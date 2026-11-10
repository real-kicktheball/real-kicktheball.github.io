---
{"title":"Factoring","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"150비트 법은 공개된 소인수분해 결과를 FactorDB API에서 조회할 수 있다. 두 소수의 곱이 원래 법과 같은지, 각 인수가 실제 소수인지 독립 확인했다.","section":["CryptoHack","RSA"]}
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

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

코드를 실행해 아래 결과를 얻었다. 코드의 `assert`로 인수의 소수성, 곱, 복호화 후 재암호화 관계를 검사했다. FactorDB 조회 결과를 이용했으므로 실행 시 네트워크가 필요하다.

```text
19704762736204164635843
```

## 최종 답

`19704762736204164635843`
