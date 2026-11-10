---
{"title":"Efficient Exchange","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"점을 x 좌표만 보내도 곡선 방정식으로 y를 ±로 복원할 수 있다. 공유점의 x 좌표는 부호와 상관없이 같다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

곡선 위 점은 x 좌표만 알면 $y^2 = x^3 + ax + b$로 y가 $\pm$ 두 개로 정해진다. 그래서 공개점을 x 좌표만 보내 대역폭을 절반으로 줄일 수 있다(**점 압축**).

y를 복원하려면 모듈러 제곱근이 필요하다. 이 문제의 $p = 9739$는 $p \equiv 3 \pmod 4$이다. 그래서 앞에서 배운 공식을 쓰면 된다.

$$
y = (x^3 + ax + b)^{(p+1)/4} \bmod p
$$

$y$와 $-y$ 중 어느 쪽을 골라도 $n \cdot (x, \pm y) = \pm(nP)$가 된다. 공유점의 x 좌표는 같으니 키 교환에는 문제가 없다.

## 문제

Alice가 x 좌표만 보냈다. 내 비밀 $n_B$와 AES-CBC 암호문이 주어진다.

## 풀이

1. 우변 $x^3 + 497x + 1768$을 계산하고 $(p+1)/4$ 제곱으로 y를 복원한다.
2. 공유점 $n_B \cdot (x, y)$의 x 좌표를 구한다.
3. SHA-1 앞 16바이트를 키로 복호화한다.

## 풀이 코드
```python
import hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
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
x = 4726
rhs = (x**3+a*x+b) % p
y = pow(rhs, (p+1)//4, p)
assert y*y % p == rhs
S = mul(6534, (x,y))
assert on_curve(S)
assert mul(6534, (x,-y % p))[0] == S[0]
key = hashlib.sha1(str(S[0]).encode()).digest()[:16]
iv = bytes.fromhex('cd9da9f1c60925922377ea952afc212c')
ct = bytes.fromhex('febcbe3a3414a730b125931dccf912d2239f3e969c4334d95ed0ec86f6449ad8')
print(unpad(AES.new(key, AES.MODE_CBC, iv).decrypt(ct), 16).decode())
```

## 플래그
`crypto{3ff1c1ent_k3y_3xch4ng3}`
