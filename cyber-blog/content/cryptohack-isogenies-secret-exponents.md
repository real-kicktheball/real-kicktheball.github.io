---
{"title":"Secret Exponents","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"CSIDH 비밀 지수 벡터 [2,3,4]는 각각 3-, 5-, 7-isogeny의 양의 방향으로 그 횟수만큼 걷는다는 뜻이다. 각 단계에서 현재 곡선의 유리 \\\\ell-꼬임점을 커널로 만든다. 최종 곡선의 Montgomery 계수는 404다.","section":["CryptoHack","Isogenies"]}
---

분야: Isogenies / road_to_csidh  
문제: https://cryptohack.org/challenges/isogenies/#csidh_secret_exponents  
검증: 2026-11-10, SageMath에서 위수·isogeny 차수·공역 계수 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

CSIDH 비밀 지수 벡터 $[2,3,4]$는 각각 3-, 5-, 7-isogeny의 양의 방향으로 그 횟수만큼 걷는다는 뜻이다. 각 단계에서 현재 곡선의 유리 $\\ell$-꼬임점을 커널로 만든다. 최종 곡선의 Montgomery 계수는 404다.

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
for ell,exponent in [(3,2),(5,3),(7,4)]:
    for _ in range(exponent):
        E=step(E,ell)
A=E.montgomery_model().a2()
print(A)
```

## 검증 방법

코드의 `assert`가 커널과 isogeny의 차수를 검사한다. 결과가 아래 플래그와 일치한다.

## 최종 플래그

```text
404
```
