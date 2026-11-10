---
{"title":"Let's Decrypt","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"검증자가 서명자가 보낸 공개키(N, e)를 그대로 믿으면, 이미 있는 서명이 원하는 메시지로 검증되도록 키를 만들어낼 수 있다.","section":["CryptoHack","RSA"]}
---

## 개념

서명을 확인할 때는 공개키 $(N, e)$로 $S^e \bmod N$을 계산한다. 그런데 이 서버는 **공개키를 우리가 정하게** 해준다. 그러면 아무 서명이나 원하는 메시지로 통과하게 만들 수 있다.

### 비법: $e = 1$, $N = S - D$

$e = 1$이면 확인 식이 $S \bmod N$이 된다. 원하는 결과를 $D$라 하면 $N = S - D$로 정한다.

$$
S = 1 \times (S - D) + D \quad\Rightarrow\quad S \bmod (S - D) = D
$$

### 직접 해보기

서명 $S = 100$이 있고, 원하는 결과가 $D = 37$이라 하자.

- $N = 100 - 37 = 63$
- $100 \bmod 63 = 37$ ✔

원하는 대로 나왔다.

### 교훈

서명을 확인할 때는 **정해진 진짜 공개키**로만 확인해야 한다. "이 서명은 이 공개키로 확인하세요"라는 말을 믿으면 안 된다.

### 정리

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
