---
{"title":"Two Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"위수 2인 점 하나를 커널로 하는 2-아이소제니를 계산하고 공역 곡선의 j-불변량을 구한다.","section":["CryptoHack","Isogenies"]}
---

## 개념

**$\ell$-아이소제니**는 커널이 위수 $\ell$인 순환군인 아이소제니다. 가장 간단한 2-아이소제니는 위수 2인 점 $K = (x_0, 0)$ 하나가 커널을 만든다. 위수 2인 점은 y 좌표가 0인 점이다.

Vélu 공식은 커널의 점들로 공역 곡선의 계수를 직접 계산해준다.

이 문제들은 SIDH 스타일 소수 $p = 2^{18} \cdot 3^{13} - 1$을 쓴다. $\mathbb{F}_{p^2} = \mathbb{F}_p(i)$, $i^2 = -1$ 위의 곡선 $E: y^2 = x^3 + x$이다. 이 곡선은 초특이(supersingular)라 $2^{18}$, $3^{13}$ 꼬임점이 모두 $\mathbb{F}_{p^2}$에 있다.

## 문제

$K = (i, 0)$을 커널로 하는 2-아이소제니의 공역 j-불변량을 구한다.

## 풀이

$i^3 + i = -i + i = 0$이라 $K$는 곡선 위의 위수 2인 점이다. SageMath `E.isogeny(K)`로 아이소제니를 만들고 공역의 j-불변량을 읽으면 **287496**이다($= 66^3$).

## 풀이 코드
```python
p=2**18*3**13-1
F.<i>=GF(p**2,modulus=[1,0,1])
E=EllipticCurve(F,[1,0])
K=E(i,0)
phi=E.isogeny(K)
assert phi.degree()==2
j=phi.codomain().j_invariant()
print(j)
```

## 플래그
```text
287496
```
