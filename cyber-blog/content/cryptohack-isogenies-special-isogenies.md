---
{"title":"Special Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"시작 곡선의 유한체 점군은 크기 420인 순환군이다. 생성자에 420/5를 곱해 위수 5인 점을 만들고 5-isogeny를 취한다. 공역을 Montgomery 형태로 바꾸면 A=199다.","section":["CryptoHack","Isogenies"]}
---

분야: Isogenies / road_to_csidh  
문제: https://cryptohack.org/challenges/isogenies/#special_isogenies  
검증: 2026-11-10, SageMath에서 위수·isogeny 차수·공역 계수 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

시작 곡선의 유한체 점군은 크기 420인 순환군이다. 생성자에 $420/5$를 곱해 위수 5인 점을 만들고 5-isogeny를 취한다. 공역을 Montgomery 형태로 바꾸면 $A=199$다.

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
E=step(E0,5)
A=E.montgomery_model().a2()
print(A)
```

## 검증 방법

코드의 `assert`가 커널과 isogeny의 차수를 검사한다. 결과가 아래 플래그와 일치한다.

## 최종 플래그

```text
199
```
