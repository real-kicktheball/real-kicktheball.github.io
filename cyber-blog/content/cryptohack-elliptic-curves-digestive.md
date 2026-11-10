---
{"title":"Digestive","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"서명 함수의 HashFunc.digest()는 해시 없이 메시지 바이트를 그대로 돌려준다. NIST192p ECDSA 구현은 앞 192비트, 즉 24바이트만 메시지 대표값으로 사용한다. 정상 서명 메시지 끝의 }를 , \"admin\": tru…","section":["CryptoHack","Elliptic Curves"]}
---

- 원문: https://cryptohack.org/challenges/ecc/#digestive
- 검증: CryptoHack 공식 실습 서버가 아래 플래그 반환

## 풀이 원리

서명 함수의 `HashFunc.digest()`는 해시 없이 메시지 바이트를 그대로 돌려준다. NIST192p ECDSA 구현은 앞 192비트, 즉 24바이트만 메시지 대표값으로 사용한다. 정상 서명 메시지 끝의 `}`를 `, "admin": true}`로 바꾸면 앞 24바이트가 그대로여서 서명이 유효하다. JSON 파서는 마지막 중복 `admin` 값을 True로 처리한다.

## 최종 익스플로잇

Python 3에서 실행한다. `curveball`과 `ps3`에는 `ecdsa` 패키지, `digestive`에는 `requests` 패키지가 필요하다.

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

## 검증 방법

스크립트를 실행해 아래 출력과 일치하는지 확인한다. `curveball`은 `2g=Q`, `digestive`는 서명 대상의 앞 24바이트가 동일함을 `assert`한다.

```text
crypto{thanx_for_ctf_inspiration_https://mastodon.social/@filippo/109360453402691894}
```

## 최종 플래그

`crypto{thanx_for_ctf_inspiration_https://mastodon.social/@filippo/109360453402691894}`
