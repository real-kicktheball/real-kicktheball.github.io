---
{"title":"Size and Basis","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"벡터의 크기(노름)는 자기 내적의 제곱근이다. 기저는 공간을 만드는 일차독립 벡터들이다.","section":["CryptoHack","Lattices"]}
---

## 개념

벡터의 **크기(노름)**는 다음과 같다.

$$
\|v\| = \sqrt{v \cdot v} = \sqrt{v_1^2 + \cdots + v_n^2}
$$

**기저(basis)**는 일차독립인 벡터들의 집합이다. 이 벡터들의 선형 결합으로 공간 전체를 만들 수 있다. 같은 공간에도 기저는 여러 개가 있다. 서로 직교하는 기저(직교 기저)가 계산하기 가장 편하다.

격자 문제에서는 "짧은 벡터"를 찾는 게 핵심이라 노름이 계속 나온다.

## 문제

$v = (4, 6, 2, 5)$의 크기를 구한다.

## 풀이

$4^2 + 6^2 + 2^2 + 5^2 = 16 + 36 + 4 + 25 = 81$이므로 $\|v\| = \sqrt{81} =$ **9**이다.

## 풀이 코드
```python
from math import isqrt
v = (4, 6, 2, 5)
squared = sum(x*x for x in v)
root = isqrt(squared)
assert root*root == squared
print(root)
```

## 정답
```text
9
```
