---
{"title":"Gaussian Reduction","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"짧은 벡터를 앞으로 두고 긴 벡터에서 가장 가까운 정수배를 반복해서 뺐다. 두 기저가 더 줄어들지 않을 때의 내적을 출력한다.","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

짧은 벡터를 앞으로 두고 긴 벡터에서 가장 가까운 정수배를 반복해서 뺐다. 두 기저가 더 줄어들지 않을 때의 내적을 출력한다.

## 최종 풀이 코드

```python
from fractions import Fraction

def dot(a, b):
    return sum(x*y for x,y in zip(a,b))

def nearest_integer(x):
    return (x.numerator + x.denominator//2) // x.denominator if x >= 0 else -nearest_integer(-x)

a = (846835985, 9834798552)
b = (87502093, 123094980)
while True:
    if dot(b,b) < dot(a,a):
        a,b = b,a
    m = nearest_integer(Fraction(dot(a,b), dot(a,a)))
    if m == 0:
        break
    b = tuple(y-m*x for x,y in zip(a,b))
print(dot(a,b))
```

## 최종 정답

```text
7410790865146821
```
