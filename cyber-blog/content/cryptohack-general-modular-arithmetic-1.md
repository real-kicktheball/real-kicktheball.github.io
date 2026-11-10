---
{"title":"Modular Arithmetic 1","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"각 수를 지정된 모듈러로 나눈 나머지 가운데 작은 수를 제출한다.","section":["CryptoHack","General"]}
---

## 풀이 원리

각 수를 지정된 모듈러로 나눈 나머지 가운데 작은 수를 제출한다.

## 최종 풀이 코드

```python
x=11%6
y=8146798528947%17
print(min(x,y))
```

## 최종 플래그

```text
4
```
