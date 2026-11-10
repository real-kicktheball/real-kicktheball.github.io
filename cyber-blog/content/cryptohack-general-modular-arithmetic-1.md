---
{"title":"Modular Arithmetic 1","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"합동식 a ≡ b (mod m)의 의미와 나머지 연산을 익힌다.","section":["CryptoHack","General"]}
---

## 개념

$a \equiv b \pmod m$은 "$a$와 $b$를 $m$으로 나눈 나머지가 같다"는 뜻이다. 다르게 말하면 $m$이 $a-b$를 나눈다.

$$
a \equiv b \pmod m \iff m \mid (a - b)
$$

시계가 12시 다음에 1시로 돌아가는 것처럼, 모듈러 연산에서는 수가 $0 \sim m-1$ 범위를 돈다.

## 문제

다음 두 값을 구하고, 둘 중 작은 값을 제출한다.

$$
11 \equiv x \pmod 6, \qquad 8146798528947 \equiv y \pmod{17}
$$

## 풀이

- $11 = 1 \cdot 6 + 5$이므로 $x = 5$이다.
- $y$는 큰 수라서 파이썬 `%`로 계산하면 $y = 4$이다.

작은 값은 **4**이다.

## 풀이 코드
```python
x=11%6
y=8146798528947%17
print(min(x,y))
```

## 플래그
```text
4
```
