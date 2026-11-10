---
{"title":"From Private to Public Key LWE","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"Kyber(ML-KEM)는 Module-LWE 기반이다. Kyber1024 공개키 크기를 구조에서 계산한다.","section":["CryptoHack","Lattices"]}
---

## 개념

**Kyber**(표준명 ML-KEM)는 NIST가 표준화한 양자내성 키 캡슐화 방식이다. 숫자 하나 대신 **다항식 벡터**를 쓰는 Module-LWE를 기반으로 한다.

- 다항식 환 $R_q = \mathbb{Z}_q[x]/(x^{256} + 1)$, $q = 3329$
- 공개키는 $t = A s + e$와 행렬 $A$를 만드는 32바이트 시드 $\rho$
- Kyber1024는 모듈 차원 $k = 4$

다항식 하나는 계수 256개이고, 각 계수는 12비트($q < 2^{12}$)다. 그래서 크기는 $256 \times 12 / 8 = 384$바이트다.

## 문제

Kyber1024 공개키가 몇 바이트인지 묻는다.

## 풀이

다항식 4개와 시드를 더하면 $4 \times 384 + 32 =$ **1568**바이트다.

## 풀이 코드
```python
k = 4
poly_bytes = 384
seed_bytes = 32
print(k * poly_bytes + seed_bytes)
```

## 정답
```text
1568
```
