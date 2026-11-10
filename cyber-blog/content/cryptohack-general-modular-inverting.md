---
{"title":"Modular Inverting","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"3의 모듈러 13 역원을 구한다. 3×9=27≡1 (mod 13)이다.","section":["CryptoHack","General"]}
---

## 풀이 원리

3의 모듈러 13 역원을 구한다. `3×9=27≡1 (mod 13)`이다.

## 최종 풀이 코드

```python
print(pow(3,-1,13))
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
9
```
