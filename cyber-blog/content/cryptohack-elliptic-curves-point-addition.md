---
{"title":"Point Addition","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"두 점을 잇는 직선의 세 번째 교점을 x축 대칭시킨 것이 점 덧셈이다. 기울기의 나눗셈은 유한체 역원으로 계산한다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

**점 덧셈**의 기하학적 의미는 다음과 같다.

1. $P$와 $Q$를 지나는 직선을 긋는다.
2. 곡선과 만나는 세 번째 점을 찾는다.
3. 그 점을 x축 대칭시킨 것이 $P + Q$다.

$P = Q$이면 접선을 쓴다. 이걸 식으로 쓰면 다음과 같다.

$$
\lambda =
\begin{cases}
\dfrac{y_2 - y_1}{x_2 - x_1} & P \ne Q \\[2mm]
\dfrac{3x_1^2 + a}{2y_1} & P = Q
\end{cases}
$$

$$
x_3 = \lambda^2 - x_1 - x_2, \qquad y_3 = \lambda(x_1 - x_3) - y_1
$$

유한체에서는 나눗셈을 **모듈러 역원 곱셈**으로 바꾼다. 특수한 경우도 처리해야 한다.

- $P = O$이면 결과는 $Q$다.
- $x_1 = x_2$, $y_1 = -y_2$이면 결과는 $O$다.

## 문제

같은 곡선에서 $P = (493, 5564)$, $Q = (1539, 4742)$, $R = (4403, 5202)$일 때 $S = P + P + Q + R$을 구한다.

## 풀이

1. 위 공식으로 `add` 함수를 만든다.
2. 문제의 예시 $X + Y = (1024, 4440)$, $X + X = (7284, 2107)$로 함수를 먼저 검증한다.
3. 결과가 곡선 위에 있는지도 확인했다.
4. $S = (4215, 2162)$이다.

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
assert add((5274,2841), (8669,740)) == (1024,4440)
assert add((5274,2841), (5274,2841)) == (7284,2107)
S = add(add(add((493,5564), (493,5564)), (1539,4742)), (4403,5202))
assert on_curve(S)
print(f'crypto{{{S[0]},{S[1]}}}')
```

## 플래그
`crypto{4215,2162}`
