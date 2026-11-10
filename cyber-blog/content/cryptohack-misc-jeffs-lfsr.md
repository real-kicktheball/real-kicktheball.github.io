---
{"title":"Jeff's LFSR","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"세 LFSR의 출력은 각 초기 상태 비트에 대한 GF(2) 선형식이다. 각 시점의 선형식을 정수 비트마스크로 만들고, Geffe 결합기의 출력 if selector then stream1 else stream2를 Z3 제약으로 표현한다. 2…","section":["CryptoHack","Misc"]}
---

분야: Misc / lfsr  
문제: https://cryptohack.org/challenges/misc/#jeff  
소스: https://cryptohack.org/static/challenges/jeff_6f0cbc35544fb45343cd6ee532358f89.py  
데이터: https://cryptohack.org/static/challenges/output_d5e714c9cb62f14696f21db9c5a4a2e5.txt  
검증: 2026-11-10, Z3로 256 출력비트 전부 만족하는 69비트 초기 상태를 복원하고 AES-CBC 복호화 확인. CryptoHack 계정 제출 대기

## 풀이 방법

세 LFSR의 출력은 각 초기 상태 비트에 대한 GF(2) 선형식이다. 각 시점의 선형식을 정수 비트마스크로 만들고, Geffe 결합기의 출력 `if selector then stream1 else stream2`를 Z3 제약으로 표현한다. 256개 관측 비트에서 69개 초기 비트를 구한다. 얻은 상태를 정수로 이어 붙인 뒤 문제 소스처럼 십진 문자열의 SHA-1 앞 16바이트를 AES 키로 사용한다.

## 최종 익스플로잇

`pip install z3-solver pycryptodome` 후 Python 3에서 실행한다. 공식 출력 파일을 직접 가져온다.

```python
import ast,hashlib,z3
from functools import reduce
from urllib.request import urlopen
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
lines=urlopen('https://cryptohack.org/static/challenges/output_d5e714c9cb62f14696f21db9c5a4a2e5.txt').read().decode().splitlines()
stream=ast.literal_eval(lines[0]);data=ast.literal_eval(lines[1])
sizes=[19,27,23]
taps=[[0,1,2,5],[0,1,2,5],[0,1,3,5]]

def output_masks(n,taps,N):
 state=[1<<(n-1-j) for j in range(n)]
 out=[]
 for _ in range(N):
  out.append(state[0])
  feedback=0
  for t in taps:feedback^=state[t]
  state=state[1:]+[feedback]
 return out

variables=[[z3.Bool(f's{j}_{k}') for k in range(n)] for j,n in enumerate(sizes)]
masks=[output_masks(n,t,len(stream)) for n,t in zip(sizes,taps)]
def value(mask,vars):
 chosen=[vars[j] for j in range(len(vars)) if (mask>>(len(vars)-1-j))&1]
 return reduce(z3.Xor,chosen,z3.BoolVal(False))
solver=z3.Solver();solver.set(timeout=120000)
for index,bit in enumerate(stream):
 b=[value(masks[j][index],variables[j]) for j in range(3)]
 solver.add(z3.If(b[0],b[1],b[2])==z3.BoolVal(bool(bit)))
res=solver.check()
assert res==z3.sat
if res==z3.sat:
 m=solver.model()
 bits=[int(z3.is_true(m.eval(x))) for group in variables for x in group]
 key=int(''.join(map(str,bits)),2)
 aes_key=hashlib.sha1(str(key).encode()).digest()[:16]
 flag=unpad(AES.new(aes_key,AES.MODE_CBC,bytes.fromhex(data['iv'])).decrypt(bytes.fromhex(data['encrypted_flag'])),16)
 print(flag.decode())

```

## 검증 방법

Z3 모델은 256개 출력 제약을 모두 만족한다. 해당 키로 AES-CBC를 복호화하고 PKCS#7 패딩 검사를 통과하는지 확인한다.

## 최종 플래그

```text
crypto{Geffe_generator_is_a_textbook_example_to_show_correlation_attacks_on_LFSR}
```
