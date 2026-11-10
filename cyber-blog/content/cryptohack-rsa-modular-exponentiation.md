---
{"title":"Modular Exponentiation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"모듈러 거듭제곱을 계산한다. Python의 세 인수 pow는 중간 큰 정수를 만들지 않는다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

모듈러 거듭제곱을 계산한다. Python의 세 인수 pow는 중간 큰 정수를 만들지 않는다.

## 최종 풀이 코드

```python
result = pow(101,17,22663)
assert result == 101**17 % 22663
print(result)
```

## 최종 답

`19906`
