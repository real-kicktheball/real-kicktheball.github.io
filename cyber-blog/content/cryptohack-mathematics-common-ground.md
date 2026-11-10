---
{"title":"Common Ground","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"거듭제곱수의 최대공약수는 gcd(N^a−1,N^b−1)=N^gcd(a,b)−1이다. 작은 지수 gcd(a,b)만 계산하면 AES 키를 얻는다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

거듭제곱수의 최대공약수는 gcd(N^a−1,N^b−1)=N^gcd(a,b)−1이다. 작은 지수 gcd(a,b)만 계산하면 AES 키를 얻는다.

## 최종 풀이 코드

```python
import hashlib, json, math, re, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_85c88af89392f8b36082f6bbfc3c451f.txt'
data=requests.get(url,timeout=20).text
v={k:int(x) for k,x in re.findall(r'(?m)^(N|a|b) = (\d+)',data)}
N,a,b=v['N'],v['a'],v['b']
g=N**math.gcd(a,b)-1
payload=json.loads(data[data.index('{'):])
key=hashlib.sha256(long_to_bytes(g)).digest()[:16]
cipher=AES.new(key,AES.MODE_CBC,bytes.fromhex(payload['iv']))
flag=unpad(cipher.decrypt(bytes.fromhex(payload['ct'])),16).decode()
assert flag.startswith('crypto{') and flag.endswith('}')
print(flag)
```

## 최종 플래그

`crypto{n0_r34$0n_t0_b05h3r_w1th_l4rG3_GCD}`
