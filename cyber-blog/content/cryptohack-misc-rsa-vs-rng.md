---
{"title":"RSA vs RNG","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"RSA 소수 두 개를 같은 LCG 난수열에서 뽑으면 Q = A^k·P + S_k 관계가 생겨 N이 이차식의 해로 인수분해된다.","section":["CryptoHack","Misc"]}
---

## 개념

**LCG(선형 합동 생성기)**는 아주 간단한 난수 생성기다.

$$
\text{다음 값} = (A \times \text{현재 값} + B) \bmod M
$$

빠르지만 **다음 값이 이전 값으로 완전히 정해진다**. 그래서 암호에 쓰면 안 된다.

### 직접 해보기 ($A = 5$, $B = 3$, $M = 16$, 시작 1)

| 순서 | 계산 | 값 |
|---|---|---:|
| 1 | 시작 | 1 |
| 2 | $5 \times 1 + 3 = 8$ | 8 |
| 3 | $5 \times 8 + 3 = 43 \bmod 16$ | 11 |
| 4 | $5 \times 11 + 3 = 58 \bmod 16$ | 10 |

값 하나만 알면 뒤의 값이 전부 예측된다.

### 이 문제에서

RSA의 두 소수 $P$, $Q$를 **같은 LCG**에서 차례로 뽑았다. 그러면 $Q$는 $P$로 정해지는 식이 된다.

$$
Q = (\text{숫자}) \times P + (\text{숫자})
$$

$N = P \times Q$에 넣으면 **$P$에 대한 이차방정식**이 된다. $M$이 2의 거듭제곱이라서 이 방정식을 **아래 비트부터 한 비트씩** 풀 수 있다(Vote for Pedro 문제와 같은 방법). 두 소수 사이에 LCG를 몇 번 돌렸는지 모르니까, 그 횟수를 하나씩 바꿔가며 시도했다.

### 정리

**선형 합동 생성기(LCG)**는 $x_{i+1} = A x_i + B \bmod M$으로 난수를 만든다. 빠르지만 다음 값이 이전 값의 선형식이라 예측 가능하다.

LCG에서 $P$를 뽑고 $k$번 더 돌려 $Q$를 뽑았다면 다음이 성립한다.

$$
Q = A^k P + S_k \pmod M, \qquad S_k = B(A^{k-1} + \cdots + A + 1)
$$

$N = PQ$에 대입하면 $P$에 대한 이차식이 된다.

$$
A^k P^2 + S_k P - N \equiv 0 \pmod{2^{512}}
$$

$M = 2^{512}$이라 이 식을 하위 비트부터 한 비트씩 풀 수 있다(2진 Hensel lifting).

## 문제

LCG($M = 2^{512}$, $A$, $B$ 공개)에서 소수가 나올 때까지 뽑는 방식으로 $P$, $Q$를 만들었다. $N$, $e$, 암호문이 주어진다.

## 풀이

1. 이 LCG는 매번 홀짝이 뒤집혀서 두 소수 사이 간격 $k$는 짝수다.
2. 짝수 $k$마다 위 이차식을 $\bmod 2, 4, 8, \dots, 2^{512}$로 키워가며 $P$ 후보를 만든다.
3. 후보가 실제로 $N$을 나누는지 확인한다. $k = 180$에서 인수가 나왔다.
4. 개인키를 만들어 복호화한다.

## 풀이 코드
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

## 플래그
```text
crypto{pseudorandom_shamir_adleman}
```
