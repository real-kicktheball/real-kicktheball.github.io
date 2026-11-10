---
{"title":"Montgomery's Ladder","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"Montgomery ladder는 비트와 상관없이 같은 연산을 해서 타이밍 공격을 막는다. Curve25519에서 x 좌표만으로 스칼라 곱을 한다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

double-and-add는 2진수 비트가 **1일 때만** 더하기를 한다. 그래서 컴퓨터가 일하는 **시간이나 전기 사용량**을 재보면 비트가 1인지 0인지 짐작할 수 있다. 이런 공격을 **부채널 공격**이라 한다.

### 비유

금고 다이얼을 돌릴 때 맞는 숫자에서만 "딸깍" 소리가 나면, 소리를 듣고 비밀번호를 알 수 있다. 그래서 좋은 금고는 **어떤 숫자에서든 똑같은 소리**가 나게 만든다.

### Montgomery 사다리

이 방법은 비트가 0이든 1이든 **항상 똑같이** "더하기 한 번 + 두 배 한 번"을 한다. 두 점을 들고 사다리를 오르듯 번갈아 갱신한다.

| 비트 | 하는 일 |
|---|---|
| 0 | $R_1 \leftarrow R_0 + R_1$, $R_0 \leftarrow 2R_0$ |
| 1 | $R_0 \leftarrow R_0 + R_1$, $R_1 \leftarrow 2R_1$ |

둘 다 더하기 1번, 두 배 1번이다. 바깥에서 보면 구별할 수 없다.

### Curve25519

이 문제는 Signal, WhatsApp, SSH 등에서 쓰는 **Curve25519**를 쓴다. 이 곡선은 x좌표만으로 사다리를 계산할 수 있게 설계돼서 빠르고 안전하다.

### 정리

double-and-add는 비트가 1일 때만 덧셈을 한다. 그래서 연산 시간이나 전력 소모를 보면 비밀 스칼라의 비트가 새어 나간다(**부채널 공격**).

**Montgomery ladder**는 두 점 $R_0$, $R_1$을 $R_1 - R_0 = P$로 유지하면서 매 비트마다 똑같이 덧셈 한 번, 두 배 한 번을 한다.

```
R0 = O, R1 = P
for bit in n (높은 비트부터):
    if bit == 0: R1 = R0 + R1; R0 = 2·R0
    else:        R0 = R0 + R1; R1 = 2·R1
```

**Curve25519**는 Montgomery 형태 곡선이다.

$$
y^2 = x^3 + 486662x^2 + x \pmod{2^{255} - 19}
$$

이 형태에서는 $R_1 - R_0$이 항상 $P$로 고정된다. 그래서 y 좌표 없이 x 좌표만으로 덧셈(xADD)과 두 배(xDBL)를 할 수 있다. 사영좌표 $(X : Z)$로 계산하면 매 단계 역원도 필요 없다.

## 문제

Curve25519에서 $x = 9$인 생성점 $G$에 대해 $Q = [\texttt{0x1337c0decafe}]G$의 x 좌표를 구한다.

## 풀이

1. $(X_2 : Z_2) = (1 : 0)$은 무한원점, $(X_3 : Z_3) = (9 : 1)$은 $G$로 시작한다.
2. 스칼라의 비트마다 조건부 swap → xADD, xDBL → 다시 swap을 한다. `a24 = (486662 - 2)/4`를 쓴다.
3. 마지막에 $X / Z \bmod p$를 구하면 x 좌표다.

## 풀이 코드
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

## 플래그
`crypto{49231350462786016064336756977412654793383964726771892982507420921563002378152}`
