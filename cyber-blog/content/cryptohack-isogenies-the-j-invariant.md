---
{"title":"The j-invariant","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"짧은 Weierstrass 곡선 y^2=x^3+ax+b의 j-불변량은 1728\\cdot 4a^3/(4a^3+27b^2)\\pmod p이다. 분모의 역원을 곱하면 127이 나온다.","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

짧은 Weierstrass 곡선 $y^2=x^3+ax+b$의 $j$-불변량은 $1728\cdot 4a^3/(4a^3+27b^2)\pmod p$이다. 분모의 역원을 곱하면 127이 나온다.

## 최종 풀이 코드

```python
p,a,b = 163,145,49
numerator = 1728*4*a**3
denominator = 4*a**3+27*b**2
j = numerator*pow(denominator,-1,p)%p
print(j)
```

## 최종 정답

```text
127
```
