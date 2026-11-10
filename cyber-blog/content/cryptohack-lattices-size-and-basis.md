---
{"title":"Size and Basis","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"벡터의 크기는 자기 내적의 제곱근이다. 4^2+6^2+2^2+5^2=81이므로 \\v\\=9이다.","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

벡터의 크기는 자기 내적의 제곱근이다. $4^2+6^2+2^2+5^2=81$이므로 $\|v\|=9$이다.

## 최종 풀이 코드

```python
from math import isqrt
v = (4, 6, 2, 5)
squared = sum(x*x for x in v)
root = isqrt(squared)
assert root*root == squared
print(root)
```

## 최종 정답

```text
9
```
