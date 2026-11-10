---
{"title":"Twisted CSIDH Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"3-isogeny 그래프의 양의 방향 주기를 먼저 구한다. 시작점의 j-불변량이 27번 후에 되돌아오므로 한 번 역방향 걷기는 양의 방향 26번과 같다. 그 공역의 Montgomery 계수가 261이다.","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

3-isogeny 그래프의 양의 방향 주기를 먼저 구한다. 시작점의 $j$-불변량이 27번 후에 되돌아오므로 한 번 역방향 걷기는 양의 방향 26번과 같다. 그 공역의 Montgomery 계수가 261이다.

## 최종 풀이 코드

```python
F=GF(419)
E0=EllipticCurve(F,[1,0])

def step(E,ell):
    K=(E.order()//ell)*E.gens()[0]
    assert K.order()==ell
    phi=E.isogeny(K)
    assert phi.degree()==ell
    return phi.codomain()
E=E0
for cycle in range(1,80):
    E=step(E,3)
    if E.j_invariant()==E0.j_invariant():
        break
assert cycle==27
E=E0
for _ in range(cycle-1):
    E=step(E,3)
A=E.montgomery_model().a2()
print(A)
```

## 최종 플래그

```text
261
```
