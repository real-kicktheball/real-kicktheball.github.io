---
{"title":"Special Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"CSIDH는 p = 4·ℓ1·ℓ2···ℓn - 1을 써서 F_p 위에서 ℓ-꼬임점을 바로 얻는다. p=419에서 5-아이소제니를 계산한다.","section":["CryptoHack","Isogenies"]}
---

## 개념

**CSIDH**는 아이소제니로 만든 Diffie-Hellman이다. 특별한 소수를 써서 계산을 쉽게 만든다.

$$
p = 4 \times 3 \times 5 \times 7 - 1 = 419
$$

### 왜 이런 소수를 쓸까?

초특이 곡선은 점이 $p + 1$개다. $p + 1 = 420 = 4 \times 3 \times 5 \times 7$이다. 그래서 3, 5, 7로 나누어떨어진다.

점 개수가 3, 5, 7의 배수라서, **3번·5번·7번 더하면 원점이 되는 점**을 쉽게 만들 수 있다. 그런 점이 있어야 3·5·7-아이소제니를 만들 수 있다.

### 직접 해보기 (5번에 원점이 되는 점 만들기)

아무 점 $P$를 골라서 $\frac{420}{5} = 84$를 곱한다.

$$
K = 84P \quad\Rightarrow\quad 5K = 420P = O
$$

곡선의 모든 점은 420번 더하면 원점이 되니까, $K$는 5번 더하면 원점이 된다.

### 이 문제에서

시작 곡선 $y^2 = x^3 + x$에서 이렇게 만든 $K$로 5-아이소제니를 한 번 건너간다. 도착 곡선의 Montgomery 숫자 $A$가 답이다.

### 정리

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
