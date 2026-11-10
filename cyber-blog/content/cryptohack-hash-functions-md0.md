---
{"title":"MD0","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"서버는 비밀키를 앞에 붙인 뒤 자체 해시를 계산한다. 서명을 받은 key data에는 PKCS#7 패딩이 적용된다. 서명을 해시의 내부 상태로 이용해 admin=True를 추가 압축하고, 실제 제출 메시지에는 앞선 패딩 블록 0x10 16을…","section":["CryptoHack","Hash Functions"]}
---

## 풀이 원리

서버는 비밀키를 앞에 붙인 뒤 자체 해시를 계산한다. 서명을 받은 `key || data`에는 PKCS#7 패딩이 적용된다. 서명을 해시의 내부 상태로 이용해 `admin=True`를 추가 압축하고, 실제 제출 메시지에는 앞선 패딩 블록 `0x10 * 16`을 삽입한다. 즉 `H(key || pad(key) || admin=True)`를 서버가 직접 검증하게 만든다.

## 최종 익스플로잇

Python 3에서 실행한다. `collider`는 `requests`, `md0`는 `pycryptodome`이 필요하다.

```python
import json, socket
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

def compress(state, block):
    encrypted = AES.new(block, AES.MODE_ECB).encrypt(state)
    return bytes(x^y for x,y in zip(encrypted,state))

with socket.create_connection(('socket.cryptohack.org',13388),timeout=10) as sock:
    io = sock.makefile('rwb',buffering=0)
    io.readline()
    io.write(json.dumps({'option':'sign','message':''}).encode()+b'\n')
    signature = bytes.fromhex(json.loads(io.readline())['signature'])
    extra = b'admin=True'
    state = signature
    padded = pad(extra,16)
    for pos in range(0,len(padded),16):
        state = compress(state,padded[pos:pos+16])
    forged = bytes([16])*16 + extra
    io.write(json.dumps({'option':'get_flag','message':forged.hex(),'signature':state.hex()}).encode()+b'\n')
    response = json.loads(io.readline())
print(response['flag'])
```

## 검증 방법

코드를 실행해 플래그가 출력되는지 확인한다. `collider`는 두 문서가 다른데도 MD5가 동일함을 `assert`하고, `md0`는 공식 서비스의 `get_flag` 응답을 확인한다.

```text
crypto{l3ngth_3xT3nd3r}
```

## 최종 플래그

`crypto{l3ngth_3xT3nd3r}`
