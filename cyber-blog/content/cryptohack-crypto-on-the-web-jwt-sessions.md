---
{"title":"JWT Sessions","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"JWT는 통상 HTTP Authorization 헤더의 Bearer 토큰으로 서버에 보낸다. 이 문제는 헤더 이름을 요구한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

JWT는 통상 HTTP `Authorization` 헤더의 Bearer 토큰으로 서버에 보낸다. 이 문제는 헤더 이름을 요구한다.

## 최종 풀이 코드

```python
print('Authorization')
```

## 최종 플래그

`Authorization`
