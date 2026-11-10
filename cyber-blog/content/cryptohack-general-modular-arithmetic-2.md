---
{"title":"Modular Arithmetic 2","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"페르마의 소정리에 따라 65537과 서로소인 정수의 65536제곱은 1이다. 모듈러 거듭제곱으로 직접 확인한다.","section":["CryptoHack","General"]}
---

## 풀이 원리

페르마의 소정리에 따라 65537과 서로소인 정수의 65536제곱은 1이다. 모듈러 거듭제곱으로 직접 확인한다.

## 최종 풀이 코드

```python
print(pow(273246787654,65536,65537))
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
1
```
