---
{"title":"Montgomery Curves","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"Montgomery 곡선 By² = x³ + Ax² + x는 x 좌표만으로 빠르게 계산할 수 있다. Weierstrass 곡선을 Montgomery 형태로 바꾼다.","section":["CryptoHack","Isogenies"]}
---

## 개념

**Montgomery 곡선**은 다음 꼴이다.

$$
By^2 = x^3 + Ax^2 + x
$$

장점은 두 가지다.

1. x 좌표만으로 스칼라 곱을 할 수 있다(Montgomery ladder).
2. 아이소제니 계산도 x 좌표만으로 할 수 있다.

CSIDH는 곡선을 계수 $A$ 하나로 나타낸다.

Weierstrass 곡선이 Montgomery 형태로 바뀌려면 위수 2인 점(2-꼬임점)이 있어야 한다. 그 점을 원점으로 옮기고 계수를 정규화하면 된다.

## 문제

$\mathbb{F}_{1912812599}$에서 $y^2 = x^3 + 312589632x + 654443578$을 Montgomery 형태로 바꿨을 때 $A$를 구한다.

## 풀이

SageMath `montgomery_model()`이 위 좌표 변환을 해준다. 결과 곡선의 $a_2$ 계수가 $A =$ **723347356**이다.

## 풀이 코드
```python
from sage.all import GF, EllipticCurve
F=GF(1912812599)
E=EllipticCurve(F,[312589632,654443578])
M=E.montgomery_model()
print(int(M.a2()))
```

## 정답
```text
723347356
```
