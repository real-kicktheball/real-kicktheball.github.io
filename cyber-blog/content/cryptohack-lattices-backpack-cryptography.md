---
{"title":"Backpack Cryptography","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"암호문은 공개 가중치 a_i와 메시지 비트 b_i의 부분합 c=\\sum b_i a_i다. (2I,a) 행들과 (1,\\ldots,1,c) 행으로 격자를 만들면 올바른 비트 선택의 선형 결합은 앞 좌표가 모두 \\pm1이고 마지막 좌표가 0인 짧…","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

암호문은 공개 가중치 $a_i$와 메시지 비트 $b_i$의 부분합 $c=\sum b_i a_i$다. $(2I,a)$ 행들과 $(1,\ldots,1,c)$ 행으로 격자를 만들면 올바른 비트 선택의 선형 결합은 앞 좌표가 모두 $\pm1$이고 마지막 좌표가 0인 짧은 벡터다. LLL로 이 벡터를 찾고 $b_i=(1-v_i)/2$로 복원한다. 소스에서 메시지를 최하위 비트부터 소비하므로 같은 순서로 정수를 조립한다.

## 최종 익스플로잇

아래 코드를 `solve.sage`로 저장하고 `sage solve.sage`로 실행한다. 공식 `output.txt`를 직접 가져온다.

```python
from sage.all import *
from urllib.request import urlopen
from ast import literal_eval
u='https://cryptohack.org/static/challenges/output_e2fe6134f7dd580dcedacdbe71846d0e.txt'
# exact URL is set below from inventory
s=urlopen(u).read().decode()
a=literal_eval(s.split('Public key: ',1)[1].splitlines()[0])
ct=int(s.split('Encrypted Flag: ',1)[1].splitlines()[0])
n=len(a)
rows=[]
for k in range(n):
 row=[0]*(n+1);row[k]=2;row[n]=a[k];rows.append(row)
rows.append([1]*n+[ct])
M=Matrix(ZZ,rows).LLL()
for row in M.rows():
 if row[-1]==0 and all(abs(x)==1 for x in row[:-1]):
  for sign in (1,-1):
   bits=[(1-sign*x)//2 for x in row[:-1]]
   if sum(bits[k]*a[k] for k in range(n))!=ct:continue
   msg=sum(int(b)<<k for k,b in enumerate(bits))
   out=msg.to_bytes((msg.bit_length()+7)//8,'big')
   if out.startswith(b'crypto{'):
    print(out.decode(),flush=True);quit()
print('not found',flush=True)
```

## 검증 방법

복원 비트에 대해 `sum(bits[k]*a[k]) == ct`를 확인한다. 실행 결과는 아래 플래그다.

## 최종 플래그

```text
crypto{my_kn4ps4ck_1s_l1ghtw31ght}
```
