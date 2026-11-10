---
{"title":"Hash Stuffing","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"해시가 각 메시지 블록을 독립적으로 scramble한 뒤 상태와 XOR한다. 32바이트 배수 길이에는 패딩이 추가되지 않는다. 따라서 빈 메시지와 scramble(block)=0인 단일 블록은 같은 해시를 만든다. scramble은 회전과 …","section":["CryptoHack","Hash Functions"]}
---

## 풀이 원리

해시가 각 메시지 블록을 독립적으로 `scramble`한 뒤 상태와 XOR한다. 32바이트 배수 길이에는 패딩이 추가되지 않는다. 따라서 빈 메시지와 `scramble(block)=0`인 단일 블록은 같은 해시를 만든다. `scramble`은 회전과 XOR만 사용하므로 역순으로 40라운드를 되돌려 0의 원상을 얻는다.

## 최종 익스플로잇

Python 3에서 실행한다. `merkletrees`는 `requests`가 필요하다.

```python
import socket, json, re
W = bytes.fromhex('6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296')
X = bytes.fromhex('4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5')
def xor(a, b): return bytes(x^y for x,y in zip(a,b))
def left(b, n): return b[n:]+b[:n]
def right(b, n): return b[-n:]+b[:-n]
def scramble(block):
    for _ in range(40):
        block = right(xor(left(xor(W,block),6),X),17)
    return block
block = bytes(32)
for _ in range(40):
    block = xor(right(xor(left(block,17),X),6),W)
assert block != bytes(32)
assert scramble(block) == bytes(32)
with socket.create_connection(('socket.cryptohack.org',13405),timeout=10) as sock:
    sock.settimeout(10)
    sock.recv(4096)
    sock.sendall(json.dumps({'m1':'','m2':block.hex()}).encode()+b'\n')
    reply = sock.recv(4096).decode()
print(re.search(r'crypto\{[^}]+\}',reply).group(0))
```

## 검증 방법

스크립트를 실행하여 아래 출력이 나오는지 확인한다. `stuffing`은 역변환한 블록의 scramble 결과가 0임을 `assert`한다. `no_difference`는 공식 서비스의 충돌 판정을 확인한다.

```text
crypto{Always_add_padding_even_if_its_a_whole_block!!!}
```

## 최종 플래그

`crypto{Always_add_padding_even_if_its_a_whole_block!!!}`
