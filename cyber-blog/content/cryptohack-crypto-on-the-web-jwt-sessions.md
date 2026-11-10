---
{"title":"JWT Sessions","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"서버 세션과 달리 JWT는 상태를 클라이언트가 들고 다닌다. 보통 Authorization: Bearer 헤더로 보낸다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

로그인 상태를 유지하는 방식은 두 가지다.

| 방식 | 상태 저장 위치 | 클라이언트가 보내는 것 |
|---|---|---|
| 세션 | 서버(DB, 메모리) | 세션 ID 쿠키 |
| JWT | 토큰 자체 | 서명된 토큰 |

JWT는 서버가 상태를 저장하지 않아도 되는 대신, 발급한 토큰을 만료 전에 취소하기 어렵다. 브라우저에서는 쿠키에 넣거나 HTTP 헤더로 보낸다.

```
Authorization: Bearer eyJ0eXAiOiJKV1Qi...
```

## 문제

JWT를 서버에 보낼 때 일반적으로 쓰는 HTTP 헤더 이름을 묻는다.

## 풀이

답은 `Authorization`이다.

## 풀이 코드
```python
print('Authorization')
```

## 플래그
`Authorization`
