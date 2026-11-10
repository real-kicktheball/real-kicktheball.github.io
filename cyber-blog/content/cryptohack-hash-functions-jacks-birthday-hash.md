---
{"title":"Jack's Birthday Hash","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"특정 해시값과 일치할 확률은 한 번에 1/2^11이다. n회 중 적어도 한 번 일치할 확률 1-(1-1/2048)^n이 50% 이상이 되는 최소 n은 1420이다.","section":["CryptoHack","Hash Functions"]}
---

## 풀이 원리

특정 해시값과 일치할 확률은 한 번에 `1/2^11`이다. n회 중 적어도 한 번 일치할 확률 `1-(1-1/2048)^n`이 50% 이상이 되는 최소 n은 1420이다.

## 최종 풀이 코드

Python 3에서 실행한다. 필요한 외부 패키지는 `ecc4`에만 `pycryptodome`이다.

```python
import math
N = 2**11
n = math.ceil(math.log(0.5)/math.log(1-1/N))
assert 1-(1-1/N)**(n-1) < 0.5 <= 1-(1-1/N)**n
print(n)
```

## 검증 방법

코드를 실행해 아래 결과와 일치하는지 확인한다. 이어서 위 원문 링크에서 같은 값을 제출하면 정답 처리된다. 코드 안의 `assert`는 문제에서 제공한 테스트 벡터나 수학적 조건을 확인한다.

```text
1420
```

## 최종 플래그

`1420`
