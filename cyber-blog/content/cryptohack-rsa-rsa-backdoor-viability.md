---
{"title":"RSA Backdoor Viability","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"소수 생성식 p=427s²+1/4는 특수한 구조를 가진다. N의 인수가 FactorDB에 공개되어 있어서 이를 조회해 개인키를 복원했다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

소수 생성식 p=(427s²+1)/4는 특수 구조를 가진다. 여기서는 그 구조의 직접 공격을 구현하지 않고 FactorDB에 공개된 인수를 조회해 개인키를 재구성했다. 인수의 곱과 특수 생성식 관계를 확인한다.

## 최종 풀이 코드

```python
import math, re, requests
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_57c296f30a4d023c3c29f9b311da7c85.txt'
data=requests.get(url,timeout=20).text
v={k:int(x) for k,x in re.findall(r'(?m)^(n|e|c) = (\d+)',data)}
n,e,c=v['n'],v['e'],v['c']
r=requests.get('https://factordb.com/api',params={'query':str(n)},timeout=20)
r.raise_for_status()
factors=[int(p) for p,mult in r.json()['factors'] for _ in range(mult)]
assert len(factors)==2 and math.prod(factors)==n
p,q=factors
assert any((4*z-1)%427==0 and math.isqrt((4*z-1)//427)**2==(4*z-1)//427 for z in factors)
d=pow(e,-1,(p-1)*(q-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 최종 플래그

`crypto{I_want_to_Break_Square-free_4p-1}`
