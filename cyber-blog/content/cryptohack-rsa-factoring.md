---
{"title":"Factoring","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"RSA의 안전성은 N을 인수분해하기 어렵다는 데 있다. 150비트 정도는 쉽게 인수분해된다.","section":["CryptoHack","RSA"]}
---

## 개념

RSA의 모든 비밀은 **$N$을 두 소수로 쪼개기 어렵다**는 데 달려 있다.

- 곱하기는 쉽다: $61 \times 53 = 3233$ (금방 계산된다)
- 쪼개기는 어렵다: "3233은 무엇과 무엇의 곱일까?" (하나씩 나눠봐야 한다)

### 직접 해보기 (3233 쪼개기)

2, 3, 5, 7, … 차례로 나눠본다. 47까지는 다 나머지가 생기고, 53에서 처음 나누어떨어진다.

$$
3233 = 53 \times 61
$$

네 자리 수도 꽤 걸린다. 그런데 RSA의 $N$은 **600자리가 넘는다**. 이 정도면 세상의 모든 컴퓨터를 동원해도 쪼갤 수 없다.

### 그런데 이 문제는?

이 문제의 $N$은 150비트(약 45자리)라서 작다. 이미 누군가 쪼개서 **FactorDB**라는 인터넷 사전에 올려놨다. 거기서 찾아보면 바로 나온다. 키가 작으면 안 되는 이유다.

### 정리

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
