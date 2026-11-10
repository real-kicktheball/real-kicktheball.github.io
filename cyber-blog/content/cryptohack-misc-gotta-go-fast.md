---
{"title":"Gotta Go Fast","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"OTP 키가 암호화 시점의 Unix 초를 큰 바이트 순서로 인코딩한 뒤 SHA-256을 취해 만들어진다. 플래그를 요청하기 직전·직후 시간을 기록하고 근처 초를 전수 조사한다. 복호화한 바이트가 crypto{로 시작하고 }로 끝나는 값을 채…","section":["CryptoHack","Misc"]}
---

## 풀이 방법

OTP 키가 암호화 시점의 Unix 초를 큰 바이트 순서로 인코딩한 뒤 SHA-256을 취해 만들어진다. 플래그를 요청하기 직전·직후 시간을 기록하고 근처 초를 전수 조사한다. 복호화한 바이트가 `crypto{`로 시작하고 `}`로 끝나는 값을 채택한다.

## 최종 익스플로잇

```python
import socket, json, time, hashlib

with socket.create_connection(("socket.cryptohack.org",13372),timeout=10) as sock:
    stream=sock.makefile('rwb')
    stream.readline()
    before=int(time.time())
    stream.write(b'{"option":"get_flag"}\n');stream.flush()
    ct=bytes.fromhex(json.loads(stream.readline())['encrypted_flag'])
    after=int(time.time())

for sec in range(before-30,after+31):
    timestamp=sec.to_bytes((sec.bit_length()+7)//8,'big')
    key=hashlib.sha256(timestamp).digest()
    pt=bytes(c^k for c,k in zip(ct,key))
    if pt.startswith(b'crypto{') and pt.endswith(b'}'):
        print(pt.decode())
        break
```

## 최종 플래그

```text
crypto{t00_f4st_t00_furi0u5}
```
