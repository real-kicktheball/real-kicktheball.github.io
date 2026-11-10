---
{"title":"Ron was Wrong, Whit is Right","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"각 RSA 키가 OAEP를 사용해도 두 키의 법이 같은 소인수를 공유하면 두 법의 최대공약수로 그 소수를 얻는다. 모든 공개키 쌍의 gcd(n_i,n_j)를 계산하고, 공통 인수를 찾으면 각 개인키를 재구성해 OAEP 암호문을 복호화한다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

각 RSA 키가 OAEP를 사용해도 두 키의 법이 같은 소인수를 공유하면 두 법의 최대공약수로 그 소수를 얻는다. 모든 공개키 쌍의 `gcd(n_i,n_j)`를 계산하고, 공통 인수를 찾으면 각 개인키를 재구성해 OAEP 암호문을 복호화한다.

## 최종 익스플로잇

```python
import io, itertools, math, re, requests, zipfile
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
url='https://cryptohack.org/static/challenges/keys_and_messages_701dba5b1a84cb168547ec18227a7740.zip'
response=requests.get(url,timeout=20)
response.raise_for_status()
archive=zipfile.ZipFile(io.BytesIO(response.content))
keys={}
for path in archive.namelist():
    if path.endswith('.pem'):
        idx=path.rsplit('/',1)[-1].split('.')[0]
        keys[idx]=RSA.import_key(archive.read(path))
for (i,a),(j,b) in itertools.combinations(keys.items(),2):
    p=math.gcd(a.n,b.n)
    if p==1: continue
    assert a.n%p==0 and b.n%p==0
    for idx,pub in ((i,a),(j,b)):
        q=pub.n//p
        d=pow(pub.e,-1,(p-1)*(q-1))
        private=RSA.construct((pub.n,pub.e,d,p,q))
        ct=bytes.fromhex(archive.read(f'keys_and_messages/{idx}.ciphertext').decode())
        plaintext=PKCS1_OAEP.new(private).decrypt(ct)
        match=re.search(rb'crypto\{[^}]+\}',plaintext)
        if match:
            print(match.group().decode())
            raise SystemExit
raise ValueError('Flag not found')
```

## 최종 플래그

`crypto{3ucl1d_w0uld_b3_pr0ud}`
