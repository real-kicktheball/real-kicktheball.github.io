---
{"title":"Fast Primes","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"ROCA(CVE-2017-15361)는 소수를 특수한 구조로 빠르게 생성해서 공개키만으로 인수분해된 실제 취약점이다.","section":["CryptoHack","RSA"]}
---

## 개념

2017년 Infineon 칩의 RSA 키 생성 라이브러리에서 **ROCA** 취약점(CVE-2017-15361)이 발견됐다. 이 라이브러리는 소수를 빨리 만들려고 다음 형태로만 생성했다.

$$
p = k \cdot M + (65537^a \bmod M)
$$

여기서 $M$은 작은 소수 여러 개의 곱이다. 이 구조 때문에 소수의 자유도가 크게 줄었다. 그 결과 Coppersmith 방법으로 공개키만 보고 인수분해할 수 있었다. 에스토니아 전자 신분증 수십만 장이 영향을 받았다(플래그 `p00R_3570n14`가 그 이야기다).

## 문제

같은 방식으로 만든 RSA 공개키(PEM)와 PKCS#1 OAEP 암호문이 주어진다.

## 풀이

1. 의도된 풀이는 ROCA 공격으로 $N$을 인수분해하는 것이다.
2. 나는 이 $N$의 인수가 FactorDB에 등록돼 있어서 그걸 썼다.
3. $p$, $q$로 개인키를 만들고 `PKCS1_OAEP`로 복호화했다.

## 풀이 코드
```python
import io, math, requests
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
key_url='https://cryptohack.org/static/challenges/key_17a08b7040db46308f8b9a19894f9f95.pem'
ct_url='https://cryptohack.org/static/challenges/ciphertext_98a448b6bbcd080909d235e5da5e9d56.txt'
public=RSA.import_key(requests.get(key_url,timeout=20).content)
ct=bytes.fromhex(requests.get(ct_url,timeout=20).text.strip())
r=requests.get('https://factordb.com/api',params={'query':str(public.n)},timeout=20)
r.raise_for_status()
factors=[int(p) for p,mult in r.json()['factors'] for _ in range(mult)]
assert len(factors)==2 and math.prod(factors)==public.n
p,q=factors
d=pow(public.e,-1,(p-1)*(q-1))
private=RSA.construct((public.n,public.e,d,p,q))
flag=PKCS1_OAEP.new(private).decrypt(ct).decode()
assert flag.startswith('crypto{')
print(flag)
```

## 플래그
`crypto{p00R_3570n14}`
