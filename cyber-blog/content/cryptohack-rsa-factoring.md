---
{"title":"Factoring","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"RSA의 안전성은 N을 인수분해하기 어렵다는 데 있다. 150비트 정도는 쉽게 인수분해된다.","section":["CryptoHack","RSA"]}
---

## 개념

RSA는 $N = pq$에서 $p$, $q$를 찾기 어렵다는 가정 위에 서 있다. $N$이 인수분해되면 다음 순서로 개인키가 바로 나온다.

$$
\varphi(N) = (p-1)(q-1), \qquad d = e^{-1} \bmod \varphi(N)
$$

인수분해 난이도는 $N$의 크기에 달려 있다.

- 수백 비트 이하는 일반 PC로도 금방 인수분해된다.
- 현재 공개 기록은 RSA-250(829비트)이다.
- 그래서 실제로는 2048비트 이상을 쓴다.

이미 누군가 인수분해한 수는 **FactorDB**에서 바로 조회할 수 있다.

## 문제

150비트 수 $n = 510143758735509025530880200653196460532653147$을 두 소수로 인수분해하고 작은 쪽을 제출한다.

## 풀이

FactorDB API에 $n$을 조회했다. 두 인수가 모두 소수이고 곱이 $n$인 것을 확인했다. 작은 인수가 답이다.

## 풀이 코드
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

## 정답
`19704762736204164635843`
