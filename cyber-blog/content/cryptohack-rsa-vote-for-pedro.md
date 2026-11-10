---
{"title":"Vote for Pedro","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"e=3이고 서버가 마지막 0x00 뒤만 읽으면 끝부분만 맞는 세제곱근을 만들면 된다. 2^k 법에서 비트 단위로 세제곱근을 쌓는다.","section":["CryptoHack","RSA"]}
---

## 개념

$e = 3$인 서명 검증에서 서버가 $S^3$의 **끝부분만** 본다고 하자. 그러면 $S^3$ 전체가 아니라 하위 비트만 맞추면 된다.

하위 $k$비트만 맞추는 건 $\bmod 2^k$에서의 문제다.

$$
S^3 \equiv T \pmod{2^k}
$$

$T$가 홀수이면 이 세제곱근은 비트 단위로 쌓아 올릴 수 있다(Hensel lifting).

1. $\bmod 2$에서 시작한다.
2. $\bmod 2^{i+1}$에서 식이 성립하지 않으면 $i$번째 비트를 켠다.
3. 이걸 $k$비트까지 반복한다.

## 문제

서버는 $S^3 \bmod N$을 바이트로 바꾼 뒤 마지막 `\x00` 다음 부분이 `VOTE FOR PEDRO`이면 통과시킨다.

## 풀이

1. 목표 $T$ = `\x00VOTE FOR PEDRO`(15바이트, 120비트)를 정수로 둔다. 끝 글자 `O`가 홀수라 근이 존재한다.
2. 위 방법으로 $S^3 \equiv T \pmod{2^{120}}$인 $S$를 비트 단위로 만든다.
3. $S$는 120비트 이하라서 $S^3$도 $N$보다 작다. 그래서 $\bmod N$이 영향을 주지 않는다.
4. $S$를 투표로 보내면 플래그가 나온다.

## 풀이 코드
```python
import json, socket
payload=b'\x00VOTE FOR PEDRO'
bits=8*len(payload)
target=int.from_bytes(payload,'big')
root=1
for i in range(1,bits):
    if (pow(root,3,1<<(i+1))-target)%(1<<(i+1)):
        root+=1<<i
assert pow(root,3,1<<bits)==target
with socket.create_connection(('socket.cryptohack.org',13375),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    io.readline()
    io.write(json.dumps({'option':'vote','vote':hex(root)}).encode()+b'\n')
    print(json.loads(io.readline())['flag'])
```

## 플래그
`crypto{y0ur_v0t3_i5_my_v0t3}`
