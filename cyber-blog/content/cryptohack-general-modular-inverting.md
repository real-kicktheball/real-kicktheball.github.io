---
{"title":"Modular Inverting","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"모듈러 역원 d는 g·d ≡ 1 (mod p)를 만족하는 수다. 페르마의 소정리나 확장 유클리드로 구한다.","section":["CryptoHack","General"]}
---

## 개념

유한체 $\mathbb{F}_p$에서 0이 아닌 원소 $g$는 반드시 **곱셈 역원** $d$를 가진다.

$$
g \cdot d \equiv 1 \pmod p
$$

구하는 방법은 두 가지다.

1. 페르마의 소정리를 쓴다: $d = g^{p-2} \bmod p$
2. 확장 유클리드로 $g u + p v = 1$의 $u$를 구한다.

파이썬 3.8부터는 `pow(g, -1, p)`로 바로 계산할 수 있다.

## 문제

$3 \cdot d \equiv 1 \pmod{13}$을 만족하는 $d$를 구한다.

## 풀이

페르마의 소정리로 $d = 3^{11} \bmod 13$을 계산하면 9가 나온다. 실제로 $3 \cdot 9 = 27 = 2 \cdot 13 + 1$이다. 답은 **9**이다.

## 풀이 코드
```python
print(pow(3,-1,13))
```

## 플래그
```text
9
```
