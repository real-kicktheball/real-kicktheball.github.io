---
{"title":"No Way JOSE","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"JWT의 alg 값을 서버가 그대로 믿으면 alg=none으로 서명 없는 토큰이 통과한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

JWT 표준에는 서명하지 않는 `"alg": "none"`이 정의돼 있다. 문제는 일부 라이브러리가 **토큰 헤더의 `alg`를 보고 검증 방식을 고른다**는 것이다. 공격자가 `alg`를 `none`으로 바꾸고 서명을 비우면 검증이 통과해버린다.

검증하는 쪽이 허용할 알고리즘을 직접 정해야 한다. 토큰이 말하는 알고리즘을 믿으면 안 된다. 플래그의 "Cryptographic Doom Principle"도 같은 이야기다. 인증을 확인하기 전에 다른 처리를 하면 안 된다는 원칙이다.

## 문제

서버의 `authorise`가 토큰을 검증하고 `admin`이 true이면 플래그를 준다. 검증 코드가 헤더의 알고리즘을 그대로 쓴다.

## 풀이

1. header를 `{"typ":"JWT","alg":"none"}`로 만든다.
2. payload에 `"admin": true`를 넣는다.
3. `header.payload.`처럼 서명 부분을 비워서 보내면 플래그를 받는다.

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
forged = token({'username':'attacker','admin':True}, 'none')
print(flag_from(endpoint('no-way-jose', 'authorise', forged)))
```

## 플래그
`crypto{The_Cryptographic_Doom_Principle}`
