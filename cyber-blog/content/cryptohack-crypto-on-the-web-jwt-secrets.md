---
{"title":"JWT Secrets","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"HS256 JWT는 비밀키를 알면 누구나 위조할 수 있다. 문서 예시 키를 그대로 쓰면 바로 뚫린다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

**HS256**은 HMAC-SHA256으로 서명한다. 서명과 검증에 같은 비밀키를 쓰는 대칭 방식이다.

$$
\text{signature} = \text{HMAC-SHA256}(\text{key},\ \text{header} \,.\, \text{payload})
$$

키를 아는 사람은 누구나 유효한 토큰을 만들 수 있다. 그래서 키는 충분히 길고 랜덤해야 한다. 짧거나 흔한 키는 `hashcat`, `jwt_tool` 같은 도구로 오프라인 사전 공격이 된다.

## 문제

서버 소스에 "PyJWT README 예제의 키를 썼다"는 주석이 있다.

## 풀이

1. PyJWT 문서 예제의 키는 `secret`이다.
2. 이 키로 `"admin": true` payload에 HS256 서명을 해서 보낸다.
3. 서버가 관리자 토큰으로 인정하고 플래그를 준다.

## 풀이 코드
```python
import requests, json, base64, hmac, hashlib, urllib.parse, re

def b64(data):
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

def token(payload, algorithm, key=None):
    header = {'typ': 'JWT', 'alg': algorithm}
    message = b64(json.dumps(header, separators=(',', ':')).encode()) + '.' + b64(json.dumps(payload, separators=(',', ':')).encode())
    signature = b64(hmac.new(key, message.encode(), hashlib.sha256).digest()) if key else ''
    return message + '.' + signature

def endpoint(slug, action, value):
    url = f'https://web.cryptohack.org/{slug}/{action}/{urllib.parse.quote(value, safe="")}/'
    response = requests.get(url, timeout=20)
    response.raise_for_status()
    return response.json()

def flag_from(response):
    assert 'response' in response, response
    return re.search(r'crypto\{[^}]+\}', response['response']).group(0)
forged = token({'username':'attacker','admin':True}, 'HS256', b'secret')
print(flag_from(endpoint('jwt-secrets', 'authorise', forged)))
```

## 플래그
`crypto{jwt_secret_keys_must_be_protected}`
