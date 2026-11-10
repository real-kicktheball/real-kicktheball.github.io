---
{"title":"Twisted CSIDH Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"CSIDH에서 음의 방향으로 걷기는 이차 꼬임(twist)을 이용한다. 여기서는 주기를 구해서 양의 방향 걷기로 바꿔 계산했다.","section":["CryptoHack","Isogenies"]}
---

## 개념

CSIDH 비밀키에는 **음수**도 있다. 음수는 다리를 **반대 방향**으로 건넌다는 뜻이다.

### 반대 방향으로 가는 방법

정석은 **꼬인 곡선(twist)**이라는 짝꿍 곡선 위의 점을 써서 반대 방향 다리를 만드는 것이다.

### 다른 방법: 한 바퀴 돌기

같은 다리로 한 방향으로만 계속 가면 결국 **출발점으로 돌아온다**. 원형 트랙을 도는 것과 같다.

### 직접 해보기 (트랙에 정거장이 5개라면)

정거장 0 → 1 → 2 → 3 → 4 → 0 (5번 만에 돌아옴)

- 뒤로 1칸 = 앞으로 4칸
- 0에서 뒤로 1칸 가면 정거장 4다. 앞으로 4칸 가도 정거장 4다. ✔

### 이 문제에서

1. 3-아이소제니로 앞으로 계속 가보니 **27번** 만에 출발 곡선으로 돌아온다. 트랙 정거장이 27개다.
2. 뒤로 1칸 = 앞으로 26칸이다.
3. 26번 건넌 곡선의 $A$가 답이다.

### 정리

CSIDH의 음의 지수는 **반대 방향**으로 걷는 것이다. 정석적인 방법은 이렇다.

- 양의 방향: $\mathbb{F}_p$ 유리점($y \in \mathbb{F}_p$)으로 커널을 만든다.
- 음의 방향: **이차 꼬임(quadratic twist)** 위의 점, 즉 $y \in \mathbb{F}_{p^2} \setminus \mathbb{F}_p$이고 $x \in \mathbb{F}_p$인 점으로 커널을 만든다.

다른 관점도 있다. $\ell$-아이소제니로 한 방향으로만 걸으면 결국 출발 곡선으로 돌아오는 **사이클**을 이룬다. 사이클 길이가 $N$이면 다음이 성립한다.

$$
\text{역방향 1번} = \text{정방향 } (N-1)\text{번}
$$

## 문제

$p = 419$, $E_0$에서 3-아이소제니로 **음의 방향 1번** 걸은 곡선의 $A$를 구한다.

## 풀이

1. 정방향 3-아이소제니로 계속 걸어보면 27번째에 처음으로 $E_0$의 j-불변량으로 돌아온다. 사이클 길이는 27이다.
2. 역방향 1번 = 정방향 26번이다.
3. 26번 걸은 곡선의 Montgomery 계수는 **261**이다.

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

## 플래그
```text
261
```
