---
{"title":"Static Client","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"비밀지수 b를 재사용하는 서버에 g 대신 A를 보내면 서버가 공유 비밀 A^b를 직접 계산해준다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 개념

**임시(ephemeral) DH**는 세션마다 새 비밀을 뽑는다. **정적(static) DH**는 같은 비밀을 계속 쓴다.

정적 비밀을 쓰는 서버가 상대가 보낸 $g$를 그대로 믿는다고 하자. 그러면 서버를 계산기로 쓸 수 있다. 서버에게 생성원으로 $g' = A$를 주면 서버의 새 공개값이 이렇게 된다.

$$
B' = (g')^b = A^b = g^{ab}
$$

이건 원래 세션의 공유 비밀이다. 그래서 TLS 1.3은 정적 DH를 없애고 임시 키만 쓴다.

## 문제

Alice와 Bob의 원래 세션($p$, $g$, $A$, $B$, 암호문)을 도청했다. 그 뒤 Bob에게 직접 새 파라미터를 보낼 수 있다. Bob은 같은 $b$를 재사용한다.

## 풀이

1. 원래 세션의 $p$, $A$를 기록한다.
2. Bob에게 $g = A$로 새 세션을 요청한다.
3. Bob이 돌려준 공개값이 $A^b$, 즉 원래 공유 비밀이다.
4. 그 값으로 Alice의 암호문을 복호화한다.

## 풀이 코드
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

## 플래그
`crypto{n07_3ph3m3r4l_3n0u6h}`
