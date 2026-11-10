---
{"title":"The j-invariant","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"짧은 Weierstrass 곡선 y^2=x^3+ax+b의 j-불변량은 1728\\cdot 4a^3/(4a^3+27b^2)\\pmod p이다. 분모의 역원을 곱하면 127이 나온다.","section":["CryptoHack","Isogenies"]}
---

분야: Isogenies / iso_background  
문제: https://cryptohack.org/challenges/isogenies/#j_invariant  
검증: 2026-11-10, 로컬 실행 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

짧은 Weierstrass 곡선 $y^2=x^3+ax+b$의 $j$-불변량은 $1728\cdot 4a^3/(4a^3+27b^2)\pmod p$이다. 분모의 역원을 곱하면 127이 나온다.

## 최종 풀이 코드

다음 코드를 `python`으로 실행한다. 첨부 파일을 사용하는 코드는 공식 URL에서 내려받는다.

```python
p,a,b = 163,145,49
numerator = 1728*4*a**3
denominator = 4*a**3+27*b**2
j = numerator*pow(denominator,-1,p)%p
print(j)
```

## 검증 방법

표준 출력이 아래 정답과 같은지 확인한다. 플랫폼 제출 상태는 별도로 기록한다.

## 최종 정답

```text
127
```
