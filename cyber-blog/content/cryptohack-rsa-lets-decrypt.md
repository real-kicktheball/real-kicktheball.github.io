---
{"title":"Let's Decrypt","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"검증자가 서명자가 보낸 공개키(N, e)를 그대로 믿으면, 이미 있는 서명이 원하는 메시지로 검증되도록 키를 만들어낼 수 있다.","section":["CryptoHack","RSA"]}
---

## 개념

서명 검증은 $S^e \bmod N = \text{pad}(H(m))$을 확인하는 것이다. 그런데 $N$과 $e$를 **공격자가 정할 수 있으면** 이야기가 달라진다. 기존 서명 $S$가 아무 메시지에 대해 맞도록 키를 만들 수 있다.

$e = 1$로 두면 검증식은 다음과 같다.

$$
S \bmod N = D \qquad (D = \text{pad}(H(m')))
$$

$N = S - D$로 잡으면 $S = 1 \cdot N + D$이므로 이 식이 바로 성립한다(단 $S > D$).

이를 **Duplicate Signature Key Selection**이라 한다. 검증할 때 공개키가 진짜 서명자의 것인지 확인하지 않으면 생기는 문제다.

## 문제

서버는 원래 메시지의 서명 $S$를 준다. 그다음 `I am Mallory, I own CryptoHack.org`에 대한 서명 검증을 우리가 보낸 $N$, $e$로 해준다.

## 풀이

1. 목표 메시지의 PKCS#1 v1.5 인코딩 $D$를 직접 만든다. 형식은 `00 01 FF...FF 00 || DigestInfo(SHA-1) || hash`이다.
2. $N = S - D$, $e = 1$을 보낸다.
3. 서버가 $S \bmod N = D$로 검증에 성공하고 플래그를 준다.

## 풀이 코드
```python
import hashlib, json, re, socket
msg='I am Mallory, I own CryptoHack.org'
with socket.create_connection(('socket.cryptohack.org',13391),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    io.readline()
    def ask(payload):
        io.write(json.dumps(payload).encode()+b'\n')
        return json.loads(io.readline())
    sig=int(ask({'option':'get_signature'})['signature'],16)
    digest_info=bytes.fromhex('3021300906052b0e03021a05000414')+hashlib.sha1(msg.encode()).digest()
    encoded=b'\x00\x01'+b'\xff'*(256-len(digest_info)-3)+b'\x00'+digest_info
    D=int.from_bytes(encoded,'big')
    assert sig>D
    N=sig-D
    assert pow(sig,1,N)==D
    result=ask({'option':'verify','msg':msg,'N':hex(N),'e':'0x1'})['msg']
    print(re.search(r'crypto\{[^}]+\}',result).group())
```

## 플래그
`crypto{dupl1c4t3_s1gn4tur3_k3y_s3l3ct10n}`
