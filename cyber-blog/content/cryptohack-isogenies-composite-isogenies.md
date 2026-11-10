---
{"title":"Composite Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"생성자 K의 위수는 3^{13}이다. 매 단계에서 현재 K에 3^{e-1}을 곱해 3차 커널을 만들고, 3-isogeny를 적용한 다음 K를 새 공역으로 보낸다. 13단계를 마치면 원하는 합성 isogeny의 공역이 나온다.","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

생성자 $K$의 위수는 $3^{13}$이다. 매 단계에서 현재 $K$에 $3^{e-1}$을 곱해 3차 커널을 만들고, 3-isogeny를 적용한 다음 $K$를 새 공역으로 보낸다. 13단계를 마치면 원하는 합성 isogeny의 공역이 나온다.

## 최종 풀이 코드

아래 코드를 `solve.sage`로 저장하고 `sage solve.sage`로 실행한다.

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

## 검증 방법

코드 내 `assert`가 각 커널과 isogeny의 차수를 검사한다. 출력한 공역 곡선의 $j$-불변량을 다음 플래그와 비교한다.

## 최종 플래그

```text
249510360818*i + 292990704480
```
