---
{"title":"Unencryptable","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"첨부 데이터가 RSA 암호화 후 그대로인 고정점임을 먼저 확인한다. 이 문서의 재현 코드는 공개 FactorDB에 등록된 N의 인수를 조회해 개인키를 복원한다. 고정점 정보만으로 인수분해하는 별도 암호해석은 구현하지 않았다.","section":["CryptoHack","Mathematics"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/maths/#unencryptable
- 첨부: [source.py](https://cryptohack.org/static/challenges/source_b1dbaf88b6cbdfcc484a693074e668d1.py), [output.txt](https://cryptohack.org/static/challenges/output_d8d7a60bdc52b56d3be6f24a000f40cd.txt)

## 풀이 원리

첨부 데이터가 RSA 암호화 후 그대로인 고정점임을 먼저 확인한다. 이 문서의 재현 코드는 공개 FactorDB에 등록된 `N`의 인수를 조회해 개인키를 복원한다. 고정점 정보만으로 인수분해하는 별도 암호해석은 구현하지 않았다.

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

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

공개된 DATA가 실제 고정점인지, 조회한 인수의 곱이 N인지, 복호화한 값을 다시 RSA 암호화했을 때 원래 c인지 확인했다.

```text
crypto{R3m3mb3r!_F1x3d_P0iNts_aR3_s3crE7s_t00}
```

## 최종 플래그

`crypto{R3m3mb3r!_F1x3d_P0iNts_aR3_s3crE7s_t00}`
