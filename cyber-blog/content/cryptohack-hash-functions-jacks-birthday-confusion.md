---
{"title":"Jack's Birthday Confusion","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"서로 다른 n개 입력의 해시가 모두 다를 확률은 ∏(1-i/2048)이다. 충돌 확률이 75% 이상이 되는 최초 n은 76이다.","section":["CryptoHack","Hash Functions"]}
---

## 풀이 원리

서로 다른 n개 입력의 해시가 모두 다를 확률은 `∏(1-i/2048)`이다. 충돌 확률이 75% 이상이 되는 최초 n은 76이다.

## 최종 풀이 코드

```python
N = 2**11
no_collision = 1.0
for n in range(1, N+2):
    no_collision *= (N-(n-1))/N
    if 1-no_collision >= 0.75:
        print(n)
        break
```

## 최종 플래그

`76`
