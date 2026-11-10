---
{"title":"Everything is Still Big","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"이 문제의 작은 비밀지수는 Wiener 경계 밖에 있으므로 단순 연분수 공격이 통하지 않는다. 여기서는 공개 인수분해 데이터베이스 FactorDB의 등록된 두 소인수를 조회해 RSA 개인키를 재구성했다. 이는 원래 의도된 Boneh–Durf…","section":["CryptoHack","RSA"]}
---

## 풀이 원리

이 문제의 작은 비밀지수는 Wiener 경계 밖에 있으므로 단순 연분수 공격이 통하지 않는다. 여기서는 공개 인수분해 데이터베이스 FactorDB의 등록된 두 소인수를 조회해 RSA 개인키를 재구성했다. 이는 원래 의도된 Boneh–Durfee 공격 구현을 대체한 풀이임을 명시한다.

## 최종 풀이 코드

```python
import math, re, requests
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_f554de954a6cd0a94142afc264107558.txt'
data=requests.get(url,timeout=20).text
v={k:int(x,0) for k,x in re.findall(r'(?m)^(N|e|c) = (\S+)',data)}
n,e,c=v['N'],v['e'],v['c']
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

`crypto{bon3h5_4tt4ck_i5_sr0ng3r_th4n_w13n3r5}`
