---
{"title":"Common Ground","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"거듭제곱수의 최대공약수는 gcd(N^a−1,N^b−1)=N^gcd(a,b)−1이다. 작은 지수 gcd(a,b)만 계산하면 AES 키를 얻는다.","section":["CryptoHack","Mathematics"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/maths/#common_ground
- 첨부: [output.txt](https://cryptohack.org/static/challenges/output_85c88af89392f8b36082f6bbfc3c451f.txt)

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

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. 계산한 g의 해시로 CBC 복호화하고 PKCS#7 패딩 및 플래그 형식을 확인한다.

```text
crypto{n0_r34$0n_t0_b05h3r_w1th_l4rG3_GCD}
```

## 최종 플래그

`crypto{n0_r34$0n_t0_b05h3r_w1th_l4rG3_GCD}`
