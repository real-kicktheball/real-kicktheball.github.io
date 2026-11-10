---
{"title":"Export-grade","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"지원 알고리즘을 DH64 하나로 바꾸어 협상을 낮춘다. 64비트 법의 이산로그는 SymPy로 계산할 수 있으므로 Alice의 비밀지수를 구해 Bob 공개값으로 공유 비밀을 복원한다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

지원 알고리즘을 DH64 하나로 바꾸어 협상을 낮춘다. 64비트 법의 이산로그는 SymPy로 계산할 수 있으므로 Alice의 비밀지수를 구해 Bob 공개값으로 공유 비밀을 복원한다.

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

from sympy.ntheory import discrete_log
with socket.create_connection(('socket.cryptohack.org',13379),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    parse(io.readline(),'Intercepted from Alice: ')
    io.write(json.dumps({'supported':['DH64']}).encode()+b'\n')
    choice=parse(io.readline(),'Intercepted from Bob: ')
    assert choice['chosen']=='DH64'
    io.write(json.dumps(choice).encode()+b'\n')
    alice=parse(io.readline(),'Intercepted from Alice: ')
    bob=parse(io.readline(),'Intercepted from Bob: ')
    ciphertext=parse(io.readline(),'Intercepted from Alice: ')
    p,g,A,B=(int(alice['p'],16),int(alice['g'],16),int(alice['A'],16),int(bob['B'],16))
    a=int(discrete_log(p,A,g))
    assert pow(g,a,p)==A
    print(decrypt(pow(B,a,p),ciphertext))
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 새 서버 세션에 접속해 아래 결과를 얻었다. 구한 이산로그 a를 다시 거듭제곱해 Alice 공개값과 일치하는지 확인하고 CBC 암호문을 복호화했다.

```text
crypto{d0wn6r4d35_4r3_d4n63r0u5}
```

## 최종 플래그

`crypto{d0wn6r4d35_4r3_d4n63r0u5}`
