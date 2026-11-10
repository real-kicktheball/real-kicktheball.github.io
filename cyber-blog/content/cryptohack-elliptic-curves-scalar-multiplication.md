---
{"title":"Scalar Multiplication","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"스칼라 곱 nP는 double-and-add로 O(log n)번 연산에 계산한다. 반대로 nP에서 n을 구하는 건 어렵다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

**스칼라 곱** $nP$는 점 $P$를 $n$번 더한 것이다.

$$
3P = P + P + P
$$

$n$이 아주 크면 하나씩 더할 수 없다. 그래서 **두 배로 점프**하는 방법(double-and-add)을 쓴다. RSA에서 배운 제곱-곱셈과 같은 아이디어다.

### 직접 해보기 ($13P$ 만들기)

13을 2진수로 쓰면 $1101$이다. 즉 $13 = 8 + 4 + 1$이다.

| 단계 | 하는 일 | 결과 |
|---|---|---|
| 1 | 시작 | $P$ |
| 2 | 두 배 | $2P$ |
| 3 | 두 배 | $4P$ |
| 4 | 두 배 | $8P$ |
| 5 | 필요한 것만 더하기 | $8P + 4P + P = 13P$ |

12번 더하는 대신 몇 번의 계산으로 끝났다.

### 왜 암호에 쓸까?

- $n$을 알면 $nP$는 금방 계산된다.
- 반대로 $nP$를 보고 $n$을 알아내는 건 매우 어렵다.

이 **한쪽 방향만 쉬운** 성질이 타원곡선 암호의 핵심이다. 이걸 **타원곡선 이산로그 문제(ECDLP)**라 한다.

### 정리

**스칼라 곱** $nP$는 $P$를 $n$번 더한 것이다.

$$
nP = \underbrace{P + P + \cdots + P}_{n}
$$

$n$번 다 더하면 느리다. 그래서 **double-and-add**를 쓴다(RSA의 square-and-multiply와 같은 구조).

1. $n$을 이진수로 본다.
2. 비트마다 현재 점을 두 배(double)로 만든다.
3. 비트가 1이면 $P$를 더한다(add).

이러면 연산이 $O(\log n)$번이다. 반대로 $Q = nP$에서 $n$을 찾는 효율적인 방법은 알려져 있지 않다(ECDLP).

## 문제

$P = (2339, 2213)$일 때 $Q = [7863]P$를 구한다.

## 풀이

1. double-and-add를 구현한다.
2. 문제의 예시 $[1337]X = (1089, 6931)$로 검증한다.
3. $[7863]P = (9467, 2742)$이다.

## 풀이 코드
```python
p, a, b = 9739, 497, 1768
O = None

def on_curve(P):
    return P is None or (P[1]**2 - P[0]**3 - a*P[0] - b) % p == 0

def add(P, Q):
    if P is None: return Q
    if Q is None: return P
    x1, y1 = P
    x2, y2 = Q
    if x1 == x2 and (y1 + y2) % p == 0: return O
    if P == Q:
        slope = (3*x1*x1+a)*pow(2*y1, -1, p) % p
    else:
        slope = (y2-y1)*pow(x2-x1, -1, p) % p
    x3 = (slope*slope-x1-x2) % p
    return (x3, (slope*(x1-x3)-y1) % p)

def mul(n, P):
    R = O
    while n:
        if n & 1: R = add(R, P)
        P = add(P, P)
        n >>= 1
    return R
assert mul(1337, (5323,5438)) == (1089,6931)
Q = mul(7863, (2339,2213))
assert on_curve(Q)
print(f'crypto{{{Q[0]},{Q[1]}}}')
```

## 플래그
`crypto{9467,2742}`
