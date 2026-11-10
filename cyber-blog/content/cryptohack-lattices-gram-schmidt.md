---
{"title":"Gram Schmidt","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"그람-슈미트 과정은 아무 기저를 직교 기저로 바꾼다. LLL 알고리즘의 기본 재료다.","section":["CryptoHack","Lattices"]}
---

## 개념

비스듬한 기저를 **서로 직각인 기저**로 바꾸는 방법이 **그람-슈미트 과정**이다.

### 그림자 빼기 비유

막대 두 개가 비스듬하게 서 있다. 두 번째 막대에서 **첫 번째 막대 방향으로 드리운 그림자**를 빼면, 첫 번째 막대와 직각인 부분만 남는다.

### 직접 해보기 ($v_1 = (2, 0)$, $v_2 = (1, 1)$)

1. 첫 번째는 그대로 둔다: $u_1 = (2, 0)$
2. $v_2$가 $u_1$ 방향으로 얼마나 기울었는지 비율을 구한다.

$$
\mu = \frac{v_2 \cdot u_1}{u_1 \cdot u_1} = \frac{2}{4} = \frac{1}{2}
$$

3. 그 비율만큼 빼준다.

$$
u_2 = (1, 1) - \tfrac{1}{2}(2, 0) = (1, 1) - (1, 0) = (0, 1)
$$

확인해보면 $u_1 \cdot u_2 = 0$이다. 정말 직각이 됐다. 이 과정은 다음 단원의 LLL 알고리즘에서 중요하게 쓰인다.

### 정리

**그람-슈미트 과정**은 기저 $v_1, \dots, v_n$을 서로 직교하는 기저 $u_1, \dots, u_n$으로 바꾼다. 각 벡터에서 앞서 만든 직교 벡터 방향 성분(정사영)을 빼는 방식이다.

$$
u_1 = v_1, \qquad
u_i = v_i - \sum_{j < i} \mu_{ij} u_j, \qquad
\mu_{ij} = \frac{v_i \cdot u_j}{u_j \cdot u_j}
$$

여기서 $\mu_{ij}$는 정수가 아니다. 그래서 결과는 일반적으로 같은 **격자**의 기저가 아니다. 하지만 기저가 얼마나 "직교에 가까운지" 재는 기준이 된다. 그래서 LLL 알고리즘에서 쓰인다.

## 문제

다음 기저를 직교화했을 때 $u_4$의 두 번째 성분을 유효숫자 5자리로 구한다.

$$
v_1 = (4, 1, 3, -1),\ v_2 = (2, 1, -3, 4),\ v_3 = (1, 0, -2, 7),\ v_4 = (6, 2, 9, -5)
$$

## 풀이

부동소수점 오차를 피하려고 유리수로 계산했다(SymPy `GramSchmidt`). $u_4$의 두 번째 성분은 $\frac{273}{298} = 0.916107\ldots$이다. 유효숫자 5자리로 **0.91611**이다.

## 풀이 코드
```python
from sympy import Matrix, GramSchmidt
basis = [Matrix(v) for v in [(4,1,3,-1), (2,1,-3,4),
                             (1,0,-2,7), (6,2,9,-5)]]
orthogonal = GramSchmidt(basis, orthonormal=False)
from sympy import Rational
assert orthogonal[3][1] == Rational(273,298)
print(format(float(orthogonal[3][1]), '.5g'))
```

## 정답
```text
0.91611
```
