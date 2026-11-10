---
{"title":"Let's Decrypt","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"검증기가 요청자가 보낸 공개키 N,e를 사용한다. e=1로 두고, 원본 서명 S와 원하는 메시지의 PKCS#1 v1.5 SHA-1 인코딩값 D의 차 S−D를 새 법으로 보내면 S mod (S−D)=D가 되어 서명이 유효해진다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

검증기가 요청자가 보낸 공개키 N,e를 사용한다. e=1로 두고, 원본 서명 S와 원하는 메시지의 PKCS#1 v1.5 SHA-1 인코딩값 D의 차 S−D를 새 법으로 보내면 S mod (S−D)=D가 되어 서명이 유효해진다.

## 최종 익스플로잇

```python
import hashlib, json, re, socket
msg='I am Mallory, I own CryptoHack.org'
with socket.create_connection(('socket.cryptohack.org',13391),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    io.readline()
    def ask(payload):
        io.write(json.dumps(payload).encode()+b'\n')
        return json.loads(io.readline())
    sig=int(ask({'option':'get_signature'})['signature'],16)
    digest_info=bytes.fromhex('3021300906052b0e03021a05000414')+hashlib.sha1(msg.encode()).digest()
    encoded=b'\x00\x01'+b'\xff'*(256-len(digest_info)-3)+b'\x00'+digest_info
    D=int.from_bytes(encoded,'big')
    assert sig>D
    N=sig-D
    assert pow(sig,1,N)==D
    result=ask({'option':'verify','msg':msg,'N':hex(N),'e':'0x1'})['msg']
    print(re.search(r'crypto\{[^}]+\}',result).group())
```

## 최종 플래그

`crypto{dupl1c4t3_s1gn4tur3_k3y_s3l3ct10n}`
