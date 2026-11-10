---
{"title":"Round Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AddRoundKey는 상태 행렬과 라운드 키를 바이트별로 XOR하는 단계다. AES에서 키가 들어가는 유일한 곳이다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**AddRoundKey**는 상태 행렬의 각 바이트를 같은 위치의 라운드 키 바이트와 XOR한다.

$$
s_{i,j} \leftarrow s_{i,j} \oplus k_{i,j}
$$

AES의 다른 단계(SubBytes, ShiftRows, MixColumns)는 모두 공개된 고정 연산이다. 키가 실제로 섞이는 곳은 여기뿐이다. XOR은 자기역원이라 복호화할 때도 같은 연산을 쓴다.

## 문제

상태 행렬과 라운드 키 행렬이 주어진다. AddRoundKey를 적용하고 결과를 바이트로 바꾼다.

## 풀이

같은 위치끼리 XOR한다. 첫 칸은 $206 \oplus 173 = 99$ = `c`이다. 전부 이어 붙이면 플래그가 나온다.

## 풀이 코드
```python
state=[[206,243,61,34],[171,11,93,31],[16,200,91,108],[150,3,194,51]]
key=[[173,129,68,82],[223,100,38,109],[32,189,53,8],[253,48,187,78]]
print(bytes(state[i][j]^key[i][j] for i in range(4) for j in range(4)).decode())
```

## 플래그
```text
crypto{r0undk3y}
```
