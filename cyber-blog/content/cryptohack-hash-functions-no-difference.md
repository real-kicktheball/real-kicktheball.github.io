---
{"title":"No Difference","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"첫 블록을 섞는 permute는 8×8 비트 전치이며 그 다음 S-box를 적용한다. 초기 상태에서 입력 4바이트만 바꿔 전치 결과의 첫 바이트를 각각 0x50, 0x80으로 만들 수 있다. S-box는 두 인덱스를 모두 0x9b로 치환한다…","section":["CryptoHack","Hash Functions"]}
---

- 원문: https://cryptohack.org/challenges/hashes/#no_difference
- 첨부 파일: https://cryptohack.org/static/challenges/13395_5ed60003866ba89ca3db17fbd446b841.py
- 검증: 공식 소켓 서비스가 아래 플래그를 반환; CryptoHack 채점 Success!

## 풀이 원리

첫 블록을 섞는 `permute`는 8×8 비트 전치이며 그 다음 S-box를 적용한다. 초기 상태에서 입력 4바이트만 바꿔 전치 결과의 첫 바이트를 각각 `0x50`, `0x80`으로 만들 수 있다. S-box는 두 인덱스를 모두 `0x9b`로 치환한다. 첫 라운드 출력이 같아지므로 그 뒤 모든 라운드와 최종 해시도 같다.

## 최종 익스플로잇

Python 3에서 실행한다. `merkletrees`는 `requests`가 필요하다.

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

## 검증 방법

스크립트를 실행하여 아래 출력이 나오는지 확인한다. `stuffing`은 역변환한 블록의 scramble 결과가 0임을 `assert`한다. `no_difference`는 공식 서비스의 충돌 판정을 확인한다.

```text
crypto{n0_d1ff_n0_pr0bl3m}
```

## 최종 플래그

`crypto{n0_d1ff_n0_pr0bl3m}`
