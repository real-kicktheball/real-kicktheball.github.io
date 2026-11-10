---
{"title":"Generators of Groups","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"생성원(원시근) g는 거듭제곱으로 F_p*의 모든 원소를 만든다. p-1의 소인수로 판정한다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 개념

$g$의 거듭제곱 $g, g^2, g^3, \dots$은 언젠가 1로 돌아온다. 처음 1이 되는 지수 $k$를 $g$의 **위수(order)**라 한다. 위수가 $p - 1$이면 $g$가 $\mathbb{F}_p^{\times}$의 모든 원소를 만들어낸다. 이런 $g$를 **생성원(원시근)**이라 한다.

위수는 항상 $p - 1$의 약수다(라그랑주 정리). 그래서 $p - 1$의 모든 소인수 $q$에 대해 다음을 확인하면 된다.

$$
g^{(p-1)/q} \not\equiv 1 \pmod p
$$

위수가 $p - 1$보다 작다면 어떤 $(p-1)/q$의 약수가 되므로 위 값 중 하나가 1이 된다.

DH에서 생성원을 쓰는 이유는 공개값 $g^a$가 가능한 값 전체에 고르게 퍼지게 하기 위해서다.

## 문제

$p = 28151$의 가장 작은 생성원을 구한다.

## 풀이

$p - 1 = 28150 = 2 \cdot 5^2 \cdot 563$이다. 소인수는 2, 5, 563이다. $g = 2$부터 올라가며 $g^{14075}$, $g^{5630}$, $g^{50}$이 모두 1이 아닌 첫 $g$를 찾으면 **7**이다.

## 풀이 코드
```python
from sympy import factorint
p=28151
factors=list(factorint(p-1))
flag=next(g for g in range(2,p) if all(pow(g,(p-1)//q,p)!=1 for q in factors))
assert all(pow(flag,(p-1)//q,p)!=1 for q in factors)
print(flag)
```

## 정답
`7`
