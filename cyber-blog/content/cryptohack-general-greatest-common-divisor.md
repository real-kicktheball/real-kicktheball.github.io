---
{"title":"Greatest Common Divisor","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"유클리드 알고리즘으로 두 수의 최대공약수를 구한다. gcd(a,b) = gcd(b, a mod b).","section":["CryptoHack","General"]}
---

## 개념

**최대공약수(GCD)**는 두 수를 모두 나누는 가장 큰 양의 정수다. **유클리드 알고리즘**은 다음 성질을 반복해서 GCD를 빠르게 구한다.

$$
\gcd(a, b) = \gcd(b,\ a \bmod b), \qquad \gcd(a, 0) = a
$$

$\gcd(a,b)=1$이면 두 수를 **서로소**라 한다. RSA에서 $e$와 $\varphi(N)$이 서로소여야 하는 것처럼, 이후 문제들에서 계속 등장하는 조건이다.

## 문제

$a = 66528$, $b = 52920$의 최대공약수를 구한다.

## 풀이

유클리드 알고리즘을 직접 돌려보면 다음과 같다.

$$
\begin{aligned}
66528 &= 1 \cdot 52920 + 13608 \\
52920 &= 3 \cdot 13608 + 12096 \\
13608 &= 1 \cdot 12096 + 1512 \\
12096 &= 8 \cdot 1512 + 0
\end{aligned}
$$

나머지가 0이 되기 직전의 값인 **1512**가 답이다.

## 풀이 코드
```python
from math import gcd
print(gcd(66528,52920))
```

## 플래그
```text
1512
```
