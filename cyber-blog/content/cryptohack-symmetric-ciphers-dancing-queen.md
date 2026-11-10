---
{"title":"Dancing Queen","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"제공된 ChaCha20 변형은 20라운드 후 원래 상태를 더하는 feedforward를 생략했다. 알려진 평문과 암호문의 XOR로 64바이트 키스트림을 얻고, 역 quarter-round를 역순으로 적용해 초기 상태와 비밀키를 복원한다. 두…","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [Dancing Queen](https://cryptohack.org/challenges/aes/#dancing-queen)
- 검증: 서버에서 플래그 직접 획득; 플랫폼 제출 확인 전
- [chacha20.py](https://cryptohack.org/static/challenges/chacha20_c76e2a43164af8b6ecb0e145415ab931.py)
- [output.txt](https://cryptohack.org/static/challenges/output_108f5c189506fcb4309410776af3117d.txt)

## 풀이 원리

제공된 ChaCha20 변형은 20라운드 후 원래 상태를 더하는 feedforward를 생략했다. 알려진 평문과 암호문의 XOR로 64바이트 키스트림을 얻고, 역 quarter-round를 역순으로 적용해 초기 상태와 비밀키를 복원한다. 두 번째 IV로 플래그를 복호화한다.

## 최종 익스플로잇

```python
import struct,ast,requests
from pathlib import Path
mask=(1<<32)-1
def rol(x,n):return ((x<<n)|(x>>(32-n)))&mask
def ror(x,n):return ((x>>n)|(x<<(32-n)))&mask
def qr(x,a,b,c,d):
 x[a]=(x[a]+x[b])&mask;x[d]=rol(x[d]^x[a],16)
 x[c]=(x[c]+x[d])&mask;x[b]=rol(x[b]^x[c],12)
 x[a]=(x[a]+x[b])&mask;x[d]=rol(x[d]^x[a],8)
 x[c]=(x[c]+x[d])&mask;x[b]=rol(x[b]^x[c],7)
def invqr(x,a,b,c,d):
 x[b]=ror(x[b],7)^x[c];x[c]=(x[c]-x[d])&mask
 x[d]=ror(x[d],8)^x[a];x[a]=(x[a]-x[b])&mask
 x[b]=ror(x[b],12)^x[c];x[c]=(x[c]-x[d])&mask
 x[d]=ror(x[d],16)^x[a];x[a]=(x[a]-x[b])&mask
ops=[(0,4,8,12),(1,5,9,13),(2,6,10,14),(3,7,11,15),(0,5,10,15),(1,6,11,12),(2,7,8,13),(3,4,9,14)]
def block(state):
 x=state[:]
 for _ in range(10):
  for op in ops:qr(x,*op)
 return struct.pack('<16I',*x)
def recover(output):
 x=list(struct.unpack('<16I',output))
 for _ in range(10):
  for op in reversed(ops):invqr(x,*op)
 return x
s=requests.get('https://cryptohack.org/static/challenges/output_108f5c189506fcb4309410776af3117d.txt').text
v={}
for line in s.splitlines():
 a,b=line.split(' = ');v[a]=ast.literal_eval(b)
msg=b'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula.'
ct=bytes.fromhex(v['msg_enc']);ks=bytes(a^b for a,b in zip(msg[:64],ct[:64]))
state=recover(ks)
assert state[:4]==[0x61707865,0x3320646e,0x79622d32,0x6b206574]
assert state[12]==1
assert struct.pack('<3I',*state[13:16])==bytes.fromhex(v['iv1'])
key=struct.pack('<8I',*state[4:12]);print('key',key.hex())
iv2=bytes.fromhex(v['iv2']);flagct=bytes.fromhex(v['flag_enc'])
initial=state[:4]+list(struct.unpack('<8I',key))+[1]+list(struct.unpack('<3I',iv2))
p=bytes(a^b for a,b in zip(flagct,block(initial)))
print('FLAG',p.decode())
```

## 검증 방법

Python 3에서 위 코드를 실행해 서버 응답의 최종 플래그가 아래 문자열과 일치하는지 확인한다.

## 최종 플래그

```text
crypto{M1x1n6_r0und5_4r3_1nv3r71bl3!}
```
