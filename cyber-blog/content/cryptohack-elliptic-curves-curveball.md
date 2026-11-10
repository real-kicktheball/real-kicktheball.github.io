---
{"title":"Curveball","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"인증서 검증에서 생성점 G까지 공격자가 정할 수 있으면 신뢰된 공개키 Q에 대해 아무 개인키나 만들 수 있다(CVE-2020-0601).","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

ECC 공개키 $Q = dG$는 **생성점 $G$가 고정**되어 있을 때만 의미가 있다. $G$를 마음대로 바꿀 수 있으면 아무 $d$를 고른 뒤 다음처럼 $G'$를 만들면 된다.

$$
G' = d^{-1} Q \quad \Rightarrow \quad d \cdot G' = Q
$$

이러면 남의 공개키 $Q$에 대한 "개인키"를 가진 셈이 된다.

2020년 Windows CryptoAPI의 **CurveBall**(CVE-2020-0601)이 이 취약점이다. 인증서의 명시적 곡선 파라미터를 검증하지 않아서, 신뢰된 루트 CA를 사칭하는 인증서를 만들 수 있었다.

## 문제

서버가 신뢰하는 호스트(`www.bing.com`)의 공개키 목록이 있다. 요청할 때 곡선, 생성점, 개인키를 함께 보내면 서버가 계산한 공개키가 목록에 있는지 확인한다. 단 $d = \pm 1$은 막혀 있다.

## 풀이

1. Bing의 공개키 $Q$를 가져온다.
2. $d = 2$로 정하고 $G' = 2^{-1} Q$를 계산한다($2^{-1}$은 곡선 위수에 대한 역원).
3. $G'$와 $d = 2$를 보내면 서버가 $2G' = Q$를 계산해서 Bing으로 인정하고 플래그를 준다.

## 풀이 코드
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

## 플래그
`crypto{Curveballing_Microsoft_CVE-2020-0601}`
