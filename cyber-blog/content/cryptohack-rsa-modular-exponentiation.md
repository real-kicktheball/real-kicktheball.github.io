---
{"title":"Modular Exponentiation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"RSA의 암복호화는 모두 모듈러 거듭제곱이다. 제곱-곱셈 알고리즘으로 큰 지수도 빠르게 계산한다.","section":["CryptoHack","RSA"]}
---

## 개념

RSA의 암호화와 복호화는 모두 **모듈러 거듭제곱**이다.

$$
c = m^e \bmod N, \qquad m = c^d \bmod N
$$

$e$나 $d$는 수백~수천 비트라서 $m^e$를 그대로 계산하면 숫자가 감당할 수 없이 커진다. 그래서 **제곱-곱셈(square-and-multiply)** 방식을 쓴다.

- 지수를 이진수로 보고, 각 비트마다 결과를 제곱한다.
- 비트가 1이면 밑을 한 번 더 곱한다.
- 매 단계마다 $\bmod N$을 해서 숫자 크기를 $N$ 이하로 유지한다.

파이썬의 `pow(base, exp, mod)`가 이 방식으로 동작한다.

## 문제

$101^{17} \bmod 22663$을 구한다.

## 풀이

$17 = 10001_2$이다. 그래서 $101$을 4번 제곱해 $101^{16}$을 만들고, 여기에 $101$을 한 번 곱하면 된다. `pow(101, 17, 22663)` = **19906**이다.

## 풀이 코드
```python
result = pow(101,17,22663)
assert result == 101**17 % 22663
print(result)
```

## 정답
`19906`
