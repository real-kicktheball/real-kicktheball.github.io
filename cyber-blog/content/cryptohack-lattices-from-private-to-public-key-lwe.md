---
{"title":"From Private to Public Key LWE","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"Kyber1024의 공개키는 표준 매개변수에서 1568바이트다. 공개키의 다항식 벡터 4개는 각각 384바이트이고, 추가 시드 32바이트를 합하면 4 imes384+32=1568이다.","section":["CryptoHack","Lattices"]}
---

분야: Lattices / lwe  
문제: https://cryptohack.org/challenges/post-quantum/#lwe-private-public  
검증: 2026-11-10, 로컬 실행 및 CryptoHack 계정 정답 처리 확인

## 풀이 방법

Kyber1024의 공개키는 표준 매개변수에서 1568바이트다. 공개키의 다항식 벡터 4개는 각각 384바이트이고, 추가 시드 32바이트를 합하면 $4	imes384+32=1568$이다.

## 최종 풀이 코드

아래 코드를 Python 3에서 실행한다. `sympy`를 가져오는 문제는 `pip install sympy`가 필요하다.

```python
k = 4
poly_bytes = 384
seed_bytes = 32
print(k * poly_bytes + seed_bytes)
```

## 검증 방법

코드의 표준 출력이 아래 정답과 같은지 확인한다. 같은 값을 CryptoHack 문제의 제출 폼에 넣었을 때 계정에 **solved** 표시가 나타나는 것도 확인했다.

## 최종 정답

```text
1568
```
