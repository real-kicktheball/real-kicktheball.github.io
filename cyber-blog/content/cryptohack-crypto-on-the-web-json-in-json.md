---
{"title":"JSON in JSON","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"JSON을 문자열 결합으로 만들면 인젝션이 된다. 중복 키는 마지막 값이 이긴다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

**JSON**은 `{"이름": "값"}` 모양으로 정보를 적는 양식이다. 따옴표(`"`)로 글자의 시작과 끝을 표시한다.

### 문제의 코드

서버가 JSON을 **글자 이어 붙이기**로 만든다.

```
'{"admin": "False", "username": "' + 사용자이름 + '"}'
```

### 따옴표로 탈출하기

사용자 이름에 따옴표를 넣으면 글자를 **일찍 끝내고** 새 항목을 끼워 넣을 수 있다.

사용자 이름을 `bob", "admin": "True`로 하면 다음과 같이 된다.

```
{"admin": "False", "username": "bob", "admin": "True"}
```

`admin`이 두 번 나온다. 파이썬 JSON 해석기는 **마지막 값**을 쓴다. 그래서 `admin`이 `True`가 된다.

### 비유

신청서의 "이름" 칸에 "철수 / 직급: 사장"이라고 써서 직급 칸까지 내가 채워버리는 것이다.

이런 공격을 **인젝션(주입)**이라고 한다. 사용자 입력을 그대로 이어 붙이면 생긴다. JSON은 직접 이어 붙이지 말고 `json.dumps()` 같은 함수로 만들어야 한다.

### 정리

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
