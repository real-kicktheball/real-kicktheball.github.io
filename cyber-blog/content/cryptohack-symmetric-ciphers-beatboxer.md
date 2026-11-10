---
{"title":"Beatboxer","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"S-box가 GF(2)에서 선형 변환과 상수의 합이므로 이 AES 변형 전체가 E(P)=A·P⊕b 형태의 아핀 함수다. 키는 상수항 b만 바꾼다. 실제 서비스에 0 블록을 한 번 암호화시켜 b를 구하고, 공개된 알고리즘을 0 키로 실행하여 …","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [Beatboxer](https://cryptohack.org/challenges/aes/#beatboxer)
- 첨부: [13406.py](https://cryptohack.org/static/challenges/13406_d7fa07291de630ace1055895f9ae208b.py)
- 검증: 서버에서 플래그 직접 획득; 플랫폼 제출 확인 전

## 풀이 원리

S-box가 GF(2)에서 선형 변환과 상수의 합이므로 이 AES 변형 전체가 `E(P)=A·P⊕b` 형태의 아핀 함수다. 키는 상수항 `b`만 바꾼다. 실제 서비스에 0 블록을 한 번 암호화시켜 `b`를 구하고, 공개된 알고리즘을 0 키로 실행하여 128개 단위 비트 입력의 출력을 얻는다. 이 출력이 선형변환 `A`의 열이다. GF(2) 가우스 소거로 역행렬을 계산해 플래그 암호문 각 블록을 복원한다.

## 최종 익스플로잇

```python
import requests,socket,json
u='https://cryptohack.org/static/challenges/13406_d7fa07291de630ace1055895f9ae208b.py'
source=requests.get(u,timeout=20).text
namespace={}
exec(source[source.index('class AES:'):source.index('class Challenge:')],namespace)
AES=namespace['AES']
local=AES(bytes(16))
zero=local.encrypt(bytes(16))
cols=[]
for j in range(128):
 p=(1<<j).to_bytes(16,'big')
 c=local.encrypt(p)
 cols.append(int.from_bytes(bytes(a^b for a,b in zip(c,zero)),'big'))
def inverse(y):
 rows=[]
 for bit in range(128):
  coeff=sum(((col>>bit)&1)<<j for j,col in enumerate(cols))
  rows.append(coeff|(((y>>bit)&1)<<128))
 rank=0;pivots=[]
 for col in range(128):
  pivot=next((r for r in range(rank,128) if rows[r]>>col&1),None)
  if pivot is None:continue
  rows[rank],rows[pivot]=rows[pivot],rows[rank]
  for r in range(128):
   if r!=rank and rows[r]>>col&1:rows[r]^=rows[rank]
  pivots.append(col);rank+=1
 assert rank==128,rank
 x=sum((rows[r]>>128&1)<<col for r,col in enumerate(pivots))
 return x.to_bytes(16,'big')
with socket.create_connection(('socket.cryptohack.org',13406),timeout=20) as s:
 f=s.makefile('rwb',buffering=0)
 print(f.readline().decode().strip())
 def ask(obj):
  f.write((json.dumps(obj)+'\n').encode());return json.loads(f.readline())
 realzero=bytes.fromhex(ask({'option':'encrypt_message','message':'00'*16})['encrypted_message'])
 encrypted=bytes.fromhex(ask({'option':'encrypt_flag'})['encrypted_flag'])
 pt=b''
 for i in range(0,len(encrypted),16):
  y=int.from_bytes(bytes(a^b for a,b in zip(encrypted[i:i+16],realzero)),'big')
  pt+=inverse(y)
 print('FLAG',pt[:-pt[-1]].decode())
```

## 검증 방법

`python3`으로 코드를 실행해 서버의 암호문에서 아래 플래그를 출력하는지 확인한다. 단위 비트 128개의 결과가 가역행렬(`rank=128`)임도 코드에서 검증한다.

## 최종 플래그

```text
crypto{5b0x_l1n34r17y_15_d35457r0u5}
```
