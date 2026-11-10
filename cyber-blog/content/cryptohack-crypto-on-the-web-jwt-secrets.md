---
{"title":"JWT Secrets","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"소스의 주석은 PyJWT 문서의 예시 비밀키를 그대로 썼음을 암시한다. secret으로 HS256 서명을 만들면 서버가 관리자 토큰으로 인정한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

소스의 주석은 PyJWT 문서의 예시 비밀키를 그대로 썼음을 암시한다. `secret`으로 HS256 서명을 만들면 서버가 관리자 토큰으로 인정한다.

## 최종 익스플로잇

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

## 최종 플래그

`crypto{jwt_secret_keys_must_be_protected}`
