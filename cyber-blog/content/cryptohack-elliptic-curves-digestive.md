---
{"title":"Digestive","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"ECDSA는 해시를 위수 비트 길이만큼 잘라 쓴다. 해시 없이 메시지를 그대로 쓰면 앞 24바이트만 같은 다른 메시지에도 서명이 맞는다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

ECDSA는 메시지 해시 $z$를 곡선 위수의 비트 수만큼만 쓴다. P-192이면 **앞 192비트(24바이트)**만 쓴다.

정상적으로는 해시 출력의 앞부분이라 문제가 없다. 그런데 "해시 함수"가 메시지를 그대로 돌려준다고 하자. 그러면 **메시지의 앞 24바이트**만 서명에 들어간다. 24바이트 뒤를 아무리 바꿔도 서명은 그대로 유효하다.

## 문제

서버가 `{"admin": false, "username": "..."}` JSON에 서명해주고, `admin`이 true인 메시지를 검증에 통과시키면 플래그를 준다. 해시 함수 자리에 메시지를 그대로 반환하는 함수가 들어 있다.

## 풀이

1. 정상 서명을 하나 받는다.
2. 메시지 끝의 `}`를 `, "admin": true}`로 바꾼다. 앞 24바이트는 그대로라 서명이 유효하다.
3. JSON에 같은 키가 두 번 나오면 파이썬 파서는 **마지막 값**을 쓴다. 그래서 `admin`이 true가 된다.
4. 원래 서명과 함께 보내면 플래그를 받는다.

## 풀이 코드
```python
import requests, urllib.parse
base='https://web.cryptohack.org/digestive/'
issued=requests.get(base+'sign/alice/',timeout=20).json()
message=issued['msg'];signature=issued['signature']
forged=message[:-1]+', "admin": true}'
assert message[:24]==forged[:24]
url=base+'verify/'+urllib.parse.quote(forged,safe='')+'/'+signature+'/'
reply=requests.get(url,timeout=20).json()
print(reply['flag'])
```

## 플래그
`crypto{thanx_for_ctf_inspiration_https://mastodon.social/@filippo/109360453402691894}`
