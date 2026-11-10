---
{"title":"Mixed Up","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"shuffle 함수는 mixed_and의 각 바이트를 mixed_xor의 인덱스로 사용한다. 모든 입력 바이트를 0으로 두면 결과는 난수 한 바이트가 39번 반복된 값이다. 특정 위치 j에 한 비트 마스크만 설정하면 flag[j] & mas…","section":["CryptoHack","Hash Functions"]}
---

- 원문: https://cryptohack.org/challenges/hashes/#mixed_up
- 검증: 공식 소켓 서비스가 아래 플래그 반환

## 풀이 원리

`shuffle` 함수는 `mixed_and`의 각 바이트를 `mixed_xor`의 인덱스로 사용한다. 모든 입력 바이트를 0으로 두면 결과는 난수 한 바이트가 39번 반복된 값이다. 특정 위치 j에 한 비트 마스크만 설정하면 `flag[j] & mask`가 0일 때만 여전히 같은 바이트의 반복이 된다. 가능한 256개 반복 문자열의 SHA256을 미리 계산하고, 각 위치의 8비트를 선택 입력으로 검사한다. 난수 우연 일치를 줄이려고 각 양성 결과를 두 번 확인한다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. `mixed_up`은 약 수백 번의 해시 질의를 하므로 실행에 수분 걸릴 수 있다.

```python
import socket,json,hashlib,re,time
L=len(b'crypto{???????????????????????????????}')
assert L==39
repeated={hashlib.sha256(bytes([v])*L).hexdigest() for v in range(256)}
with socket.create_connection(('socket.cryptohack.org',13402),timeout=10) as s:
 io=s.makefile('rwb',buffering=0);io.readline()
 def oracle(j,mask):
  data=bytearray(L);data[j]=mask
  io.write(json.dumps({'option':'mix','data':data.hex()}).encode()+b'\n')
  q=json.loads(io.readline())
  return q['mixed'] in repeated
 out=[]
 for j in range(L):
  byte=0
  for bit in range(8):
   if not (oracle(j,1<<bit) and oracle(j,1<<bit)): byte|=1<<bit
  out.append(byte)
 flag=bytes(out).decode()
 assert flag.startswith('crypto{') and flag.endswith('}')
 print(flag)

```

## 검증 방법

코드가 공식 서비스의 응답에서 아래 플래그를 출력하는지 확인한다.

```text
crypto{y0u_c4n7_m1x_3v3ry7h1n6_1n_l1f3}
```

## 최종 플래그

`crypto{y0u_c4n7_m1x_3v3ry7h1n6_1n_l1f3}`
