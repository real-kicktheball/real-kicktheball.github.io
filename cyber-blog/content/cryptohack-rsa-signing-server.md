---
{"title":"Signing Server","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"교과서 RSA에서 서명과 복호화는 같은 연산이다. 서명 오라클에 암호문을 보내면 그대로 복호화된다.","section":["CryptoHack","RSA"]}
---

## 개념

RSA에서 **서명하기**와 **복호화하기**는 계산이 완전히 똑같다. 둘 다 비밀키 $d$번 곱하기다.

$$
\text{서명}(x) = x^d \bmod N = \text{복호화}(x)
$$

그래서 "뭐든 서명해줄게!" 하는 서버는 사실 "뭐든 복호화해줄게!" 하는 서버다.

### 비유

도장 찍어주는 기계가 있는데, 알고 보니 이 기계가 금고 열쇠와 똑같이 생겼다. 금고(암호문)를 들고 가서 "도장 찍어주세요" 하면 금고가 열린다.

### 이 문제에서

1. 서버에게 비밀 메시지의 암호문 $c$를 받는다.
2. 그 $c$를 그대로 "서명해주세요"라고 보낸다.
3. 서버가 $c^d = m$을 돌려준다. 그게 평문이다.

그래서 실제로는 서명용 키와 암호화용 키를 따로 쓴다. 서명할 때는 해시와 패딩을 거친 값에만 서명한다.

### 정리

교과서 RSA에서 서명과 복호화는 **똑같은 연산**이다.

$$
\text{Sign}(x) = x^d \bmod N = \text{Decrypt}(x)
$$

그래서 아무 값이나 서명해주는 서버가 있으면, 그 서버가 곧 복호화 오라클이 된다. 실제 시스템에서 서명은 해시와 패딩을 거친 값에만 하고, 서명용 키와 암호화용 키를 분리하는 이유다.

## 문제

서버가 `get_secret`으로 비밀 메시지의 RSA 암호문을 주고, `sign`으로는 보낸 값을 아무 검사 없이 서명해준다.

## 풀이

`get_secret`으로 받은 암호문 $c$를 그대로 `sign`에 보낸다. 돌아온 "서명"이 $c^d = m$이다. 바이트로 바꾸면 플래그가 나온다.

## 풀이 코드
```python
import json, re, socket
from Crypto.Util.number import long_to_bytes
with socket.create_connection(('socket.cryptohack.org',13374),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    io.readline()
    def ask(payload):
        io.write(json.dumps(payload).encode()+b'\n')
        return json.loads(io.readline())
    pub=ask({'option':'get_pubkey'})
    c=int(ask({'option':'get_secret'})['secret'],16)
    m=int(ask({'option':'sign','msg':hex(c)})['signature'],16)
    assert pow(m,int(pub['e'],16),int(pub['N'],16))==c
    flag=re.search(rb'crypto\{[^}]+\}',long_to_bytes(m)).group().decode()
    print(flag)
```

## 플래그
`crypto{d0n7_516n_ju57_4ny7h1n6}`
