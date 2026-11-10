---
{"title":"Efficient Exchange","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"전달된 x 좌표로부터 곡선의 우변을 계산한다. p ≡ 3 mod 4이므로 y = rhs^((p+1)/4) mod p로 y를 복원한다. 어느 부호를 선택해도 공유점의 x 좌표가 같으며, 그 SHA-1 앞 16바이트가 AES-CBC 키다.","section":["CryptoHack","Elliptic Curves"]}
---

## 풀이 원리

전달된 x 좌표로부터 곡선의 우변을 계산한다. `p ≡ 3 mod 4`이므로 `y = rhs^((p+1)/4) mod p`로 y를 복원한다. 어느 부호를 선택해도 공유점의 x 좌표가 같으며, 그 SHA-1 앞 16바이트가 AES-CBC 키다.

## 최종 풀이 코드

Python 3에서 실행한다. 필요한 외부 패키지는 `ecc4`에만 `pycryptodome`이다.

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

## 검증 방법

코드를 실행해 아래 결과와 일치하는지 확인한다. 이어서 위 원문 링크에서 같은 값을 제출하면 정답 처리된다. 코드 안의 `assert`는 문제에서 제공한 테스트 벡터나 수학적 조건을 확인한다.

```text
crypto{3ff1c1ent_k3y_3xch4ng3}
```

## 최종 플래그

`crypto{3ff1c1ent_k3y_3xch4ng3}`
