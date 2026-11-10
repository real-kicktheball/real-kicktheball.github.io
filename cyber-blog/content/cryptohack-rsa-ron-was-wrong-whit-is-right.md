---
{"title":"Ron was Wrong, Whit is Right","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"서로 다른 RSA 키라도 소수 하나를 공유하면 gcd(N1, N2)로 바로 인수분해된다. 실제 인터넷 키에서 발견된 문제다.","section":["CryptoHack","RSA"]}
---

## 개념

난수 생성기가 약하면 서로 다른 키가 **같은 소수를 공유**할 수 있다.

$$
N_1 = p \cdot q_1, \quad N_2 = p \cdot q_2 \ \Rightarrow\ \gcd(N_1, N_2) = p
$$

GCD는 인수분해와 달리 아주 빠르다. 그래서 키를 많이 모아서 모든 쌍의 GCD를 구하면 공유 소수를 가진 키가 다 깨진다.

2012년 논문 *"Ron was wrong, Whit is right"*에서 실제 인터넷에 공개된 RSA 키 수만 개가 이렇게 깨진다는 게 밝혀졌다.

## 문제

공개키 50개와 각각의 OAEP 암호문이 주어진다.

## 풀이

1. 모든 키 쌍에 대해 $\gcd(N_i, N_j)$를 계산한다.
2. 1이 아닌 값이 나오면 그게 공유 소수 $p$다.
3. 두 키 모두 $q = N / p$로 인수분해된다.
4. 개인키를 만들어 각 암호문을 OAEP로 복호화하면 그중 하나에 플래그가 있다.

## 풀이 코드
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

## 플래그
`crypto{3ucl1d_w0uld_b3_pr0ud}`
