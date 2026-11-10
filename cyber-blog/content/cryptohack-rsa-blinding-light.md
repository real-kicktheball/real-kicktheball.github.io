---
{"title":"Blinding Light","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"금지된 admin=True 메시지 정수 m을 임의의 가역 r로 블라인딩하여 m·r^e mod N을 서명시킨다. 서명값에 r의 역원을 곱하면 원래 m에 대한 유효한 서명이 된다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

금지된 admin=True 메시지 정수 m을 임의의 가역 r로 블라인딩하여 m·r^e mod N을 서명시킨다. 서명값에 r의 역원을 곱하면 원래 m에 대한 유효한 서명이 된다.

## 최종 익스플로잇

```python
import json, math, secrets, socket
with socket.create_connection(('socket.cryptohack.org',13376),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    io.readline()
    def ask(payload):
        io.write(json.dumps(payload).encode()+b'\n')
        return json.loads(io.readline())
    pub=ask({'option':'get_pubkey'})
    N,e=int(pub['N'],16),int(pub['e'],16)
    admin=b'admin=True'
    m=int.from_bytes(admin,'big')
    while True:
        r=secrets.randbelow(N-2)+2
        if math.gcd(r,N)!=1: continue
        blinded=m*pow(r,e,N)%N
        request=blinded.to_bytes((blinded.bit_length()+7)//8,'big')
        if admin not in request: break
    signed=int(ask({'option':'sign','msg':request.hex()})['signature'],16)
    signature=signed*pow(r,-1,N)%N
    assert pow(signature,e,N)==m
    print(ask({'option':'verify','msg':admin.hex(),'signature':hex(signature)})['response'])
```

## 최종 플래그

`crypto{m4ll34b1l17y_c4n_b3_d4n63r0u5}`
