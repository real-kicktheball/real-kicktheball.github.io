---
{"title":"Prime Power Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"매 단계에서 현재 곡선의 \\\\mathbb{F}_{419}-유리 7-꼬임점을 만들어 7-isogeny를 적용한다. 시작 곡선의 j-불변량이 처음 다시 나타나는 시점이 27번째다. 이때 Montgomery 계수도 0으로 돌아오는지 확인한다.","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

매 단계에서 현재 곡선의 $\\mathbb{F}_{419}$-유리 7-꼬임점을 만들어 7-isogeny를 적용한다. 시작 곡선의 $j$-불변량이 처음 다시 나타나는 시점이 27번째다. 이때 Montgomery 계수도 0으로 돌아오는지 확인한다.

## 최종 풀이 코드

아래 코드를 `solve.sage`로 저장하고 `sage solve.sage`로 실행한다.

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
for count in range(1,80):
    E=step(E,7)
    if E.j_invariant()==E0.j_invariant():
        assert E.montgomery_model().a2()==0
        print(count)
        break
```

## 검증 방법

코드의 `assert`가 커널과 isogeny의 차수를 검사한다. 결과가 아래 플래그와 일치한다.

## 최종 플래그

```text
27
```
