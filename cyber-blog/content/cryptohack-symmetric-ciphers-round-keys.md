---
{"title":"Round Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AddRoundKey는 상태 바이트와 같은 위치의 라운드키 바이트를 XOR한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [Round Keys](https://cryptohack.org/challenges/aes/#aes3)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)
- [add_round_key.py](https://cryptohack.org/static/challenges/add_round_key_b67b9a529ae739156107a74b14adde98.py)

## 풀이 원리

AddRoundKey는 상태 바이트와 같은 위치의 라운드키 바이트를 XOR한다.

## 최종 풀이 코드

```python
state=[[206,243,61,34],[171,11,93,31],[16,200,91,108],[150,3,194,51]]
key=[[173,129,68,82],[223,100,38,109],[32,189,53,8],[253,48,187,78]]
print(bytes(state[i][j]^key[i][j] for i in range(4) for j in range(4)).decode())
```

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

## 최종 플래그

```text
crypto{r0undk3y}
```
