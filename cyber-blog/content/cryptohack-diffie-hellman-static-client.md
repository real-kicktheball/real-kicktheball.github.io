---
{"title":"Static Client","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"Bob이 정적 비밀지수 b를 재사용한다. 원래 Alice 공개값 A를 새 세션의 생성원 g로 넘기면 Bob의 새 공개값은 A^b, 즉 원래 세션의 공유 비밀이다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

Bob이 정적 비밀지수 b를 재사용한다. 원래 Alice 공개값 A를 새 세션의 생성원 g로 넘기면 Bob의 새 공개값은 A^b, 즉 원래 세션의 공유 비밀이다.

## 최종 익스플로잇

```python
import hashlib, json, re, socket
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

def parse(line,marker):
    return json.loads(line.decode().split(marker,1)[1])
def decrypt(shared,record):
    key=hashlib.sha1(str(shared).encode()).digest()[:16]
    ct=bytes.fromhex(record.get('encrypted_flag',record.get('encrypted')))
    iv=bytes.fromhex(record['iv'])
    pt=AES.new(key,AES.MODE_CBC,iv).decrypt(ct)
    match=re.search(rb'crypto\{[^}]+\}',pt)
    assert match
    return match.group().decode()

with socket.create_connection(('socket.cryptohack.org',13373),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    alice=parse(io.readline(),'Intercepted from Alice: ')
    parse(io.readline(),'Intercepted from Bob: ')
    ciphertext=parse(io.readline(),'Intercepted from Alice: ')
    forged={'p':alice['p'],'g':alice['A'],'A':'0x1'}
    io.write(json.dumps(forged).encode()+b'\n')
    response=parse(io.readline(),'Bob says to you: ')
    shared=int(response['B'],16)
    print(decrypt(shared,ciphertext))
```

## 최종 플래그

`crypto{n07_3ph3m3r4l_3n0u6h}`
