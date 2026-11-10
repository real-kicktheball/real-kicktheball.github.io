---
{"title":"Curves and Logs","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"ECDH는 DH를 타원곡선 위에서 하는 것이다. 공유점 S = n_B·Q_A의 x 좌표로 키를 만든다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

**ECDH**는 Diffie-Hellman을 타원곡선 점의 덧셈군 위에서 한다.

| | Alice | Bob |
|---|---|---|
| 비밀 | $n_A$ | $n_B$ |
| 공개 | $Q_A = n_A G$ | $Q_B = n_B G$ |
| 공유점 | $n_A Q_B$ | $n_B Q_A$ |

두 공유점은 같은 점 $n_A n_B G$이다. 도청자는 $Q_A$, $Q_B$만으로는 이 점을 만들 수 없다(ECDLP).

## 문제

Alice의 공개점 $Q_A$와 내 비밀 $n_B = 1829$가 주어진다. 공유점의 x 좌표를 SHA-1해서 제출한다.

## 풀이

1. 앞 문제의 스칼라 곱으로 $S = 1829 \cdot Q_A$를 계산한다.
2. $S$의 x 좌표를 10진수 문자열로 바꾼다.
3. SHA-1 hex 값을 제출한다.

## 풀이 코드
```python
import hashlib
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
S = mul(1829, (815,3190))
assert on_curve(S)
print(hashlib.sha1(str(S[0]).encode()).hexdigest())
```

## 플래그
`80e5212754a824d3a4aed185ace4f9cac0f908bf`
