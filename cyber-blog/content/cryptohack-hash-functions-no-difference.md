---
{"title":"No Difference","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"해시 내부의 S-box가 서로 다른 두 입력을 같은 출력으로 보내면, 그 차분이 첫 라운드에서 사라져 충돌이 된다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

**차분 분석**은 두 입력의 차이(차분)가 라운드를 지나면서 어떻게 퍼지는지 추적한다. 좋은 S-box는 **전단사**라서 서로 다른 입력은 반드시 다른 출력을 낸다. 그래서 차분이 사라지지 않는다.

S-box가 전단사가 아니면 서로 다른 두 입력이 같은 출력으로 갈 수 있다. 그러면 첫 라운드에서 차분이 0이 된다. 이후는 같은 상태로 계산되니 최종 해시도 같아진다.

## 문제

직접 만든 해시 함수가 있다. 내부적으로 8×8 비트 전치(`permute`)와 S-box를 반복한다. 해시가 같은 서로 다른 두 메시지를 보내면 플래그를 준다.

## 풀이

1. S-box 표를 보면 인덱스 `0x50`과 `0x80`이 둘 다 `0x9b`로 간다. 전단사가 아니다.
2. 전치 결과의 첫 바이트가 각각 `0x50`, `0x80`이 되도록 입력 4바이트를 고른다. 전치는 자기 자신이 역연산이라 거꾸로 계산하면 된다.
3. `01000100`과 `00000001`은 첫 라운드 S-box 출력이 같다. 그래서 해시도 같다.

## 풀이 코드
```python
import socket, json, re
# 8x8 전치의 역원도 같은 전치다. 아래 두 메시지는 첫 라운드 S-box 입력만 0x50/0x80으로 다르다.
a = bytes.fromhex('01000100')
b = bytes.fromhex('00000001')
assert a != b and len(a)%4 == len(b)%4 == 0
with socket.create_connection(('socket.cryptohack.org',13395),timeout=10) as sock:
    sock.settimeout(10)
    sock.recv(4096)
    sock.sendall(json.dumps({'a':a.hex(),'b':b.hex()}).encode()+b'\n')
    reply = sock.recv(4096).decode()
print(re.search(r'crypto\{[^}]+\}',reply).group(0))
```

## 플래그
`crypto{n0_d1ff_n0_pr0bl3m}`
