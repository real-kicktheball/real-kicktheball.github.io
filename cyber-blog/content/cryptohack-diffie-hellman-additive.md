---
{"title":"Additive","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"DH를 곱셈군이 아니라 덧셈군에서 하면 이산로그가 나눗셈 한 번으로 풀린다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 개념

Diffie-Hellman이 안전한 이유는 "**곱하기를 여러 번** 한 결과에서 횟수를 찾기 어렵다"는 데 있다. 그런데 곱하기 대신 **더하기**로 하면 어떻게 될까?

| 방식 | 공개값 | 비밀 찾기 |
|---|---|---|
| 곱하기(원래) | $A = g \times g \times \cdots = g^a$ | 매우 어렵다(이산로그) |
| 더하기(이 문제) | $A = g + g + \cdots = a \times g$ | 나누기 한 번 |

### 직접 해보기 ($p = 23$, $g = 5$, 비밀 $a = 6$)

더하기 방식으로 공개값을 만들면 다음과 같다.

$$
A = 6 \times 5 \bmod 23 = 30 \bmod 23 = 7
$$

$a$를 찾으려면 7을 5로 나누면 된다. 나머지 세계에서 5의 역원은 14다($5 \times 14 = 70 = 3 \times 23 + 1$).

$$
a = 7 \times 14 \bmod 23 = 98 \bmod 23 = 6
$$

비밀이 바로 나왔다. 그래서 **어떤 연산 위에서 하느냐**가 중요하다. 타원곡선 암호는 "점 더하기"를 쓰지만, 그건 일반 더하기와 달리 되돌리기 어렵다.

### 정리

DH가 안전한 이유는 $g^a$에서 $a$를 구하기 어렵기 때문이다. 이건 **곱셈군**에서의 이야기다.

같은 구조를 **덧셈군**($\mathbb{Z}_p$, 연산 $+$)에서 하면 "$g$를 $a$번 더하기"가 된다.

$$
A = a \cdot g \bmod p
$$

이건 곱셈이라 역원 한 번이면 $a$가 나온다.

$$
a = A \cdot g^{-1} \bmod p
$$

어떤 군을 쓰느냐에 따라 이산로그 난이도가 완전히 달라진다는 걸 보여준다. 타원곡선 DH가 곱셈군 대신 타원곡선 점의 덧셈군을 쓰는 것도 같은 맥락이다. 그쪽은 덧셈이어도 로그가 어렵다.

## 문제

Alice와 Bob이 덧셈군에서 DH를 한다. 공개값과 암호문을 도청할 수 있다.

## 풀이

1. $a = A \cdot g^{-1} \bmod p$로 Alice의 비밀을 구한다.
2. 공유 비밀 $a \cdot B \bmod p$를 계산한다($= A \cdot B \cdot g^{-1}$).
3. 키를 만들어 복호화한다.

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

with socket.create_connection(('socket.cryptohack.org',13380),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    alice=parse(io.readline(),'Intercepted from Alice: ')
    bob=parse(io.readline(),'Intercepted from Bob: ')
    ciphertext=parse(io.readline(),'Intercepted from Alice: ')
    p,g,A,B=(int(alice['p'],16),int(alice['g'],16),int(alice['A'],16),int(bob['B'],16))
    a=A*pow(g,-1,p)%p
    shared=B*a%p
    assert shared==A*B*pow(g,-1,p)%p
    print(decrypt(shared,ciphertext))
```

## 플래그
`crypto{cycl1c_6r0up_und3r_4dd1710n?}`
