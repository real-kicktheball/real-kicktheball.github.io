---
{"title":"Hash Stuffing","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"메시지 길이가 블록 배수일 때 패딩을 안 붙이면 빈 메시지와 특정 한 블록 메시지가 같은 해시가 될 수 있다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

해시는 데이터를 블록 단위로 먹는다. 마지막 블록이 꽉 차지 않으면 **패딩**(채우기 값)을 붙여서 블록 크기를 맞춘다.

### 직접 해보기 (블록 크기 4글자)

| 메시지 | 패딩 후 |
|---|---|
| `ab` | `ab22` (2칸 비어서 "2"를 2개) |
| `abc` | `abc1` |
| `abcd` | `abcd` + `4444` (꽉 차도 블록 하나를 더 붙임) |

### 왜 꽉 차도 패딩을 붙일까?

이 문제의 해시는 **꽉 차면 패딩을 안 붙인다**. 그러면 이런 일이 생긴다.

- 빈 메시지: 아무 블록도 안 먹는다. 해시는 시작값 그대로다.
- 특별한 블록 X 하나: X를 먹었는데 그 결과가 마침 "아무 변화 없음"이 되게 X를 고른다.

두 메시지는 내용이 다른데 해시가 같다. 패딩을 항상 붙이면 "빈 메시지"와 "X"가 다르게 처리돼서 이런 일이 없다. 플래그도 "블록이 꽉 차도 패딩을 붙여라"다.

### 정리

해시 함수는 마지막 블록을 채우려고 **패딩**을 붙인다. 패딩에는 보통 메시지 길이가 들어간다(MD-strengthening). 그래야 길이가 다른 메시지가 같은 블록열로 처리되지 않는다.

길이가 이미 블록 배수일 때 패딩을 생략하면 어떻게 될까. "빈 메시지 + 패딩 블록"과 "그 패딩 블록과 같은 값으로 처리되는 메시지"를 구분할 수 없게 된다. 표준 해시가 길이가 맞아도 항상 패딩 블록을 하나 더 붙이는 이유다.

## 문제

32바이트 블록 단위 해시 `cryptohash`가 있다.

- 각 블록을 `scramble`(40라운드의 회전·XOR)한 뒤 상태에 XOR한다.
- 길이가 32의 배수면 패딩이 없다.

해시가 같은 서로 다른 메시지 두 개를 보내면 플래그를 준다.

## 풀이

1. 빈 메시지는 상태가 그대로라 해시가 초기값이다.
2. `scramble(block) = 0`인 한 블록 메시지도 상태를 0과 XOR하니 해시가 같다.
3. `scramble`은 회전과 XOR뿐이라 역함수가 있다. 0에서 역연산을 40번 적용해 그 블록을 구한다.
4. 빈 메시지와 그 블록을 보내면 플래그를 받는다.

## 풀이 코드
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

## 플래그
`crypto{Always_add_padding_even_if_its_a_whole_block!!!}`
