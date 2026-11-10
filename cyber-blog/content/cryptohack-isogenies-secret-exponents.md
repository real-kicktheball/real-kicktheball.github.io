---
{"title":"Secret Exponents","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"CSIDH의 비밀키는 각 ℓ마다 몇 번 걸을지 정한 지수 벡터다. [2,3,4]만큼 3,5,7-아이소제니를 걸어 공개키를 만든다.","section":["CryptoHack","Isogenies"]}
---

## 개념

CSIDH의 **비밀키**는 "각 다리를 몇 번 건널지" 적은 숫자 목록이다.

$$
\text{비밀키} = (2, 3, 4)
$$

이건 이런 뜻이다.

- 3-아이소제니 다리를 2번
- 5-아이소제니 다리를 3번
- 7-아이소제니 다리를 4번

모두 건너서 도착한 곡선의 숫자 $A$가 **공개키**다.

### 순서를 바꿔도 같은 곳에 도착한다

CSIDH의 핵심 성질이다. 3번 다리를 먼저 건너든 7번 다리를 먼저 건너든 **같은 곡선에 도착**한다.

### 그래서 키 교환이 된다

| | Alice | Bob |
|---|---|---|
| 비밀 | $(2, 3, 4)$ | $(1, 0, 2)$ |
| 공개 곡선 | 시작에서 Alice 경로로 간 곳 | 시작에서 Bob 경로로 간 곳 |
| 공유 비밀 | Bob 곡선에서 Alice 경로로 | Alice 곡선에서 Bob 경로로 |

두 사람 모두 "시작 곡선에서 두 경로를 다 걸은 곳"에 도착한다. Diffie-Hellman의 물감 섞기와 같은 원리다.

### 정리

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
