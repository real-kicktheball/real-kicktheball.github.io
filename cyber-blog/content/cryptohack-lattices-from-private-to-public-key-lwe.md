---
{"title":"From Private to Public Key LWE","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"Kyber1024의 공개키는 표준 매개변수에서 1568바이트다. 공개키의 다항식 벡터 4개는 각각 384바이트이고, 추가 시드 32바이트를 합하면 4 imes384+32=1568이다.","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

Kyber1024의 공개키는 표준 매개변수에서 1568바이트다. 공개키의 다항식 벡터 4개는 각각 384바이트이고, 추가 시드 32바이트를 합하면 $4	imes384+32=1568$이다.

## 최종 풀이 코드

```python
k = 4
poly_bytes = 384
seed_bytes = 32
print(k * poly_bytes + seed_bytes)
```

## 최종 정답

```text
1568
```
