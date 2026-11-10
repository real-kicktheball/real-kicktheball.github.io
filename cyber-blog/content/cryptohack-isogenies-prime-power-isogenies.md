---
{"title":"Prime Power Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"한 소수 ℓ로만 계속 걸으면 아이소제니 그래프에서 사이클을 돈다. 7-아이소제니 사이클의 길이를 구한다.","section":["CryptoHack","Isogenies"]}
---

## 개념

CSIDH의 $\ell$-아이소제니 그래프는 **사이클 모양**이다. 같은 방향으로 계속 걸으면 언젠가 출발점으로 돌아온다. 이 사이클 길이는 클래스 군에서 해당 아이디얼 $\mathfrak{l}$의 위수와 같다.

이걸 직접 확인해보면 CSIDH의 작용이 군 작용이라는 걸 체감할 수 있다.

## 문제

$p = 419$, $E_0: y^2 = x^3 + x$에서 7-아이소제니를 한 방향으로 계속 걸을 때 처음으로 $E_0$로 돌아오는 단계 수를 구한다.

## 풀이

1. 매 단계 $\frac{\#E}{7} \cdot G$로 위수 7인 커널 점을 만들고 7-아이소제니를 걷는다.
2. 처음으로 j-불변량이 $E_0$와 같아지는 것은 **27**번째다.
3. 그때 Montgomery 계수도 $A = 0$($E_0$)으로 돌아온 것을 확인했다.

## 풀이 코드
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

## 플래그
```text
27
```
