---
{"title":"Token Appreciation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"JWT는 header.payload.signature 구조이고 payload는 Base64일 뿐 암호화되지 않는다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

**JWT(JSON Web Token)**는 로그인 상태 같은 정보를 담아 주고받는 토큰이다. 점(`.`)으로 나뉜 세 부분으로 되어 있다.

```
eyJ0eXAiOi...  .  eyJmbGFnIj...  .  shKSmZfgGV...
   header            payload           signature
```

- **header**: 서명 알고리즘(`alg`) 등
- **payload**: 실제 데이터(claims)
- **signature**: header와 payload에 대한 서명(HMAC이나 RSA/ECDSA)

header와 payload는 **URL-safe Base64**로 인코딩만 된 것이라 누구나 읽을 수 있다. 서명은 위조를 막아줄 뿐 내용을 숨기지 않는다. 비밀 정보를 JWT payload에 넣으면 안 되는 이유다.

## 문제

JWT 문자열 하나가 주어진다.

## 풀이

1. 두 번째 부분을 떼어낸다.
2. Base64 패딩(`=`)을 맞춰서 디코딩한다.
3. JSON에서 `flag` 값을 읽는다.

## 풀이 코드
```python
import base64, json
jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmbGFnIjoiY3J5cHRve2p3dF9jb250ZW50c19jYW5fYmVfZWFzaWx5X3ZpZXdlZH0iLCJ1c2VyIjoiQ3J5cHRvIE1jSGFjayIsImV4cCI6MjAwNTAzMzQ5M30.shKSmZfgGVvd2OSB2CGezzJ3N6WAULo3w9zCl_T47KQ'
payload = jwt.split('.')[1]
message = base64.urlsafe_b64decode(payload + '='*(-len(payload)%4))
print(json.loads(message)['flag'])
```

## 플래그
`crypto{jwt_contents_can_be_easily_viewed}`
