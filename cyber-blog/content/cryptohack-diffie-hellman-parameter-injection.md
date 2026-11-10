---
{"title":"Parameter Injection","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"중간자 위치에서 Alice의 A와 Bob의 B를 모두 1로 교체한다. 양쪽이 계산한 공유 비밀도 1이므로 공개된 IV와 암호문을 복호화할 수 있다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

중간자 위치에서 Alice의 A와 Bob의 B를 모두 1로 교체한다. 양쪽이 계산한 공유 비밀도 1이므로 공개된 IV와 암호문을 복호화할 수 있다.

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

with socket.create_connection(('socket.cryptohack.org',13371),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    alice=parse(io.readline(),'Intercepted from Alice: ')
    alice['A']='0x1'
    io.write(json.dumps(alice).encode()+b'\n')
    bob=parse(io.readline(),'Intercepted from Bob: ')
    bob['B']='0x1'
    io.write(json.dumps(bob).encode()+b'\n')
    ciphertext=parse(io.readline(),'Intercepted from Alice: ')
    print(decrypt(1,ciphertext))
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 새 서버 세션에 접속해 아래 결과를 얻었다. 서버의 암호문을 공유 비밀 1에서 파생한 키로 복호화하여 플래그 형식을 확인했다.

```text
crypto{n1c3_0n3_m4ll0ry!!!!!!!!}
```

## 최종 플래그

`crypto{n1c3_0n3_m4ll0ry!!!!!!!!}`
