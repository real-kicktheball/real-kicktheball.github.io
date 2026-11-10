---
{"title":"Generators of Groups","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"원시근 판정: p−1의 각 서로 다른 소인수 q에 대해 g^((p−1)/q) != 1이어야 한다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

원시근 판정: p−1의 각 서로 다른 소인수 q에 대해 g^((p−1)/q) != 1이어야 한다.

## 최종 풀이 코드

필요 패키지: `python3`, `pycryptodome`, `sympy`(코드에서 사용하는 경우).

```python
from sympy import factorint
p=28151
factors=list(factorint(p-1))
flag=next(g for g in range(2,p) if all(pow(g,(p-1)//q,p)!=1 for q in factors))
assert all(pow(flag,(p-1)//q,p)!=1 for q in factors)
print(flag)
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

코드를 실행하여 아래 결과를 얻었다. 코드 안의 `assert`로 핵심 관계를 확인했다. 출력값을 문제의 조건에 다시 대입해 확인한다.

```text
7
```

## 최종 답

`7`
