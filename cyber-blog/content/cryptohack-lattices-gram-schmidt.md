---
{"title":"Gram Schmidt","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"Gram–Schmidt의 정사영 계수를 유리수로 계산해 부동소수점 오차를 피했다. 네 번째 직교 벡터의 두 번째 성분은 273/298=0.916107\\ldots이고, 유효숫자 다섯 자리로 0.91611이다.","section":["CryptoHack","Lattices"]}
---

분야: Lattices / lattices  
문제: https://cryptohack.org/challenges/post-quantum/#gramschmidt  
검증: 2026-11-10, 로컬 실행 및 CryptoHack 계정 정답 처리 확인

## 풀이 방법

Gram–Schmidt의 정사영 계수를 유리수로 계산해 부동소수점 오차를 피했다. 네 번째 직교 벡터의 두 번째 성분은 $273/298=0.916107\ldots$이고, 유효숫자 다섯 자리로 $0.91611$이다.

## 최종 풀이 코드

아래 코드를 Python 3에서 실행한다. `sympy`를 가져오는 문제는 `pip install sympy`가 필요하다.

```python
from sympy import Matrix, GramSchmidt
basis = [Matrix(v) for v in [(4,1,3,-1), (2,1,-3,4),
                             (1,0,-2,7), (6,2,9,-5)]]
orthogonal = GramSchmidt(basis, orthonormal=False)
from sympy import Rational
assert orthogonal[3][1] == Rational(273,298)
print(format(float(orthogonal[3][1]), '.5g'))
```

## 검증 방법

코드의 표준 출력이 아래 정답과 같은지 확인한다. 같은 값을 CryptoHack 문제의 제출 폼에 넣었을 때 계정에 **solved** 표시가 나타나는 것도 확인했다.

## 최종 정답

```text
0.91611
```
