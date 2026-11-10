---
{"title":"RSA vs RNG","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"두 RSA 소수 P,Q는 같은 LCG의 상태다. 두 소수 사이의 진행 횟수를 k라 하면 Q=A^kP+S_k\\pmod{2^{512}}다. N=PQ를 결합해 A^kP^2+S_kP-N=0\\pmod{2^{512}}라는 이차식을 얻는다. LCG의 홀…","section":["CryptoHack","Misc"]}
---

## 풀이 방법

두 RSA 소수 $P,Q$는 같은 LCG의 상태다. 두 소수 사이의 진행 횟수를 $k$라 하면 $Q=A^kP+S_k\pmod{2^{512}}$다. $N=PQ$를 결합해 $A^kP^2+S_kP-N=0\pmod{2^{512}}$라는 이차식을 얻는다. LCG의 홀짝이 매번 뒤집히므로 $k$는 짝수다. 각 짝수 간격에 대해 2진 Hensel lifting으로 $P$의 하위 비트부터 복원하고, $N$의 실제 인수인지 검사한다. 이 인스턴스는 $k=180$에서 인수가 나온다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. 공식 소스와 암호문을 직접 받아 처리한다.

```python
import ast,json
from urllib.request import urlopen
source=urlopen('https://cryptohack.org/static/challenges/rsa-vs-rng_abed7c4efbaae65394e7f00f48130da4.py').read().decode()
tree=ast.parse(source)
vals={n.targets[0].id:ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and len(n.targets)==1 and isinstance(n.targets[0],ast.Name) and n.targets[0].id in ('A','B')}
A,B=vals['A'],vals['B']
data=json.loads(urlopen('https://cryptohack.org/static/challenges/flag_9713440954a452ff8c5e5b05247f19fe.enc').read().decode())
N,E,ct=data['N'],data['E'],int(data['ciphertext'],16)
MOD=1<<512
Ag,Sg=1,0
for gap in range(1,1002):
 Ag,Sg=(A*Ag)%MOD,(A*Sg+B)%MOD
 if gap%2:continue
 candidates=[1]
 for bit in range(1,512):
  mod=1<<(bit+1);step=1<<bit
  candidates=[p+k*step for p in candidates for k in (0,1) if (Ag*(p+k*step)**2+Sg*(p+k*step)-N)%mod==0]
  if not candidates or len(candidates)>128:break
 if not candidates or len(candidates)>128:continue
 for p in candidates:
  if p>1 and N%p==0:
   q=N//p
   d=pow(E,-1,(p-1)*(q-1))
   m=pow(ct,d,N)
   flag=m.to_bytes((m.bit_length()+7)//8,'big')
   assert (Ag*p+Sg)%MOD==q
   print(flag.decode())
   quit()

```

## 검증 방법

복원한 $P$가 $N$을 나누는지, 계산한 $Q=N/P$가 LCG 전이식과 일치하는지 검사한 다음 RSA 개인 지수로 복호화한다.

## 최종 플래그

```text
crypto{pseudorandom_shamir_adleman}
```
