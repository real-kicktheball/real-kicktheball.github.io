---
{"title":"Curveball","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"서버는 인증서의 생성점까지 요청자가 지정하게 한다. 신뢰 목록의 Bing 공개키 Q를 읽고, 서버의 abs(d)==1 차단을 피하려고 d=2로 택한다. 입력 생성점 g=2^-1·Q를 보내면 서버가 Q=2g를 계산하여 신뢰된 Bing 인증서와…","section":["CryptoHack","Elliptic Curves"]}
---

- 원문: https://cryptohack.org/challenges/ecc/#curveball
- 검증: CryptoHack 공식 실습 서버가 아래 플래그 반환

## 풀이 원리

서버는 인증서의 생성점까지 요청자가 지정하게 한다. 신뢰 목록의 Bing 공개키 Q를 읽고, 서버의 `abs(d)==1` 차단을 피하려고 `d=2`로 택한다. 입력 생성점 `g=2^-1·Q`를 보내면 서버가 `Q=2g`를 계산하여 신뢰된 Bing 인증서와 일치한다고 판단한다.

## 최종 익스플로잇

Python 3에서 실행한다. `curveball`과 `ps3`에는 `ecdsa` 패키지, `digestive`에는 `requests` 패키지가 필요하다.

```python
import socket, json, re
from ecdsa.curves import NIST256p
from ecdsa.ellipticcurve import Point

curve = NIST256p.curve
order = NIST256p.order
# 신뢰 목록에 있는 www.bing.com 공개키 Q
Q = Point(curve,
    0x3B827FF5E8EA151E6E51F8D0ABF08D90F571914A595891F9998A5BD49DFA3531,
    0xAB61705C502CA0F7AA127DEC096B2BBDC9BD3B4281808B3740C320810888592A,
    order=order)
g = Q * pow(2,-1,order)
assert 2*g == Q
payload = {'host':'attacker.example','curve':'secp256r1',
           'generator':[int(g.x()),int(g.y())], 'private_key':2}
with socket.create_connection(('socket.cryptohack.org',13382),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    io.readline()
    io.write(json.dumps(payload).encode()+b'\n')
    reply=io.readline().decode()
print(re.search(r'crypto\{[^}]+\}',reply).group(0))
```

## 검증 방법

스크립트를 실행해 아래 출력과 일치하는지 확인한다. `curveball`은 `2g=Q`, `digestive`는 서명 대상의 앞 24바이트가 동일함을 `assert`한다.

```text
crypto{Curveballing_Microsoft_CVE-2020-0601}
```

## 최종 플래그

`crypto{Curveballing_Microsoft_CVE-2020-0601}`
