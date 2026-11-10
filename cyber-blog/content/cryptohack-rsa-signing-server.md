---
{"title":"Signing Server","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"서명 오라클은 임의 정수에 비밀지수 d를 적용한다. get_secret이 반환한 RSA 암호문을 그대로 sign에 보내면 복호화 결과가 서명값으로 돌아온다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

서명 오라클은 임의 정수에 비밀지수 d를 적용한다. get_secret이 반환한 RSA 암호문을 그대로 sign에 보내면 복호화 결과가 서명값으로 돌아온다.

## 최종 익스플로잇

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

## 최종 플래그

`crypto{d0n7_516n_ju57_4ny7h1n6}`
