---
{"title":"JSON in JSON","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"서버는 사용자 이름을 문자열 결합으로 JSON에 삽입하고 json.loads로 읽는다. \", \"admin\": \"True를 이름으로 보내면 뒤에 나온 중복 admin 키가 앞의 False를 덮어쓴다. 서버가 자신이 만든 토큰에 정상적으로 서명…","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

서버는 사용자 이름을 문자열 결합으로 JSON에 삽입하고 `json.loads`로 읽는다. `", "admin": "True`를 이름으로 보내면 뒤에 나온 중복 `admin` 키가 앞의 `False`를 덮어쓴다. 서버가 자신이 만든 토큰에 정상적으로 서명하므로 비밀키가 필요 없다.

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
injection = 'x", "admin": "True'
session = endpoint('json-in-json', 'create_session', injection)['session']
print(flag_from(endpoint('json-in-json', 'authorise', session)))
```

## 최종 플래그

`crypto{https://owasp.org/www-community/Injection_Theory}`
