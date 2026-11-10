---
{"title":"Everything is Big","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"d가 N^(1/4)보다 작으면 e/N의 연분수 전개에서 k/d가 나온다(Wiener 공격).","section":["CryptoHack","RSA"]}
---

## 개념

비밀키 $d$를 작게 만들면 복호화가 빨라진다. 그런데 **$d$가 너무 작으면** 공개키에서 $d$가 새어 나온다. 이걸 **Wiener 공격**이라 한다.

### 핵심 아이디어: 분수 근사

$e \times d = 1 + k \times \varphi(N)$이고, $\varphi(N)$은 $N$과 거의 같다. 그래서 이렇게 된다.

$$
\frac{e}{N} \approx \frac{k}{d}
$$

공개된 $\frac{e}{N}$을 잘 근사하는 **작은 분수**를 찾으면 그 분모가 $d$일 가능성이 높다.

### 직접 해보기 (연분수로 분수 근사하기)

$\frac{43}{30}$을 근사해보자.

1. $43 = 1 \times 30 + 13$ → 첫 근사 $1$
2. $30 = 2 \times 13 + 4$ → 두 번째 근사 $1 + \frac{1}{2} = \frac{3}{2}$
3. $13 = 3 \times 4 + 1$ → 세 번째 근사 $1 + \frac{1}{2 + \frac{1}{3}} = \frac{10}{7}$

$\frac{10}{7} = 1.4286$이고 $\frac{43}{30} = 1.4333$이다. 아주 가까운 작은 분수를 찾았다. 이걸 **연분수 전개**라 한다. 유클리드 호제법과 같은 계산이다.

Wiener 공격은 $\frac{e}{N}$을 이렇게 전개하면서 나오는 분수의 분모들을 $d$ 후보로 하나씩 시험한다.

### 정리

$d$를 작게 만들면 복호화가 빨라지지만 위험하다. **Wiener 공격**은 다음 조건에서 성립한다.

$$
d < \tfrac{1}{3} N^{1/4}
$$

$ed = 1 + k\varphi(N)$이고 $\varphi(N) \approx N$이므로 다음 근사가 성립한다.

$$
\frac{e}{N} \approx \frac{k}{d}
$$

이 근사가 충분히 정확하면 $\frac{k}{d}$는 $\frac{e}{N}$의 **연분수 전개 수렴분수** 중 하나로 반드시 나타난다.

## 문제

$N$, $e$, $c$가 주어지는데 $e$가 $N$만큼 크다. $e$가 크다는 건 $d$가 작다는 신호다.

## 풀이

1. $e/N$을 연분수로 전개하면서 수렴분수 $k/d$를 하나씩 만든다.
2. 각 후보로 $\varphi = (ed - 1)/k$를 계산한다.
3. $p + q = N - \varphi + 1$이다. 그래서 $x^2 - (p+q)x + N = 0$의 판별식이 완전제곱수인지 본다.
4. 완전제곱수가 되는 후보에서 $p$, $q$, $d$가 확정된다.

## 풀이 코드
```python
import math, re, requests
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_1884d0ba92d19ad074549e174cdf5a70.txt'
data=requests.get(url,timeout=20).text
v={k:int(x,0) for k,x in re.findall(r'(?m)^(N|e|c) = (\S+)',data)}
N,e,c=v['N'],v['e'],v['c']
a,b=e,N
num0,num1=0,1
den0,den1=1,0
for _ in range(10000):
    if not b: break
    q,a,b=a//b,b,a%b
    num0,num1=num1,q*num1+num0
    den0,den1=den1,q*den1+den0
    k,d=num1,den1
    if not k or (e*d-1)%k: continue
    phi=(e*d-1)//k
    s=N-phi+1
    disc=s*s-4*N
    if disc<0: continue
    root=math.isqrt(disc)
    if root*root!=disc or (s+root)%2: continue
    p=(s+root)//2
    q=(s-root)//2
    if p*q==N:
        m=pow(c,d,N)
        assert pow(m,e,N)==c
        print(long_to_bytes(m).decode())
        break
else:
    raise ValueError('Wiener attack failed')
```

## 플래그
`crypto{s0m3th1ng5_c4n_b3_t00_b1g}`
