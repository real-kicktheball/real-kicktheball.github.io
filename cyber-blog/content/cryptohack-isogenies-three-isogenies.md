---
{"title":"Three Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"제공된 3차 점 K를 커널 생성자로 사용한다. E.isogeny(K)가 Vélu 공식으로 isogeny를 만들고 공역 곡선에서 j-불변량을 읽는다.","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

제공된 3차 점 $K$를 커널 생성자로 사용한다. `E.isogeny(K)`가 Vélu 공식으로 isogeny를 만들고 공역 곡선에서 $j$-불변량을 읽는다.

## 최종 풀이 코드

```python
p=2**18*3**13-1
F.<i>=GF(p**2,modulus=[1,0,1])
E=EllipticCurve(F,[1,0])
K=E(483728976,174842350631)
phi=E.isogeny(K)
assert phi.degree()==3
j=phi.codomain().j_invariant()
print(j)
```

## 최종 플래그

```text
96392670793
```
