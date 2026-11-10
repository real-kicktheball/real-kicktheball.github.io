---
{"title":"Jack's Birthday Hash","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"특정 해시값과 일치할 확률은 한 번에 1/2^11이다. n회 중 적어도 한 번 일치할 확률 1-(1-1/2048)^n이 50% 이상이 되는 최소 n은 1420이다.","section":["CryptoHack","Hash Functions"]}
---

## 풀이 원리

특정 해시값과 일치할 확률은 한 번에 `1/2^11`이다. n회 중 적어도 한 번 일치할 확률 `1-(1-1/2048)^n`이 50% 이상이 되는 최소 n은 1420이다.

## 최종 풀이 코드

```python
import math
N = 2**11
n = math.ceil(math.log(0.5)/math.log(1-1/N))
assert 1-(1-1/N)**(n-1) < 0.5 <= 1-(1-1/N)**n
print(n)
```

## 최종 플래그

`1420`
