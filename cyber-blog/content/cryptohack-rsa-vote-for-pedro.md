---
{"title":"Vote for Pedro","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"서버는 공개지수 3으로 검증한 정수를 바이트로 바꾼 뒤, 마지막 NUL 바이트 뒤만 읽는다. \\x00VOTE FOR PEDRO를 끝부분에 갖는 세제곱수를 만들면 된다. 목표 값이 홀수이므로 2의 거듭제곱 법에서 세제곱근이 존재하며, 한 비트…","section":["CryptoHack","RSA"]}
---

## 풀이 원리

서버는 공개지수 3으로 검증한 정수를 바이트로 바꾼 뒤, 마지막 NUL 바이트 뒤만 읽는다. `\x00VOTE FOR PEDRO`를 끝부분에 갖는 세제곱수를 만들면 된다. 목표 값이 홀수이므로 2의 거듭제곱 법에서 세제곱근이 존재하며, 한 비트씩 Hensel 리프팅으로 구한다. 그 근 자체를 서명값으로 보낸다.

## 최종 익스플로잇

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

## 최종 플래그

`crypto{y0ur_v0t3_i5_my_v0t3}`
