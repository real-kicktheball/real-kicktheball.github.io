---
{"title":"Parameter Injection","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"DH는 인증이 없어서 중간자가 공개값을 바꿔치기하면 공유 비밀을 마음대로 정할 수 있다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 개념

기본 DH는 **상대방이 누구인지 인증하지 않는다**. 그래서 중간자(MITM) 공격에 약하다. 중간에서 공개값을 바꿔치기하면 양쪽의 공유 비밀을 공격자가 정할 수 있다.

예를 들어 $A$와 $B$를 모두 1로 바꾸면 다음과 같다.

$$
1^b = 1, \qquad 1^a = 1
$$

양쪽 모두 공유 비밀이 1이 된다. 실제 프로토콜에서는 서명이나 인증서로 공개값을 인증해서 이걸 막는다. 또 받은 값이 $1$, $p-1$ 같은 이상한 값인지 검사한다.

## 문제

Alice와 Bob 사이에서 오가는 메시지를 가로채고 수정할 수 있다. Alice가 Bob에게 플래그를 암호화해서 보낸다.

## 풀이

1. Alice의 $A$를 1로 바꿔 Bob에게 전달한다.
2. Bob의 $B$를 1로 바꿔 Alice에게 전달한다.
3. Alice가 쓰는 공유 비밀은 $1^a = 1$이다.
4. 공유 비밀 1로 키를 만들어 Alice가 보낸 암호문을 복호화한다.

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

## 플래그
`crypto{n1c3_0n3_m4ll0ry!!!!!!!!}`
