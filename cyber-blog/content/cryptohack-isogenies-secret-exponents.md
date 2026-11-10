---
{"title":"Secret Exponents","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"CSIDH의 비밀키는 각 ℓ마다 몇 번 걸을지 정한 지수 벡터다. [2,3,4]만큼 3,5,7-아이소제니를 걸어 공개키를 만든다.","section":["CryptoHack","Isogenies"]}
---

## 개념

CSIDH에서 **비밀키**는 정수 벡터 $(e_1, \dots, e_n)$이다. $\ell_i$-아이소제니를 $|e_i|$번 걷는다는 뜻이고, 부호는 방향을 정한다. **공개키**는 도착한 곡선의 계수 $A$다.

$$
E_A = [\mathfrak{l}_1^{e_1} \cdots \mathfrak{l}_n^{e_n}] \star E_0
$$

이 작용은 **교환법칙이 성립**한다. 그래서 걷는 순서와 상관없이 같은 곡선에 도착한다. 이 성질 덕분에 DH처럼 키 교환을 할 수 있다.

$$
[\mathfrak{a}] \star ([\mathfrak{b}] \star E_0) = [\mathfrak{b}] \star ([\mathfrak{a}] \star E_0)
$$

## 문제

$p = 419$, 비밀 지수 $(2, 3, 4)$일 때 공개 곡선의 $A$를 구한다.

## 풀이

1. 3-아이소제니를 2번, 5-아이소제니를 3번, 7-아이소제니를 4번 순서대로 걷는다.
2. 각 단계마다 현재 곡선에서 $\frac{\#E}{\ell} \cdot G$로 위수 $\ell$인 커널 점을 만든다.
3. 마지막 곡선의 Montgomery 계수는 **404**이다.

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
for ell,exponent in [(3,2),(5,3),(7,4)]:
    for _ in range(exponent):
        E=step(E,ell)
A=E.montgomery_model().a2()
print(A)
```

## 플래그
```text
404
```
