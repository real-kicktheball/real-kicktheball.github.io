---
{"title":"Montgomery's Ladder","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"문제의 곡선은 Curve25519의 Montgomery 형식 y²=x³+486662x²+x (mod 2²⁵⁵−19)이다. x 좌표만 필요한 스칼라배이므로 y를 복원하지 않고 사영좌표 (X:Z)로 ladder를 계산한다. 각 비트에서 xADD…","section":["CryptoHack","Elliptic Curves"]}
---

- 원문: https://cryptohack.org/challenges/ecc/#ladder
- 검증: Montgomery x 좌표 전용 ladder 코드 실행

## 풀이 원리

문제의 곡선은 Curve25519의 Montgomery 형식 `y²=x³+486662x²+x (mod 2²⁵⁵−19)`이다. x 좌표만 필요한 스칼라배이므로 y를 복원하지 않고 사영좌표 `(X:Z)`로 ladder를 계산한다. 각 비트에서 `xADD`와 `xDBL`을 한 번씩 수행한다. 마지막에 `X/Z mod p`를 구하면 요구한 10진 x 좌표다.

## 최종 풀이 코드

Python 3 표준 라이브러리만 사용한다.

```python
p=2**255-19
A=486662
a24=(A-2)//4
n=0x1337c0decafe
x1=9
x2,z2,x3,z3=1,0,x1,1
for bit in reversed(range(n.bit_length())):
    k=(n>>bit)&1
    if k:
        x2,x3=x3,x2
        z2,z3=z3,z2
    aa=(x2+z2)**2 % p
    bb=(x2-z2)**2 % p
    e=(aa-bb) % p
    da=(x3-z3)*(x2+z2) % p
    cb=(x3+z3)*(x2-z2) % p
    x3=(da+cb)**2 % p
    z3=x1*(da-cb)**2 % p
    x2=aa*bb % p
    z2=e*(aa+a24*e) % p
    if k:
        x2,x3=x3,x2
        z2,z3=z3,z2
assert z2 % p
print(x2*pow(z2,-1,p)%p)
```

## 검증 방법

코드를 실행하면 다음 값이 나온다. CryptoHack 문제 페이지에는 이 숫자를 `crypto{...}`로 감싸 제출한다.

```text
49231350462786016064336756977412654793383964726771892982507420921563002378152
```

## 최종 플래그

`crypto{49231350462786016064336756977412654793383964726771892982507420921563002378152}`
