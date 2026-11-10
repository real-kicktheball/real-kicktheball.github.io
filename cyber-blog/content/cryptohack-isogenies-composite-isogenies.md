---
{"title":"Composite Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"차수 ℓ^e 아이소제니는 ℓ-아이소제니 e개를 합성해서 계산한다. 매 단계 커널 생성자를 다음 곡선으로 옮겨야 한다.","section":["CryptoHack","Isogenies"]}
---

## 개념

$K$의 위수가 $3^{13}$이면 커널 $\langle K \rangle$인 아이소제니의 차수도 $3^{13}$이다. Vélu 공식을 바로 쓰면 커널 점이 $3^{13}$개라 계산이 불가능하다. 그래서 **3-아이소제니 13개로 쪼갠다**.

1. $K$에 $3^{e-1}$을 곱해 위수 3인 점 $H$를 만든다.
2. $\phi_1: E \to E_1$을 $\ker = \langle H \rangle$인 3-아이소제니로 만든다.
3. $K$를 새 곡선으로 보낸다: $K \leftarrow \phi_1(K)$. 위수가 $3^{e-1}$로 줄어든다.
4. 이걸 $e$번 반복한다.

$$
\phi = \phi_{13} \circ \cdots \circ \phi_2 \circ \phi_1
$$

이러면 비용이 $O(e \cdot \ell)$ 정도라 실용적이다. SIDH가 비밀 아이소제니를 계산하는 방식이 이것이다.

## 문제

위수 $3^{13}$인 점 $K$가 주어진다. 커널 $\langle K \rangle$인 아이소제니의 공역 j-불변량을 구한다.

## 풀이

1. 위 과정을 13번 반복한다. 매 단계 $H$의 위수가 3인 것을 확인했다.
2. 마지막에 $K$가 무한원점이 되는 것도 확인했다.
3. 공역의 j-불변량이 답이다.

## 풀이 코드
```python
p=2**18*3**13-1
F.<i>=GF(p**2,modulus=[1,0,1])
E=EllipticCurve(F,[1,0])
K=E(357834818388*i+53943911829,46334220304*i+267017462655)
assert K.order()==3**13
for level in range(13,0,-1):
    H=(3**(level-1))*K
    assert H.order()==3
    phi=E.isogeny(H)
    K=phi(K)
    E=phi.codomain()
assert K.is_zero()
j=E.j_invariant()
print(j)
```

## 플래그
```text
249510360818*i + 292990704480
```
