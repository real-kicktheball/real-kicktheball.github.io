---
{"title":"Successive Powers","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"연속 거듭제곱 a_i는 a_i·a_(i+2)−a_(i+1)²가 모두 p의 배수다. 여러 식의 최대공약수로 p를 얻고, x=a_(i+1)·a_i⁻¹ mod p를 구한다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

연속 거듭제곱 a_i는 a_i·a_(i+2)−a_(i+1)²가 모두 p의 배수다. 여러 식의 최대공약수로 p를 얻고, x=a_(i+1)·a_i⁻¹ mod p를 구한다.

## 최종 풀이 코드

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

## 최종 답

`crypto{919,209}`
