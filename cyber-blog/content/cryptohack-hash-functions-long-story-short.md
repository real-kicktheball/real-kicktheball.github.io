---
{"title":"Long Story Short","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"HMAC은 블록 크기(64바이트)보다 긴 키를 먼저 해시해서 쓴다. 그래서 긴 키 K와 H(K)가 같은 HMAC 키가 된다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

**HMAC**은 비밀키와 해시로 "이 메시지는 진짜다"라는 확인 도장을 만드는 표준 방법이다. 그런데 HMAC에는 이런 규칙이 있다.

> 비밀키가 64바이트보다 길면, 먼저 그 키를 해시해서 32바이트로 줄인 다음 쓴다.

### 그래서 생기는 일

긴 비밀키 $K$(예: 128바이트)와 그 해시값 $H(K)$(32바이트)는 HMAC에서 **똑같은 키로 동작**한다.

$$
\text{HMAC}(K, m) = \text{HMAC}(H(K), m) \qquad (|K| > 64)
$$

### 비유

집 열쇠가 너무 길어서 문에 안 들어가면, 관리인이 그 열쇠의 "복사본(짧은 열쇠)"을 만들어서 쓴다고 하자. 그러면 **짧은 복사본만 있으면** 문이 열린다.

### 이 문제에서

금고는 128바이트 비밀 문구로 열쇠를 만든다. 그런데 서버가 "이건 문구의 지문이야"라며 $H(\text{문구})$를 공개해버렸다. 그 지문을 문구 자리에 그대로 넣으면 같은 열쇠가 만들어져서 금고가 열린다.

### 정리

**HMAC**은 해시로 MAC을 만드는 표준 방법이다.

$$
\text{HMAC}(K, m) = H\big((K' \oplus \text{opad}) \,\|\, H((K' \oplus \text{ipad}) \,\|\, m)\big)
$$

키 $K'$는 다음처럼 만든다.

- $K$가 블록 크기(SHA-256은 64바이트)보다 길면 $K' = H(K)$
- 짧으면 0으로 채운 $K$

그래서 64바이트보다 긴 키 $K$와 32바이트 값 $H(K)$는 **같은 HMAC 키**로 동작한다. 대부분의 상황에서는 문제가 없지만, $H(K)$를 공개하는 시스템에서는 문제가 된다.

PBKDF2-HMAC-SHA256도 내부에서 비밀번호를 HMAC 키로 쓰므로 같은 성질을 가진다.

## 문제

금고가 128바이트 비밀 문구로 PBKDF2-HMAC-SHA256 키를 만든다. 서버는 문구의 "지문"이라며 `SHA256(passphrase)`를 공개한다.

## 풀이

1. 128바이트 문구는 64바이트보다 길어서 HMAC 키로 쓸 때 `SHA256(passphrase)`로 바뀐다.
2. 공개된 지문 32바이트를 그대로 `passphrase_hex`로 보낸다.
3. 같은 PBKDF2 키가 나와서 금고가 열린다.

## 풀이 코드
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

## 플래그
`crypto{hm4c_47e_my_l0n6_k3y}`
