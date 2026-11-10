---
{"title":"Greatest Common Divisor","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"유클리드 알고리즘으로 두 수의 최대공약수를 구한다. math.gcd가 같은 계산을 수행한다.","section":["CryptoHack","General"]}
---

## 풀이 원리

유클리드 알고리즘으로 두 수의 최대공약수를 구한다. `math.gcd`가 같은 계산을 수행한다.

## 최종 풀이 코드

```python
from math import gcd
print(gcd(66528,52920))
```

## 최종 플래그

```text
1512
```
