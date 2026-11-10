---
{"title":"Successive Powers","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"연속된 거듭제곱 x^i mod p 값만 보고 p와 x를 역산한다. 이웃한 세 값의 관계식과 GCD를 쓴다.","section":["CryptoHack","Mathematics"]}
---

## 개념

어떤 수 $x$를 계속 곱한 결과를 $p$로 나눈 나머지 목록이 있다.

$$
x^1,\ x^2,\ x^3,\ \dots \pmod p
$$

목록만 보고 $p$와 $x$를 맞히는 퀴즈다.

### 핵심 아이디어

목록에서 이웃한 세 개 $a, b, c$를 보자. $b = a \times x$, $c = b \times x$이니까 다음이 성립한다.

$$
a \times c = a \times (a \times x^2) = (a \times x)^2 = b^2
$$

나머지 세계에서는 "같다"가 아니라 "$p$로 나눈 나머지가 같다"다. 그래서 $a \times c - b^2$은 **항상 $p$의 배수**가 된다.

### 직접 해보기 ($p = 7$, $x = 3$)

목록: $3, 2, 6, 4, 5, 1$ ($3^1=3$, $3^2=9 \equiv 2$, $3^3 \equiv 6$, …)

- $3 \times 6 - 2^2 = 18 - 4 = 14 = 7 \times 2$ ✔
- $2 \times 4 - 6^2 = 8 - 36 = -28 = 7 \times (-4)$ ✔

여러 개를 계산하고 최대공약수를 구하면 공통으로 들어 있는 **7**이 나온다. $p$를 알면 $x = b \div a$(나머지 세계의 나눗셈)로 구한다.

### 정리

어떤 수열이 $a_{i+1} \equiv a_i \cdot x \pmod p$ 관계(등비수열)를 가지면 이웃한 세 항 사이에 다음 식이 성립한다.

$$
a_i \cdot a_{i+2} \equiv a_i \cdot a_i x^2 = (a_i x)^2 \equiv a_{i+1}^2 \pmod p
$$

즉 $a_i a_{i+2} - a_{i+1}^2$은 항상 $p$의 배수다. 이런 식을 여러 개 만들고 GCD를 구하면 공통 인수인 $p$가 남는다.

## 문제

어떤 3자리 소수 $p$와 정수 $x$에 대해 $x^k \bmod p$를 연속으로 계산한 값들이 주어진다.

```
588, 665, 216, 113, 642, 4, 836, 114, 851, 492, 819, 237
```

## 풀이

1. $a_i a_{i+2} - a_{i+1}^2$을 10개 계산하고 모두의 GCD를 구하면 $p = 919$가 나온다. 세 자리 소수 조건에도 맞는다.
2. $x \equiv a_1 \cdot a_0^{-1} = 665 \cdot 588^{-1} \pmod{919}$를 계산하면 $x = 209$이다.
3. $x$를 연속으로 곱해서 나머지 값이 모두 맞는지 확인한다.

답은 `crypto{919,209}`이다.

## 풀이 코드
```python
from functools import reduce
from math import gcd
from sympy import isprime
values=[588,665,216,113,642,4,836,114,851,492,819,237]
p=reduce(gcd,(abs(values[i]*values[i+2]-values[i+1]**2) for i in range(len(values)-2)))
assert 100<=p<=999 and isprime(p)
x=values[1]*pow(values[0],-1,p)%p
assert all(values[i]*x%p==values[i+1] for i in range(len(values)-1))
print(f'crypto{{{p},{x}}}')
```

## 정답
`crypto{919,209}`
