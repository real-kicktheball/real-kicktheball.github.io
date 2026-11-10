---
{"title":"Everything is Still Big","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"Wiener 경계를 벗어난 작은 d는 Boneh–Durfee 공격(d < N^0.292)으로 깨진다.","section":["CryptoHack","RSA"]}
---

## 개념

Wiener 공격은 $d < N^{0.25}$까지만 된다. **Boneh–Durfee 공격**은 격자(lattice)와 Coppersmith 방법을 써서 이 범위를 넓힌다.

$$
d < N^{0.292}
$$

$ed = 1 + k\varphi(N)$에서 다음 다항식의 작은 근을 찾는 문제로 바꾼다.

$$
f(k, s) = k(N + 1 - s) + 1 \equiv 0 \pmod e \qquad (s = p + q)
$$

이걸 LLL로 푸는 방식이다.

## 문제

앞 문제와 비슷하지만 $d$가 Wiener 경계보다 조금 커서 연분수 공격이 통하지 않는다.

## 풀이

1. 의도된 풀이는 Boneh–Durfee를 구현하는 것이다.
2. 나는 FactorDB에 이 $N$의 인수가 등록돼 있어서 그걸로 개인키를 만들었다.
3. 플래그도 "Boneh 공격이 Wiener보다 강하다"는 내용이다.

## 풀이 코드
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

## 플래그
`crypto{bon3h5_4tt4ck_i5_sr0ng3r_th4n_w13n3r5}`
