---
{"title":"XOR Properties","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"XOR의 교환·결합 법칙, 항등원, 자기역원 성질을 이용해 여러 키가 섞인 식에서 플래그만 분리한다.","section":["CryptoHack","General"]}
---

## 개념

XOR에는 **"같은 걸 두 번 하면 사라진다"**는 마법 같은 성질이 있다.

스티커 붙이기로 생각해보자. 같은 스티커를 한 번 붙이면 생기고, 같은 자리에 또 붙이면 떨어진다고 하자. 그러면 스티커를 몇 장 붙였든 **짝수 번 붙인 스티커는 남지 않는다**.

$$
A \oplus A = 0, \qquad A \oplus 0 = A
$$

또 순서를 바꿔도 결과가 같다(교환법칙). 그래서 여러 개가 섞여 있어도 같은 것끼리 짝지어 지울 수 있다.

### 직접 해보기

숫자로 확인해보자. $5 \oplus 3 \oplus 5$는 얼마일까?

- 5는 2진수 `101`, 3은 `011`이다.
- $5 \oplus 3 = 110 = 6$
- $6 \oplus 5 = 110 \oplus 101 = 011 = 3$

5가 두 번 나와서 사라지고 3만 남았다.

### 이 문제에서

플래그에 열쇠 세 개($K_1, K_2, K_3$)가 섞여 있다. 우리가 가진 다른 값들을 XOR해서 열쇠 하나하나를 **두 번씩** 만들어주면, 열쇠는 다 사라지고 플래그만 남는다.

### 정리

XOR에는 문제를 풀 때 계속 쓰게 되는 네 가지 성질이 있다.

| 성질 | 식 |
|---|---|
| 교환법칙 | $A \oplus B = B \oplus A$ |
| 결합법칙 | $A \oplus (B \oplus C) = (A \oplus B) \oplus C$ |
| 항등원 | $A \oplus 0 = A$ |
| 자기역원 | $A \oplus A = 0$ |

특히 자기역원 성질 때문에 **같은 값이 두 번 XOR되면 사라진다**.

## 문제

다음 네 값이 주어진다.

$$
\begin{aligned}
&K_1 \\
&K_2 \oplus K_1 \\
&K_2 \oplus K_3 \\
&F \oplus K_1 \oplus K_3 \oplus K_2
\end{aligned}
$$

$F$(플래그)를 구해야 한다.

## 풀이

마지막 값에 $K_1$과 $K_2 \oplus K_3$을 XOR한다.

$$
(F \oplus K_1 \oplus K_3 \oplus K_2) \oplus K_1 \oplus (K_2 \oplus K_3) = F
$$

$K_1, K_2, K_3$이 각각 두 번씩 나와서 모두 0이 된다. $K_2 \oplus K_1$은 쓸 필요가 없다.

## 풀이 코드
```python
from itertools import starmap
k1=bytes.fromhex('a6c8b6733c9b22de7bc0253266a3867df55acde8635e19c73313')
k2k3=bytes.fromhex('c1545756687e7573db23aa1c3452a098b71a7fbf0fddddde5fc1')
masked=bytes.fromhex('04ee9855208a2cd59091d04767ae47963170d1660df7f56f5faf')
print(bytes(a^b^c for a,b,c in zip(masked,k1,k2k3)).decode())
```

## 플래그
```text
crypto{x0r_i5_ass0c1at1v3}
```
