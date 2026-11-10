---
{"title":"The j-invariant","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"j-불변량은 타원곡선의 동형류를 나타낸다. j가 같으면 (대수적 폐포에서) 같은 곡선으로 본다.","section":["CryptoHack","Isogenies"]}
---

## 개념

좌표 변환으로 서로 바뀔 수 있는 곡선은 **동형**이라 보고 같은 곡선으로 취급한다. 동형인지 판별하는 값이 **j-불변량**이다. 짧은 Weierstrass 형태 $y^2 = x^3 + ax + b$에서는 다음과 같다.

$$
j(E) = 1728 \cdot \frac{4a^3}{4a^3 + 27b^2}
$$

대수적 폐포 위에서는 j가 같으면 두 곡선이 동형이다. 아이소제니 그래프에서는 곡선 하나하나를 j-불변량으로 구분한다. 문제의 답도 대부분 j-불변량을 묻는다.

## 문제

$p = 163$에서 $E: y^2 = x^3 + 145x + 49$의 j-불변량을 구한다.

## 풀이

분자 $1728 \cdot 4 \cdot 145^3$에 분모 $4 \cdot 145^3 + 27 \cdot 49^2$의 $\bmod 163$ 역원을 곱하면 **127**이다.

## 풀이 코드
```python
p,a,b = 163,145,49
numerator = 1728*4*a**3
denominator = 4*a**3+27*b**2
j = numerator*pow(denominator,-1,p)%p
print(j)
```

## 정답
```text
127
```
