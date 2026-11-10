---
{"title":"Backpack Cryptography","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"배낭(부분합) 암호는 부분합 문제를 격자의 짧은 벡터 문제로 바꾸면 LLL로 깨진다.","section":["CryptoHack","Lattices"]}
---

## 개념

### 배낭 문제

무게가 다른 물건들이 있다. 이 중 몇 개를 골라서 **정확히 원하는 무게**를 맞추는 문제다.

### 직접 해보기

물건 무게: 3, 5, 9, 14 / 목표 무게: 17

- 3 + 14 = 17 ✔

물건 4개면 쉽지만 수백 개면 경우의 수가 엄청나게 많아진다. 그래서 이걸 암호로 쓸 수 있다고 생각했다(Merkle–Hellman 배낭 암호, 1978).

### 암호로 쓰는 법

- 메시지 비트가 1이면 그 물건을 넣고, 0이면 안 넣는다.
- 공개키는 물건 무게 목록이고, 암호문은 총 무게다.

물건 무게가 3, 5, 9, 14이고 메시지가 `1001`이면 암호문은 $3 + 14 = 17$이다.

### 격자로 깨기

"어떤 물건을 골랐는지"를 격자의 **짧은 화살표**로 바꿀 수 있다. 맞는 선택은 좌표가 모두 $+1$, $-1$로 된 아주 짧은 화살표가 된다. 그래서 **LLL 알고리즘**(가우스 축소를 여러 차원으로 넓힌 것)으로 찾을 수 있다. 실제로 배낭 암호는 1980년대에 이 방법으로 깨졌다.

### 정리

**Merkle–Hellman 배낭 암호**는 메시지 비트 $b_i$로 공개 가중치 $a_i$의 부분합을 만든다.

$$
c = \sum_i b_i a_i \qquad (b_i \in \{0, 1\})
$$

부분합 문제는 일반적으로 NP-hard다. 하지만 가중치 밀도가 낮으면 격자로 풀 수 있다. 다음 행들로 격자를 만든다.

$$
\begin{pmatrix}
2 & 0 & \cdots & 0 & a_1 \\
0 & 2 & \cdots & 0 & a_2 \\
\vdots & & \ddots & & \vdots \\
0 & 0 & \cdots & 2 & a_n \\
1 & 1 & \cdots & 1 & c
\end{pmatrix}
$$

마지막 행에서 $b_i = 1$인 행들을 빼면 앞 좌표는 $\pm 1$, 마지막 좌표는 0이 된다. 아주 짧은 벡터다. **LLL**은 고차원에서 짧은 벡터를 근사적으로 찾는 알고리즘이고, 이런 특별히 짧은 벡터는 잘 찾아낸다.

## 문제

공개 가중치 목록과 플래그 비트로 만든 부분합 $c$가 주어진다.

## 풀이

1. 위 격자를 만들어 SageMath로 LLL을 돌린다.
2. 마지막 좌표가 0이고 나머지가 모두 $\pm 1$인 행을 찾는다.
3. $b_i = (1 - v_i)/2$로 비트를 복원한다. 부호가 반대일 수 있어서 두 경우 모두 시도했다.
4. 소스가 메시지를 최하위 비트부터 썼으므로 같은 순서로 정수를 조립한다.

## 풀이 코드
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

## 플래그
```text
crypto{my_kn4ps4ck_1s_l1ghtw31ght}
```
