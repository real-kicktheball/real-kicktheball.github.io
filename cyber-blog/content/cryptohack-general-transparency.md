---
{"title":"Transparency","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"Certificate Transparency는 발급된 모든 TLS 인증서를 공개 로그에 기록한다. 이 로그로 숨겨진 서브도메인을 찾는다.","section":["CryptoHack","General"]}
---

## 개념

인증서는 아무나 만들면 안 된다. 그런데 인증기관이 실수나 해킹으로 가짜 인증서를 만들면 어떻게 될까?

그래서 **Certificate Transparency(인증서 투명성)**라는 제도가 생겼다. 발급한 모든 인증서를 **누구나 볼 수 있는 공개 장부**에 적게 하는 것이다. 수상한 인증서가 있으면 누구든 찾아낼 수 있다.

그런데 이 장부에는 **숨겨둔 사이트 주소**도 같이 적힌다. 회사가 몰래 만든 `secret.example.com`이라도, HTTPS 인증서를 받았다면 장부에 이름이 남는다.

### 이 문제에서

1. `crt.sh` 같은 장부 검색 사이트에서 `cryptohack.org`를 검색한다.
2. 수많은 주소 중 문제에서 준 열쇠와 같은 인증서를 찾는다.
3. 그 주소가 `thetransparencyflagishere.cryptohack.org`다. 접속하면 플래그가 있다.

### 정리

**Certificate Transparency(CT)**는 CA가 발급한 TLS 인증서를 모두 공개 로그에 기록하게 하는 제도다. 잘못 발급된 인증서를 누구나 찾아낼 수 있게 하려는 목적이다.

이 로그는 공격자에게도 유용하다. 어떤 도메인에 대해 발급된 인증서를 검색하면 외부에 알려지지 않은 서브도메인까지 드러난다. `crt.sh` 같은 검색 사이트를 쓰면 된다.

## 문제

`cryptohack.org` 아래 어딘가에 플래그를 둔 서브도메인이 있고, 그 TLS 인증서의 공개키(`transparency.pem`)가 주어진다.

## 풀이

1. CT 로그(crt.sh)에서 `cryptohack.org`의 인증서를 검색한다.
2. 주어진 공개키와 같은 키를 가진 인증서를 찾으면 도메인이 `thetransparencyflagishere.cryptohack.org`이다.
3. 해당 주소에 접속하면 페이지에 플래그가 있다.

지금은 이 서버의 인증서가 갱신돼서 키가 다르다. 그래서 과거 로그를 기준으로 찾아야 한다.

## 풀이 코드
```python
import requests, re
u='https://thetransparencyflagishere.cryptohack.org/'
r=requests.get(u,timeout=15);r.raise_for_status()
print(re.search(r'crypto\{[^}]+\}',r.text).group())
```

## 플래그
```text
crypto{thx_redpwn_for_inspiration}
```
