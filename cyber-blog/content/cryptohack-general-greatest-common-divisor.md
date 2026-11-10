---
{"title":"Greatest Common Divisor","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"유클리드 알고리즘으로 두 수의 최대공약수를 구한다. math.gcd가 같은 계산을 수행한다.","section":["CryptoHack","General"]}
---

- 문제: [Greatest Common Divisor](https://cryptohack.org/challenges/general/#gcd)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)


## 풀이 원리

유클리드 알고리즘으로 두 수의 최대공약수를 구한다. `math.gcd`가 같은 계산을 수행한다.

## 최종 풀이 코드

```python
from math import gcd
print(gcd(66528,52920))
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
1512
```
