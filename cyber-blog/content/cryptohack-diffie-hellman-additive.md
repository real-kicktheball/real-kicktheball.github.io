---
{"title":"Additive","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"덧셈군에서는 공개값이 A=a·g, B=b·g이므로 a=A·g⁻¹ mod p를 계산할 수 있다. 공유 비밀은 A·B·g⁻¹ mod p다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

덧셈군에서는 공개값이 A=a·g, B=b·g이므로 a=A·g⁻¹ mod p를 계산할 수 있다. 공유 비밀은 A·B·g⁻¹ mod p다.

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

with socket.create_connection(('socket.cryptohack.org',13380),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    alice=parse(io.readline(),'Intercepted from Alice: ')
    bob=parse(io.readline(),'Intercepted from Bob: ')
    ciphertext=parse(io.readline(),'Intercepted from Alice: ')
    p,g,A,B=(int(alice['p'],16),int(alice['g'],16),int(alice['A'],16),int(bob['B'],16))
    a=A*pow(g,-1,p)%p
    shared=B*a%p
    assert shared==A*B*pow(g,-1,p)%p
    print(decrypt(shared,ciphertext))
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 새 서버 세션에 접속해 아래 결과를 얻었다. 두 방식으로 계산한 공유 비밀이 일치하는지 확인하고 CBC 암호문을 복호화했다.

```text
crypto{cycl1c_6r0up_und3r_4dd1710n?}
```

## 최종 플래그

`crypto{cycl1c_6r0up_und3r_4dd1710n?}`
