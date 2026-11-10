---
{"title":"Gram Schmidt","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"Gram–Schmidt의 정사영 계수를 유리수로 계산해 부동소수점 오차를 피했다. 네 번째 직교 벡터의 두 번째 성분은 273/298=0.916107\\ldots이고, 유효숫자 다섯 자리로 0.91611이다.","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

Gram–Schmidt의 정사영 계수를 유리수로 계산해 부동소수점 오차를 피했다. 네 번째 직교 벡터의 두 번째 성분은 $273/298=0.916107\ldots$이고, 유효숫자 다섯 자리로 $0.91611$이다.

## 최종 풀이 코드

```python
from sympy import Matrix, GramSchmidt
basis = [Matrix(v) for v in [(4,1,3,-1), (2,1,-3,4),
                             (1,0,-2,7), (6,2,9,-5)]]
orthogonal = GramSchmidt(basis, orthonormal=False)
from sympy import Rational
assert orthogonal[3][1] == Rational(273,298)
print(format(float(orthogonal[3][1]), '.5g'))
```

## 최종 정답

```text
0.91611
```
