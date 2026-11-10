---
{"title":"Token Appreciation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"JWT는 암호문이 아니다. 점으로 나뉜 두 번째 부분을 URL-safe Base64로 복호화하면 payload의 flag 필드가 보인다.","section":["CryptoHack","Crypto on the Web"]}
---

- 원문: https://cryptohack.org/challenges/web/#token-appreciation
- 분야: Crypto on the Web / jwt
- 검증: CryptoHack 공식 제출 API에서 `Success!` 응답 확인

## 풀이 원리

JWT는 암호문이 아니다. 점으로 나뉜 두 번째 부분을 URL-safe Base64로 복호화하면 payload의 `flag` 필드가 보인다.

## 최종 풀이 코드

Python 3에서 실행한다. 필요한 외부 패키지는 `ecc4`에만 `pycryptodome`이다.

```python
import base64, json
jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmbGFnIjoiY3J5cHRve2p3dF9jb250ZW50c19jYW5fYmVfZWFzaWx5X3ZpZXdlZH0iLCJ1c2VyIjoiQ3J5cHRvIE1jSGFjayIsImV4cCI6MjAwNTAzMzQ5M30.shKSmZfgGVvd2OSB2CGezzJ3N6WAULo3w9zCl_T47KQ'
payload = jwt.split('.')[1]
message = base64.urlsafe_b64decode(payload + '='*(-len(payload)%4))
print(json.loads(message)['flag'])
```

## 검증 방법

코드를 실행해 아래 결과와 일치하는지 확인한다. 이어서 위 원문 링크에서 같은 값을 제출하면 정답 처리된다. 코드 안의 `assert`는 문제에서 제공한 테스트 벡터나 수학적 조건을 확인한다.

```text
crypto{jwt_contents_can_be_easily_viewed}
```

## 최종 플래그

`crypto{jwt_contents_can_be_easily_viewed}`
