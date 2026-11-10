---
{"title":"Two Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"커널 생성자 K=(i,0)는 2차 점이다. SageMath로 커널이 \\\\langle K\\\\rangle인 2-isogeny를 계산하고 공역 곡선의 j-불변량을 구한다.","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

커널 생성자 $K=(i,0)$는 2차 점이다. SageMath로 커널이 $\\langle K\\rangle$인 2-isogeny를 계산하고 공역 곡선의 $j$-불변량을 구한다.

## 최종 풀이 코드

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

## 최종 플래그

```text
287496
```
