---
{"title":"MD0","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"Merkle–Damgård 구조에서 H(key || m)을 MAC으로 쓰면, 해시값을 내부 상태로 이어 계산하는 길이 확장 공격이 된다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

MD5, SHA-1, SHA-256은 **Merkle–Damgård 구조**다. 메시지를 블록으로 나누고 압축 함수 $f$로 상태를 이어간다.

$$
h_0 = IV, \quad h_i = f(h_{i-1}, m_i), \quad H(m) = h_n
$$

최종 해시값이 곧 마지막 내부 상태다. 그래서 $H(\text{key} \| m)$만 알아도 $\text{key}$를 모른 채 블록을 더 붙여 계산을 이어갈 수 있다.

$$
H(\text{key} \,\|\, m \,\|\, \text{pad} \,\|\, m') = f(H(\text{key} \| m), m')
$$

이게 **길이 확장 공격**이다. 그래서 MAC은 $H(\text{key}\|m)$이 아니라 HMAC으로 만들어야 한다.

## 문제

서버의 해시는 AES를 압축 함수로 쓰는 MD 구조다($f(s, b) = E_b(s) \oplus s$). 서명은 $H(\text{key} \| m)$이다. `admin=True`를 포함한 메시지에 유효한 서명을 보내면 플래그를 준다.

## 풀이

1. 빈 메시지의 서명 $H(\text{key} \| \text{pad})$를 받는다. 이게 내부 상태다.
2. 그 상태에서 `pad(admin=True)` 블록으로 압축 함수를 한 번 더 돌려 새 서명을 만든다.
3. 서버에 보낼 메시지는 `원래 패딩 블록(0x10 × 16) || admin=True`이다. 서버가 계산하는 해시와 내가 만든 서명이 일치한다.

## 풀이 코드
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

## 플래그
`crypto{l3ngth_3xT3nd3r}`
