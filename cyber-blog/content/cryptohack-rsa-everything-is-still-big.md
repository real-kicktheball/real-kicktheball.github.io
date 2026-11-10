---
{"title":"Everything is Still Big","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"이 문제의 작은 비밀지수는 Wiener 경계 밖에 있으므로 단순 연분수 공격이 통하지 않는다. 여기서는 공개 인수분해 데이터베이스 FactorDB의 등록된 두 소인수를 조회해 RSA 개인키를 재구성했다. 이는 원래 의도된 Boneh–Durf…","section":["CryptoHack","RSA"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/rsa/#big2
- 첨부: [source.py](https://cryptohack.org/static/challenges/source_359e2ea194f56fb72f63e7dff31b54ee.py)
- 첨부: [output.txt](https://cryptohack.org/static/challenges/output_f554de954a6cd0a94142afc264107558.txt)

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

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

인수 두 개의 곱을 n과 대조하고, 복원한 평문을 RSA로 재암호화해 c와 일치함을 확인했다. 공개 인수 조회에 네트워크가 필요하다.

```text
crypto{bon3h5_4tt4ck_i5_sr0ng3r_th4n_w13n3r5}
```

## 최종 플래그

`crypto{bon3h5_4tt4ck_i5_sr0ng3r_th4n_w13n3r5}`
