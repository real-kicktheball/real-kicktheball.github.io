---
{"title":"Structure of AES","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"4×4 상태 행렬은 행별로 순서대로 바이트를 이어 붙인다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

4×4 상태 행렬은 행별로 순서대로 바이트를 이어 붙인다.

## 최종 풀이 코드

```python
matrix=[[99,114,121,112],[116,111,123,105],[110,109,97,116],[114,105,120,125]]
print(bytes(x for row in matrix for x in row).decode())
```

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

## 최종 플래그

```text
crypto{inmatrix}
```
