---
{"title":"Beatboxer","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"S-box를 선형으로 바꾼 AES는 전체가 E(P) = A·P ⊕ b인 아핀 함수가 된다. 선형대수로 키 없이 복호화한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

AES에서 비선형 연산은 **S-box 하나뿐**이다. ShiftRows, MixColumns, AddRoundKey는 모두 $\mathrm{GF}(2)$ 위에서 선형(또는 아핀)이다.

S-box까지 아핀 변환으로 바꾸면 AES 전체가 다음 꼴이 된다.

$$
E_K(P) = A \cdot P \oplus b_K
$$

- $A$는 128×128 비트 행렬로, **키와 무관**하다.
- 키는 상수 $b_K$에만 영향을 준다.

그래서 $A$와 $b_K$만 알면 $P = A^{-1}(C \oplus b_K)$로 키 없이 복호화된다.

## 문제

S-box가 선형으로 바뀐 AES 구현과, 그걸로 암호화한 플래그가 주어진다. 서버는 선택한 평문을 암호화해준다.

## 풀이

1. **$A$ 구하기**: 공개된 구현을 아무 키(0)로 돌린다. 128개 단위 벡터 $e_j$를 넣으면 $E(e_j) \oplus E(0)$이 $A$의 $j$번째 열이다.
2. **$b_K$ 구하기**: 서버에 0 블록을 암호화시키면 $E_K(0) = b_K$이다.
3. $\mathrm{GF}(2)$ 가우스 소거로 $A$의 역행렬을 구한다.
4. 플래그 블록마다 $P = A^{-1}(C \oplus b_K)$를 계산한다.

## 풀이 코드
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

## 플래그
```text
crypto{5b0x_l1n34r17y_15_d35457r0u5}
```
