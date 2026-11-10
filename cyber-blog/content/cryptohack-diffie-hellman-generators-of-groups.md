---
{"title":"Generators of Groups","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"원시근 판정: p−1의 각 서로 다른 소인수 q에 대해 g^((p−1)/q) != 1이어야 한다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

원시근 판정: p−1의 각 서로 다른 소인수 q에 대해 g^((p−1)/q) != 1이어야 한다.

## 최종 풀이 코드

```python
from sympy import factorint
p=28151
factors=list(factorint(p-1))
flag=next(g for g in range(2,p) if all(pow(g,(p-1)//q,p)!=1 for q in factors))
assert all(pow(flag,(p-1)//q,p)!=1 for q in factors)
print(flag)
```

## 최종 답

`7`
