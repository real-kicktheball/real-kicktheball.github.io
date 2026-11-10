---
{"title":"Special Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"CSIDH는 p = 4·ℓ1·ℓ2···ℓn - 1을 써서 F_p 위에서 ℓ-꼬임점을 바로 얻는다. p=419에서 5-아이소제니를 계산한다.","section":["CryptoHack","Isogenies"]}
---

## 개념

**CSIDH**는 다음 형태의 소수를 쓴다.

$$
p = 4 \cdot \ell_1 \ell_2 \cdots \ell_n - 1
$$

$\mathbb{F}_p$ 위 초특이 곡선은 점이 $p + 1 = 4 \prod \ell_i$개다. 그래서 각 $\ell_i$에 대해 위수 $\ell_i$인 점을 $\mathbb{F}_p$ 안에서 바로 얻을 수 있다.

1. 아무 점 $P$를 고른다.
2. $\frac{p+1}{\ell} P$를 계산하면 위수가 $\ell$(또는 1)이 된다.

장난감 예시로 $p = 419 = 4 \cdot 3 \cdot 5 \cdot 7 - 1$을 쓰고 시작 곡선은 $E_0: y^2 = x^3 + x$이다.

## 문제

$E_0$에서 5-아이소제니를 한 번 걷고 공역의 Montgomery 계수 $A$를 구한다.

## 풀이

1. $E_0(\mathbb{F}_{419})$는 위수 420인 순환군이다.
2. 생성원에 $420/5 = 84$를 곱해 위수 5인 점 $K$를 만든다.
3. 커널 $\langle K \rangle$인 아이소제니의 공역을 Montgomery 형태로 바꾸면 $A =$ **199**이다.

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
E=step(E0,5)
A=E.montgomery_model().a2()
print(A)
```

## 플래그
```text
199
```
