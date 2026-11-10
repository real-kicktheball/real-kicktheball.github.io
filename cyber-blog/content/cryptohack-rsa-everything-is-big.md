---
{"title":"Everything is Big","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"Wiener 공격을 적용한다. 공개지수 e가 매우 크고 비밀지수 d가 작아 e/N의 연분수 수렴분수 중 k/d가 성립한다. 후보 d마다 φ=(ed−1)/k를 만들고, p+q=N−φ+1의 판별식이 완전제곱수인지 검사해 인수와 d를 확정한다.","section":["CryptoHack","RSA"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/rsa/#big
- 첨부: [output.txt](https://cryptohack.org/static/challenges/output_1884d0ba92d19ad074549e174cdf5a70.txt)

## 풀이 원리

Wiener 공격을 적용한다. 공개지수 e가 매우 크고 비밀지수 d가 작아 e/N의 연분수 수렴분수 중 k/d가 성립한다. 후보 d마다 φ=(ed−1)/k를 만들고, p+q=N−φ+1의 판별식이 완전제곱수인지 검사해 인수와 d를 확정한다.

## 최종 풀이 코드

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

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 다시 실행해 아래 결과를 얻었다. 인수 p,q의 곱이 N인지, 복호화한 m을 재암호화했을 때 c인지 확인한다.

```text
crypto{s0m3th1ng5_c4n_b3_t00_b1g}
```

## 최종 플래그

`crypto{s0m3th1ng5_c4n_b3_t00_b1g}`
