---
{"title":"Working with Fields","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"유한체 F_p에서는 0이 아닌 모든 원소가 곱셈 역원을 가진다. Diffie-Hellman이 동작하는 무대다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 개념

**체(field)**는 덧셈, 뺄셈, 곱셈, 나눗셈(0 제외)이 모두 되는 집합이다. $p$가 소수이면 $\{0, 1, \dots, p-1\}$은 $\bmod p$ 연산으로 **유한체** $\mathbb{F}_p$가 된다.

체가 되려면 0이 아닌 모든 원소 $g$에 곱셈 역원 $d$가 있어야 한다.

$$
g \cdot d \equiv 1 \pmod p
$$

$p$가 소수가 아니면 $p$와 서로소가 아닌 원소는 역원이 없다. 그래서 체가 되지 않는다.

Diffie-Hellman은 $\mathbb{F}_p^{\times}$(0을 뺀 원소들의 곱셈군) 위에서 동작한다.

## 문제

$p = 991$, $g = 209$일 때 $g \cdot d \bmod 991 = 1$인 $d$를 구한다.

## 풀이

`pow(209, -1, 991)` = **569**이다. 검산하면 $209 \cdot 569 = 118921 = 120 \cdot 991 + 1$이다.

## 풀이 코드
```python
p,g=991,209
d=pow(g,-1,p)
assert g*d % p == 1
print(d)
```

## 정답
`569`
