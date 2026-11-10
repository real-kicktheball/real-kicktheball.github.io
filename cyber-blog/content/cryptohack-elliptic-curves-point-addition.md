---
{"title":"Point Addition","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"점 덧셈 공식의 나눗셈을 유한체 역원으로 바꾼다. 제시된 테스트 벡터와 곡선 방정식을 검사한 뒤 P+P+Q+R을 계산한다.","section":["CryptoHack","Elliptic Curves"]}
---

## 풀이 원리

점 덧셈 공식의 나눗셈을 유한체 역원으로 바꾼다. 제시된 테스트 벡터와 곡선 방정식을 검사한 뒤 `P+P+Q+R`을 계산한다.

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
assert add((5274,2841), (8669,740)) == (1024,4440)
assert add((5274,2841), (5274,2841)) == (7284,2107)
S = add(add(add((493,5564), (493,5564)), (1539,4742)), (4403,5202))
assert on_curve(S)
print(f'crypto{{{S[0]},{S[1]}}}')
```

## 최종 플래그

`crypto{4215,2162}`
