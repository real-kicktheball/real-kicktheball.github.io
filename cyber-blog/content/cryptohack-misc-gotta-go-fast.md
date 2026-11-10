---
{"title":"Gotta Go Fast","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"키를 현재 시각에서 만들면 시간 범위만 알면 키 공간이 수십 개로 줄어든다.","section":["CryptoHack","Misc"]}
---

## 개념

암호 키는 **예측 불가능한** 값에서 만들어야 한다. 현재 시각(Unix timestamp)은 공격자도 대략 알고 있는 값이다. 그래서 해시를 거쳐도 엔트로피가 늘지 않는다.

$$
K = \text{SHA256}(\text{timestamp})
$$

요청 시각 앞뒤 몇십 초만 시도하면 키를 찾는다. 키는 `secrets`, `os.urandom` 같은 암호학적 난수 생성기에서 뽑아야 한다.

## 문제

서버가 플래그를 OTP로 암호화해주는데, 키가 암호화 시점의 Unix 초를 SHA-256한 값이다.

## 풀이

1. 요청 직전과 직후의 시각을 기록한다.
2. 그 주변 ±30초를 모두 시도한다.
3. 복호화 결과가 `crypto{`로 시작하고 `}`로 끝나는 시각이 맞는 키다.

## 풀이 코드
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

## 플래그
```text
crypto{t00_f4st_t00_furi0u5}
```
