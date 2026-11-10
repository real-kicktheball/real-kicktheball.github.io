---
{"title":"JWT Sessions","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"서버 세션과 달리 JWT는 상태를 클라이언트가 들고 다닌다. 보통 Authorization: Bearer 헤더로 보낸다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

로그인 상태를 기억하는 방법은 크게 두 가지다.

| 방식 | 비유 | 기억하는 곳 |
|---|---|---|
| 세션 | 놀이공원이 손님 명단을 들고 있고, 손님은 번호표만 가진다 | 서버 |
| JWT | 손님이 도장 찍힌 자유이용권을 직접 들고 다닌다 | 손님(브라우저) |

JWT 방식은 서버가 명단을 보관하지 않아도 된다. 대신 이미 나눠준 자유이용권을 중간에 취소하기 어렵다.

### JWT를 서버에 보여주는 법

브라우저는 서버에 요청할 때 **HTTP 헤더**라는 "봉투 겉면"에 정보를 적어서 보낸다. JWT는 보통 이렇게 적는다.

```
Authorization: Bearer eyJhbGciOi...
```

`Authorization`은 "인증"이라는 뜻이고, `Bearer`는 "이 표를 가진 사람"이라는 뜻이다. 이 문제의 답이 바로 그 헤더 이름 **Authorization**이다.

### 정리

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
