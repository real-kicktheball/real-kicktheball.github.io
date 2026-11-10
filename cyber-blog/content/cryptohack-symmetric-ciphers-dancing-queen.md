---
{"title":"Dancing Queen","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"ChaCha20에서 마지막 feedforward(초기 상태 더하기)를 빼면 라운드 함수를 역으로 돌려 키를 복원할 수 있다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**ChaCha20**은 4×4 32비트 워드 상태를 쓰는 스트림 암호다.

```
[ 상수 상수 상수 상수 ]
[ 키   키   키   키   ]
[ 키   키   키   키   ]
[ 카운터 nonce nonce nonce ]
```

20라운드(quarter-round 80번) 동안 덧셈, 회전, XOR(ARX)을 반복한다. 마지막에 **초기 상태를 다시 더해서** 키스트림을 만든다.

$$
\text{keystream} = \text{rounds}(S_0) + S_0
$$

ARX 연산은 모두 역연산이 있다. 마지막 $+S_0$가 없다면 키스트림에서 거꾸로 라운드를 돌려 $S_0$, 즉 **키**를 그대로 얻는다. feedforward가 이걸 막는 장치다.

## 문제

feedforward를 생략한 ChaCha20 구현이 있다. 알려진 메시지와 그 암호문(IV1), 플래그 암호문(IV2)이 주어진다.

## 풀이

1. 알려진 평문과 암호문을 XOR해서 첫 블록 키스트림 64바이트를 얻는다.
2. 역 quarter-round(빼기, 오른쪽 회전, XOR을 역순으로)를 라운드 역순으로 80번 적용한다. 그러면 초기 상태 $S_0$가 나온다.
3. $S_0$의 4~11번 워드가 키다.
4. 그 키와 IV2로 정상적인 ChaCha20을 돌려 플래그를 복호화한다.

## 풀이 코드
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

## 플래그
```text
crypto{M1x1n6_r0und5_4r3_1nv3r71bl3!}
```
