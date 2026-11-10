---
{"title":"Modular Exponentiation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"모듈러 거듭제곱을 계산한다. Python의 세 인수 pow는 중간 큰 정수를 만들지 않는다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

모듈러 거듭제곱을 계산한다. Python의 세 인수 pow는 중간 큰 정수를 만들지 않는다.

## 최종 풀이 코드

필요 패키지: `python3`, `pycryptodome`, `sympy`(코드에서 사용하는 경우).

```python
result = pow(101,17,22663)
assert result == 101**17 % 22663
print(result)
```

## 검증

CryptoHack 계정에 정답을 제출해 성공을 확인했다. 코드를 실행하여 아래 결과를 얻었다. 코드 안의 `assert`로 핵심 관계를 확인했다. 출력값을 문제의 조건에 다시 대입해 확인한다.

```text
19906
```

## 최종 답

`19906`
