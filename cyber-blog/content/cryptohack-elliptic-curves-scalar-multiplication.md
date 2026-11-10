---
{"title":"Scalar Multiplication","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"스칼라를 이진수로 읽으며 필요한 점만 더하는 double-and-add를 구현한다. 테스트 벡터를 맞춘 다음 [7863]P를 구한다.","section":["CryptoHack","Elliptic Curves"]}
---

## 풀이 원리

스칼라를 이진수로 읽으며 필요한 점만 더하는 double-and-add를 구현한다. 테스트 벡터를 맞춘 다음 `[7863]P`를 구한다.

## 최종 풀이 코드

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

## 최종 플래그

`crypto{9467,2742}`
