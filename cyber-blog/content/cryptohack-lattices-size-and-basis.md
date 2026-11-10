---
{"title":"Size and Basis","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"벡터의 크기는 자기 내적의 제곱근이다. 4^2+6^2+2^2+5^2=81이므로 \\v\\=9이다.","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

벡터의 크기는 자기 내적의 제곱근이다. $4^2+6^2+2^2+5^2=81$이므로 $\|v\|=9$이다.

## 최종 풀이 코드

아래 코드를 Python 3에서 실행한다. `sympy`를 가져오는 문제는 `pip install sympy`가 필요하다.

```python
from math import isqrt
v = (4, 6, 2, 5)
squared = sum(x*x for x in v)
root = isqrt(squared)
assert root*root == squared
print(root)
```

## 검증 방법

코드의 표준 출력이 아래 정답과 같은지 확인한다. 같은 값을 CryptoHack 문제의 제출 폼에 넣었을 때 계정에 **solved** 표시가 나타나는 것도 확인했다.

## 최종 정답

```text
9
```
