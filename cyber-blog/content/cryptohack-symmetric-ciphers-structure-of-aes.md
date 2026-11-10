---
{"title":"Structure of AES","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AES는 16바이트를 4x4 상태 행렬로 다루고 10라운드 동안 SubBytes, ShiftRows, MixColumns, AddRoundKey를 반복한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

AES는 16바이트 블록을 **4×4 바이트 행렬(state)**로 보고 연산한다. AES-128은 10라운드로 구성된다.

| 단계 | 하는 일 | 역할 |
|---|---|---|
| KeyExpansion | 128비트 키에서 라운드 키 11개 생성 | |
| AddRoundKey | 상태와 라운드 키를 XOR | 키 섞기 |
| SubBytes | S-box로 각 바이트 치환 | 혼돈(confusion) |
| ShiftRows | 각 행을 왼쪽으로 회전 | 확산(diffusion) |
| MixColumns | 각 열에 행렬 곱 | 확산(diffusion) |

라운드 구성은 다음과 같다.

1. 처음에 AddRoundKey를 한 번 한다.
2. 1~9라운드는 SubBytes → ShiftRows → MixColumns → AddRoundKey를 한다.
3. 마지막 10라운드는 MixColumns 없이 진행한다.

## 문제

4×4 행렬을 다시 바이트열로 바꾸는 `matrix2bytes` 함수를 만들라는 문제다.

## 풀이

행렬의 바이트를 순서대로 이어 붙이면 된다. 첫 행 `[99, 114, 121, 112]`가 `cryp`이다.

## 풀이 코드
```python
matrix=[[99,114,121,112],[116,111,123,105],[110,109,97,116],[114,105,120,125]]
print(bytes(x for row in matrix for x in row).decode())
```

## 플래그
```text
crypto{inmatrix}
```
