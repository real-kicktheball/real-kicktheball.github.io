---
{"title":"Diffusion through Permutation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"InvMixColumns를 GF(2^8) 행렬 곱으로 계산한 뒤 InvShiftRows로 위치를 되돌린다. 상태 행렬은 제공 코드의 행 우선 표현을 따른다.","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [Diffusion through Permutation](https://cryptohack.org/challenges/aes/#aes5)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)
- [diffusion.py](https://cryptohack.org/static/challenges/diffusion_ee6215282094b4ae8cd1b20697477712.py)

## 풀이 원리

InvMixColumns를 GF(2^8) 행렬 곱으로 계산한 뒤 InvShiftRows로 위치를 되돌린다. 상태 행렬은 제공 코드의 행 우선 표현을 따른다.

## 최종 풀이 코드

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

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

## 최종 플래그

```text
crypto{d1ffUs3R}
```
