---
{"title":"Curves and Logs","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"상대 공개점에 자신의 비밀 스칼라 1829를 곱한다. 공유점의 x 좌표를 10진수 문자열로 바꾸어 SHA-1을 계산한다.","section":["CryptoHack","Elliptic Curves"]}
---

- 원문: https://cryptohack.org/challenges/ecc/#ecc3
- 분야: Elliptic Curves / ecc-starter
- 검증: CryptoHack 공식 제출 API에서 `Success!` 응답 확인

## 풀이 원리

상대 공개점에 자신의 비밀 스칼라 1829를 곱한다. 공유점의 x 좌표를 10진수 문자열로 바꾸어 SHA-1을 계산한다.

## 최종 풀이 코드

Python 3에서 실행한다. 필요한 외부 패키지는 `ecc4`에만 `pycryptodome`이다.

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

## 검증 방법

코드를 실행해 아래 결과와 일치하는지 확인한다. 이어서 위 원문 링크에서 같은 값을 제출하면 정답 처리된다. 코드 안의 `assert`는 문제에서 제공한 테스트 벡터나 수학적 조건을 확인한다.

```text
80e5212754a824d3a4aed185ace4f9cac0f908bf
```

## 최종 플래그

`80e5212754a824d3a4aed185ace4f9cac0f908bf`
