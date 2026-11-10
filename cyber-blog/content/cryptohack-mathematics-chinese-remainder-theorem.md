---
{"title":"Chinese Remainder Theorem","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"중국인의 나머지 정리로 서로소인 여러 법에 대한 합동식을 하나의 합동식으로 합친다.","section":["CryptoHack","Mathematics"]}
---

## 개념

법 $n_1, n_2, \dots, n_k$가 서로소이면 다음 연립 합동식은 $N = n_1 n_2 \cdots n_k$를 법으로 **유일한 해**를 가진다. 이것이 **중국인의 나머지 정리(CRT)**다.

$$
x \equiv a_1 \pmod{n_1}, \quad \dots, \quad x \equiv a_k \pmod{n_k}
$$

해는 다음처럼 직접 만들 수 있다. $N_i = N / n_i$로 두면 다음과 같다.

$$
x = \sum_i a_i \cdot N_i \cdot (N_i^{-1} \bmod n_i) \pmod N
$$

각 항은 자기 법 $n_i$에서만 $a_i$가 되고, 다른 법에서는 0이 되도록 만든 것이다.

RSA에서 $\bmod p$, $\bmod q$로 나눠 계산한 뒤 합치는 최적화(RSA-CRT)나 Håstad 공격에서 쓰인다.

## 문제

다음 연립 합동식에서 $a \bmod 935$를 구한다.

$$
x \equiv 2 \pmod 5, \qquad x \equiv 3 \pmod{11}, \qquad x \equiv 5 \pmod{17}
$$

## 풀이

$N = 5 \cdot 11 \cdot 17 = 935$이다. 위 공식으로 계산하면 $x = 872$가 나온다.

검산해보면 모든 조건을 만족한다.

- $872 = 174 \cdot 5 + 2$
- $872 = 79 \cdot 11 + 3$
- $872 = 51 \cdot 17 + 5$

## 풀이 코드
```python
mods = [5, 11, 17]
rems = [2, 3, 5]
N = 1
for n in mods: N *= n
x = sum(a * (N//n) * pow(N//n, -1, n) for a,n in zip(rems,mods)) % N
assert [x%n for n in mods] == rems
print(x)
```

## 정답
`872`
