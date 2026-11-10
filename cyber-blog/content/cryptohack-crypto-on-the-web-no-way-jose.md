---
{"title":"No Way JOSE","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"서버가 JWT 헤더의 alg: none을 허용하고 서명 검증을 끈다. 관리자 권한을 가진 payload를 서명 없이 만들어 authorise에 보낸다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

서버가 JWT 헤더의 `alg: none`을 허용하고 서명 검증을 끈다. 관리자 권한을 가진 payload를 서명 없이 만들어 `authorise`에 보낸다.

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
forged = token({'username':'attacker','admin':True}, 'none')
print(flag_from(endpoint('no-way-jose', 'authorise', forged)))
```

## 최종 플래그

`crypto{The_Cryptographic_Doom_Principle}`
