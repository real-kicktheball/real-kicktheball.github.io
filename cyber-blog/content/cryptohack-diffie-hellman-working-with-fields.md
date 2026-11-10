---
{"title":"Working with Fields","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"유한체에서 g의 곱셈 역원을 계산한다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

유한체에서 g의 곱셈 역원을 계산한다.

## 최종 풀이 코드

필요 패키지: `python3`, `pycryptodome`, `sympy`(코드에서 사용하는 경우).

```python
p,g=991,209
d=pow(g,-1,p)
assert g*d % p == 1
print(d)
```

## 검증

CryptoHack 계정에 정답을 제출해 성공을 확인했다. 코드를 실행하여 아래 결과를 얻었다. 코드 안의 `assert`로 핵심 관계를 확인했다. 출력값을 문제의 조건에 다시 대입해 확인한다.

```text
569
```

## 최종 답

`569`
