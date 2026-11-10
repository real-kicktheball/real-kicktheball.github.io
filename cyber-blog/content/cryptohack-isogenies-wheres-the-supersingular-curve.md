---
{"title":"Where's the Supersingular Curve","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"초특이 곡선은 점 개수가 p+1 꼴인 특별한 곡선으로, 아이소제니 암호의 무대다. 후보 100개 중 하나를 찾는다.","section":["CryptoHack","Isogenies"]}
---

## 개념

$\mathbb{F}_p$ 위 곡선은 trace $t = p + 1 - \#E(\mathbb{F}_p)$가 $p$의 배수이면 **초특이(supersingular)**다. $p > 3$이면 $t = 0$, 즉 $\#E(\mathbb{F}_p) = p + 1$이다.

초특이 곡선의 성질은 다음과 같다.

- 모두 $\mathbb{F}_{p^2}$ 위에 정의되고, 개수가 약 $p/12$개로 유한하다.
- $\ell$-아이소제니 그래프가 확장 그래프(expander)라서 랜덤 워크가 잘 섞인다.

그래서 SIDH, CSIDH 같은 아이소제니 암호가 이 곡선들 위에서 동작한다. 랜덤하게 고른 곡선이 초특이일 확률은 아주 낮다.

## 문제

$p = 2^{127} - 1$ 위의 Montgomery 계수 100개가 주어진다. 이 중 초특이 곡선이 하나 있다.

## 풀이

계수마다 곡선 $y^2 = x^3 + Ax^2 + x$를 만든다. SageMath의 `is_supersingular()`로 판정하면 참이 되는 $A$가 하나 나온다.

## 풀이 코드
```python
from sage.all import GF, EllipticCurve
from urllib.request import urlopen
import ast, re
URL = "https://cryptohack.org/static/challenges/curves_1e476e7d608576c05a13b269d1481602.sage"
source = urlopen(URL).read().decode()
coefficients = ast.literal_eval(re.search(r'A_coefficients = (\[.*?\])', source, re.S).group(1))
F=GF(2**127-1)
for A in coefficients:
    E=EllipticCurve(F,[0,A,0,1,0])
    if E.is_supersingular(): print(A)
```

## 정답
```text
170141183460469230846243588177825628225
```
