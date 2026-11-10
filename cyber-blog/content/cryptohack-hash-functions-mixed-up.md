---
{"title":"Mixed Up","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"비밀 플래그와 내 입력을 AND/XOR로 섞어 해시해주는 오라클에서, 한 비트씩 마스크를 바꿔 출력 패턴으로 플래그 비트를 알아낸다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

해시값 자체에서 입력을 거꾸로 구할 수는 없다. 하지만 오라클이 내 입력에 따라 **해시 전 값의 구조**를 바꾼다면 이야기가 다르다. 해시값이 "알려진 후보 집합"에 들어가는지로 1비트씩 정보를 얻을 수 있다.

이런 공격에서 중요한 건 한 번에 1비트만 바뀌도록 입력을 설계하는 것이다.

## 문제

서버의 `mix`는 다음을 한다.

1. `flag & data`(mixed_and)와 `flag ^ data`(mixed_xor)를 만든다.
2. mixed_and의 각 바이트를 인덱스로 mixed_xor에서 값을 뽑아 섞는다.
3. 그 결과를 SHA-256해서 돌려준다.

## 풀이

1. 입력을 모두 0으로 두면 `flag & 0 = 0`이라 모든 인덱스가 0이다. 결과는 같은 바이트 하나가 39번 반복된다.
2. 이런 반복 문자열은 256가지뿐이다. 그래서 SHA-256 값을 미리 계산해 집합으로 만들어둔다.
3. 위치 $j$에 마스크 $2^k$ 하나만 넣는다.
   - `flag[j]`의 $k$번 비트가 0이면 AND 결과가 그대로 0이라 여전히 반복 문자열이 나온다(집합 안).
   - 비트가 1이면 인덱스가 바뀌어서 집합 밖의 값이 나온다.
4. 모든 위치·비트에 대해 반복한다. 우연히 일치하는 경우를 줄이려고 같은 질의를 두 번씩 했다.

## 풀이 코드
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

## 플래그
`crypto{y0u_c4n7_m1x_3v3ry7h1n6_1n_l1f3}`
