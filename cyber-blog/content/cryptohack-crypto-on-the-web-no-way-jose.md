---
{"title":"No Way JOSE","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"서버가 JWT 헤더의 alg: none을 허용하고 서명 검증을 끈다. 관리자 권한을 가진 payload를 서명 없이 만들어 authorise에 보낸다.","section":["CryptoHack","Crypto on the Web"]}
---

- 원문: https://cryptohack.org/challenges/web/#no-way-jose
- 실습: https://web.cryptohack.org/no-way-jose/
- 검증: 공식 실습 서버의 `authorise` 응답에 아래 플래그가 포함됨; CryptoHack 채점 Success!

## 풀이 원리

서버가 JWT 헤더의 `alg: none`을 허용하고 서명 검증을 끈다. 관리자 권한을 가진 payload를 서명 없이 만들어 `authorise`에 보낸다.

## 최종 익스플로잇

Python 3 및 `requests` 패키지가 필요하다. 코드를 실행하면 실습 서버에서 플래그를 직접 받아 출력한다.

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

## 검증 방법

코드를 실행해 `authorise`의 `response` 필드에서 아래 플래그가 출력되는지 확인한다. 서버의 공개된 소스에서 권한 검사 조건과 토큰 생성 방식을 대조할 수 있다.

```text
crypto{The_Cryptographic_Doom_Principle}
```

## 최종 플래그

`crypto{The_Cryptographic_Doom_Principle}`
