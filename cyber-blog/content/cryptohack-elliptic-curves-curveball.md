---
{"title":"Curveball","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"인증서 검증에서 생성점 G까지 공격자가 정할 수 있으면 신뢰된 공개키 Q에 대해 아무 개인키나 만들 수 있다(CVE-2020-0601).","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

타원곡선 공개키는 $Q = d \times G$다. $G$는 모두가 약속한 **기준점**이고, $d$는 비밀키다. $G$가 고정돼 있으니까 $Q$에서 $d$를 찾기 어렵다.

### 기준점을 바꿀 수 있다면?

만약 **기준점 $G$를 내가 정할 수 있다면** 이야기가 달라진다. 남의 공개키 $Q$를 보고, 내가 아무 비밀키 $d$를 고른 다음 기준점을 이렇게 만들면 된다.

$$
G' = Q \div d
$$

그러면 $d \times G' = Q$가 된다. 남의 공개키에 대한 "비밀키"를 가진 셈이다.

### 직접 해보기 (숫자로)

공개키가 $Q = 12$이고 원래 기준점이 $G = 3$(비밀키 4)이라 하자. 기준점을 바꿀 수 있으면 비밀키를 2로 정하고 $G' = 12 \div 2 = 6$으로 하면 된다. $2 \times 6 = 12$로 공개키가 맞는다.

### 실제 사건: CurveBall

2020년 Windows가 인증서를 확인할 때 **기준점이 표준과 같은지 확인하지 않는** 버그가 있었다(CVE-2020-0601). 그래서 마이크로소프트 같은 진짜 회사의 인증서를 위조할 수 있었다.

### 정리

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
