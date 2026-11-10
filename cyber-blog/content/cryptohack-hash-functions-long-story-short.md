---
{"title":"Long Story Short","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"HMAC-SHA256은 블록 크기 64바이트보다 긴 키를 먼저 SHA256으로 줄인다. 공개한 SHA256(passphrase) 지문은 원래 128바이트 구절의 PBKDF2-HMAC-SHA256과 동일한 HMAC 키가 된다. 지문 32바이트…","section":["CryptoHack","Hash Functions"]}
---

## 풀이 원리

HMAC-SHA256은 블록 크기 64바이트보다 긴 키를 먼저 SHA256으로 줄인다. 공개한 `SHA256(passphrase)` 지문은 원래 128바이트 구절의 PBKDF2-HMAC-SHA256과 동일한 HMAC 키가 된다. 지문 32바이트를 `passphrase_hex`로 보내면 동일 AES 키가 유도되어 금고가 열린다.

## 최종 익스플로잇

```python
import socket, json, re
with socket.create_connection(('socket.cryptohack.org',13434),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    info=json.loads(io.readline())
    # 128-byte passphrase를 HMAC-SHA256 키로 쓸 때 SHA256(passphrase)로 축약된다.
    prehash=info['passphrase_fingerprint']
    assert len(bytes.fromhex(prehash)) == 32
    io.write(json.dumps({'passphrase_hex':prehash}).encode()+b'\n')
    reply=json.loads(io.readline())
    print(re.search(r'crypto\{[^}]+\}',reply['msg']).group(0))
```

## 최종 플래그

`crypto{hm4c_47e_my_l0n6_k3y}`
