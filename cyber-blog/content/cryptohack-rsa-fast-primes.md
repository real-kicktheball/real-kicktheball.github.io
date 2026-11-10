---
{"title":"Fast Primes","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"생성 코드가 소수의 구조를 제한하고 있다. N의 인수가 FactorDB에 등록되어 있어서 이를 조회해 개인키를 복원했다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

생성 코드가 소수 구조를 제한한다. 본 문서는 공개 FactorDB에 등록된 인수를 조회해 개인키를 복원하는 재현 가능한 경로다. 구조를 이용한 직접 인수분해를 구현한 것은 아니므로 그 한계를 구분한다.

## 최종 풀이 코드

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

## 최종 플래그

`crypto{p00R_3570n14}`
