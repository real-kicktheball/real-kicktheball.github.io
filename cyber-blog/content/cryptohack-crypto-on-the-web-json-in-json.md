---
{"title":"JSON in JSON","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"JSON을 문자열 결합으로 만들면 인젝션이 된다. 중복 키는 마지막 값이 이긴다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

서버가 JSON을 문자열 이어 붙이기로 만들면 SQL 인젝션과 같은 문제가 생긴다.

```python
body = '{"admin": "False", "username": "' + username + '"}'
```

사용자 입력에 `"`를 넣으면 문자열을 닫고 새 키를 끼워 넣을 수 있다. 파이썬 `json.loads`는 **중복 키가 있으면 마지막 값**을 쓴다. 그래서 뒤에 넣은 키가 앞의 값을 덮어쓴다.

이 경우 서명은 아무 도움이 안 된다. 조작된 JSON에 서버가 직접 정상 서명을 해주기 때문이다.

## 문제

서버가 위처럼 username을 끼워 넣은 JSON으로 JWT를 만들어준다. `admin`이 `"True"`인 토큰을 보내면 플래그를 준다.

## 풀이

1. username으로 `x", "admin": "True`를 보낸다.
2. 만들어지는 JSON은 `{"admin": "False", "username": "x", "admin": "True"}`가 된다.
3. 서버가 서명해준 이 토큰을 `authorise`에 보내면 `admin`이 `True`로 읽혀서 플래그가 나온다.

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
injection = 'x", "admin": "True'
session = endpoint('json-in-json', 'create_session', injection)['session']
print(flag_from(endpoint('json-in-json', 'authorise', session)))
```

## 플래그
`crypto{https://owasp.org/www-community/Injection_Theory}`
