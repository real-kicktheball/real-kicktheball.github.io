---
{"title":"Unencryptable","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"첨부 데이터는 RSA로 암호화해도 값이 바뀌지 않는 고정점이다. N의 인수가 FactorDB에 등록되어 있어서 이를 조회해 개인키를 복원했다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

첨부 데이터는 RSA로 암호화해도 값이 바뀌지 않는 고정점이다. `N`의 인수가 FactorDB에 등록되어 있어서 이를 조회해 개인키를 복원했다.

## 최종 풀이 코드

```python
import math, re, requests
from Crypto.Util.number import long_to_bytes
source_url='https://cryptohack.org/static/challenges/source_b1dbaf88b6cbdfcc484a693074e668d1.py'
output_url='https://cryptohack.org/static/challenges/output_d8d7a60bdc52b56d3be6f24a000f40cd.txt'
source=requests.get(source_url,timeout=20).text
data=requests.get(output_url,timeout=20).text
v={k:int(x,0) for k,x in re.findall(r'(?m)^([Nec]+) = (0x[0-9a-f]+|\d+)',data)}
n,e,c=v['N'],v['e'],v['c']
known=int(re.search(r'DATA = bytes.fromhex\("([0-9a-f]+)"\)',source).group(1),16)
assert pow(known,e,n)==known
r=requests.get('https://factordb.com/api',params={'query':str(n)},timeout=20)
r.raise_for_status()
factors=[int(p) for p,mult in r.json()['factors'] for _ in range(mult)]
assert len(factors)==2 and math.prod(factors)==n
p,q=factors
d=pow(e,-1,(p-1)*(q-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 최종 플래그

`crypto{R3m3mb3r!_F1x3d_P0iNts_aR3_s3crE7s_t00}`
