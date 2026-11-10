---
{"title":"Two Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"커널 생성자 K=(i,0)는 2차 점이다. SageMath로 커널이 \\\\langle K\\\\rangle인 2-isogeny를 계산하고 공역 곡선의 j-불변량을 구한다.","section":["CryptoHack","Isogenies"]}
---

분야: Isogenies / road_to_sidh  
문제: https://cryptohack.org/challenges/isogenies/#two_isogenies  
검증: 2026-11-10, SageMath에서 isogeny 차수와 공역 $j$-불변량 계산 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

커널 생성자 $K=(i,0)$는 2차 점이다. SageMath로 커널이 $\\langle K\\rangle$인 2-isogeny를 계산하고 공역 곡선의 $j$-불변량을 구한다.

## 최종 풀이 코드

아래 코드를 `solve.sage`로 저장하고 `sage solve.sage`로 실행한다.

```python
p=2**18*3**13-1
F.<i>=GF(p**2,modulus=[1,0,1])
E=EllipticCurve(F,[1,0])
K=E(i,0)
phi=E.isogeny(K)
assert phi.degree()==2
j=phi.codomain().j_invariant()
print(j)
```

## 검증 방법

코드 내 `assert`가 각 커널과 isogeny의 차수를 검사한다. 출력한 공역 곡선의 $j$-불변량을 다음 플래그와 비교한다.

## 최종 플래그

```text
287496
```
