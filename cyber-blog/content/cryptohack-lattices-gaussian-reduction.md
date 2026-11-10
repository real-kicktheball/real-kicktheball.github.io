---
{"title":"Gaussian Reduction","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"2차원 격자에서 가우스 축소는 가장 짧은 벡터를 정확히 찾는다. 유클리드 알고리즘의 벡터 버전이다.","section":["CryptoHack","Lattices"]}
---

## 개념

**격자(lattice)**는 기저 벡터들의 **정수** 선형 결합으로 만든 점들의 집합이다.

$$
L = \{ a_1 v_1 + \cdots + a_n v_n \mid a_i \in \mathbb{Z} \}
$$

격자에서 가장 짧은 0이 아닌 벡터를 찾는 문제를 **SVP(Shortest Vector Problem)**라 한다. 차원이 높으면 매우 어렵고, 격자 기반 암호의 안전성이 여기서 나온다.

2차원에서는 **가우스(Lagrange) 축소**로 정확히 풀린다.

1. $\|v_1\| \le \|v_2\|$가 되도록 순서를 맞춘다.
2. $m = \operatorname{round}\left(\frac{v_1 \cdot v_2}{v_1 \cdot v_1}\right)$을 구한다.
3. $m = 0$이면 끝이다.
4. 아니면 $v_2 \leftarrow v_2 - m v_1$로 바꾸고 1로 돌아간다.

유클리드 알고리즘이 나머지를 줄여가는 것과 같은 구조다. 그람-슈미트와 달리 $m$을 **정수로 반올림**하기 때문에 격자가 유지된다.

## 문제

$v = (846835985, 9834798552)$, $u = (87502093, 123094980)$에 가우스 축소를 적용하고 최종 두 벡터의 내적을 구한다.

## 풀이

반올림 계산에서 오차가 나지 않도록 `Fraction`으로 위 과정을 반복했다. 끝났을 때 두 벡터의 내적은 **7410790865146821**이다.

## 풀이 코드
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

## 정답
```text
7410790865146821
```
