---
{"title":"Chinese Remainder Theorem","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"중국인의 나머지 정리로 서로소인 여러 법에 대한 합동식을 하나의 합동식으로 합친다.","section":["CryptoHack","Mathematics"]}
---

## 개념

이런 퀴즈를 생각해보자.

> 사탕을 3개씩 나누면 2개가 남고, 5개씩 나누면 3개가 남는다. 사탕은 몇 개일까? (15개보다 적다)

### 직접 해보기

"3으로 나누면 2가 남는 수"를 나열한다: 2, 5, **8**, 11, 14

그중 "5로 나누면 3이 남는 수"를 찾는다.

- 2 → 2 남음
- 5 → 0 남음
- **8 → 3 남음** ✔

답은 **8**이다. 그리고 15개보다 적은 답은 8 하나뿐이다($15 = 3 \times 5$).

이게 **중국인의 나머지 정리**다.

> 나누는 수들이 서로소(공약수가 1뿐)이면, 각각의 나머지를 만족하는 수가 (나누는 수들의 곱) 안에서 **딱 하나** 있다.

옛날 중국의 수학책 『손자산경』에 나오는 문제라서 이런 이름이 붙었다.

### 큰 수에서는?

나열하는 대신 공식으로 바로 만든다. "다른 나눗셈에서는 0이 남고, 자기 나눗셈에서만 1이 남는 조각"을 미리 만들어서 더하는 방식이다. 레고 블록을 조립하는 것과 비슷하다.

### 정리

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
