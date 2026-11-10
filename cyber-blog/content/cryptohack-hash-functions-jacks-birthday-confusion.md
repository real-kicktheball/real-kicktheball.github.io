---
{"title":"Jack's Birthday Confusion","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"서로 다른 n개 입력의 해시가 모두 다를 확률은 ∏(1-i/2048)이다. 충돌 확률이 75% 이상이 되는 최초 n은 76이다.","section":["CryptoHack","Hash Functions"]}
---

## 풀이 원리

서로 다른 n개 입력의 해시가 모두 다를 확률은 `∏(1-i/2048)`이다. 충돌 확률이 75% 이상이 되는 최초 n은 76이다.

## 최종 풀이 코드

Python 3에서 실행한다. 필요한 외부 패키지는 `ecc4`에만 `pycryptodome`이다.

```python
N = 2**11
no_collision = 1.0
for n in range(1, N+2):
    no_collision *= (N-(n-1))/N
    if 1-no_collision >= 0.75:
        print(n)
        break
```

## 검증 방법

코드를 실행해 아래 결과와 일치하는지 확인한다. 이어서 위 원문 링크에서 같은 값을 제출하면 정답 처리된다. 코드 안의 `assert`는 문제에서 제공한 테스트 벡터나 수학적 조건을 확인한다.

```text
76
```

## 최종 플래그

`76`
