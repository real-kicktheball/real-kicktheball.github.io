---
{"title":"Diffusion through Permutation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"ShiftRows와 MixColumns가 확산을 만든다. 역연산 InvMixColumns, InvShiftRows로 상태를 되돌린다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**확산**은 입력 1비트의 변화가 출력 전체로 퍼지게 하는 성질이다. AES는 두 단계로 확산을 만든다.

1. **ShiftRows**: $i$번째 행을 왼쪽으로 $i$칸 회전한다. 한 열의 바이트들이 다음 라운드에서 서로 다른 열로 흩어진다.
2. **MixColumns**: 각 열에 $\mathrm{GF}(2^8)$ 위의 고정 행렬을 곱한다. 한 바이트가 바뀌면 그 열 4바이트가 모두 바뀐다.

MixColumns 행렬과 역행렬은 다음과 같다.

$$
\begin{pmatrix} 2&3&1&1 \\ 1&2&3&1 \\ 1&1&2&3 \\ 3&1&1&2 \end{pmatrix}^{-1}
=
\begin{pmatrix} 14&11&13&9 \\ 9&14&11&13 \\ 13&9&14&11 \\ 11&13&9&14 \end{pmatrix}
$$

$\mathrm{GF}(2^8)$의 곱셈은 다항식 곱셈 후 $x^8 + x^4 + x^3 + x + 1$(0x11b)로 나누는 것이다. 덧셈은 XOR이다.

두 단계를 거치면 2라운드 만에 입력 1바이트가 상태 16바이트 전체에 영향을 준다.

## 문제

MixColumns와 ShiftRows를 거친 상태 행렬이 주어진다. 역연산으로 원래 상태를 구한다.

## 풀이

역순으로 적용한다.

1. 각 열에 역 MixColumns 행렬을 곱한다. `mul` 함수가 $\mathrm{GF}(2^8)$ 곱셈을 한다.
2. 각 행을 오른쪽으로 되돌린다(InvShiftRows).
3. 바이트를 이어 붙이면 플래그가 나온다.

## 풀이 코드
```python
def mul(a,b):
    v=0
    for _ in range(8):
        if b&1:v^=a
        a=((a<<1)^ (0x1b if a&0x80 else 0))&255
        b>>=1
    return v
state=[[108,106,71,86],[96,62,38,72],[42,184,92,209],[94,79,8,54]]
M=[[14,11,13,9],[9,14,11,13],[13,9,14,11],[11,13,9,14]]
from functools import reduce
state=[[reduce(lambda x,y:x^y,(mul(M[i][j],row[j]) for j in range(4)),0) for i in range(4)] for row in state]
for col in range(1,4):
    old=[state[row][col] for row in range(4)]
    for row in range(4):state[row][col]=old[(row-col)%4]
print(bytes(x for row in state for x in row).decode())
```

## 플래그
```text
crypto{d1ffUs3R}
```
