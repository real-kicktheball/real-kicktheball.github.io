---
{"title":"Jeff's LFSR","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"Geffe 생성기는 LFSR 세 개를 섞지만 출력이 각 LFSR과 75% 상관관계를 가진다. 출력 비트를 선형식과 제약으로 풀어 초기 상태를 복원한다.","section":["CryptoHack","Misc"]}
---

## 개념

**LFSR**은 이전 비트들의 XOR로 다음 비트를 만드는 레지스터다. 출력의 모든 비트는 초기 상태 비트의 $\mathrm{GF}(2)$ **선형식**이다. 그래서 단독으로 쓰면 연립방정식으로 바로 깨진다.

**Geffe 생성기**는 LFSR 세 개 $x_1, x_2, x_3$를 비선형으로 섞는다.

$$
z = \begin{cases} x_1 & x_2 = 1 \\ x_3 & x_2 = 0 \end{cases}
= x_1 x_2 \oplus (1 \oplus x_2) x_3
$$

하지만 출력 $z$가 $x_1$과 같을 확률이 75%, $x_3$과 같을 확률도 75%다. 그래서 각 LFSR을 따로 전수조사하는 **상관 공격**이 된다. 문제 이름의 Geffe가 교과서적 예시다.

## 문제

길이 19, 27, 23인 LFSR 세 개로 만든 Geffe 생성기 출력 256비트와 AES 암호문이 주어진다. 키는 세 LFSR 초기 상태로 만든다.

## 풀이

상관 공격 대신 제약 풀이로 했다.

1. 각 LFSR의 $t$번째 출력을 초기 상태 비트들의 XOR 마스크로 계산한다.
2. Z3에 초기 비트 69개를 Bool 변수로 두고, 256개 관측 비트 각각에 Geffe 식을 제약으로 넣는다.
3. 해를 구하면 세 초기 상태가 나온다.
4. 이를 정수로 이어 SHA-1 키를 만들고 AES를 복호화한다.

## 풀이 코드
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

## 플래그
```text
crypto{Geffe_generator_is_a_textbook_example_to_show_correlation_attacks_on_LFSR}
```
