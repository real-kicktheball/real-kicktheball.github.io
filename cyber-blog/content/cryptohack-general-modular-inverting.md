---
{"title":"Modular Inverting","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"3의 모듈러 13 역원을 구한다. 3×9=27≡1 (mod 13)이다.","section":["CryptoHack","General"]}
---

## 풀이 원리

3의 모듈러 13 역원을 구한다. `3×9=27≡1 (mod 13)`이다.

## 최종 풀이 코드

```python
print(pow(3,-1,13))
```

## 최종 플래그

```text
9
```
