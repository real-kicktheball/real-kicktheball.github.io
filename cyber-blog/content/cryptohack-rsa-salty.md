---
{"title":"Salty","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"공개지수 e=1이면 암호문이 평문 정수 그대로다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

공개지수 e=1이면 암호문이 평문 정수 그대로다.

## 최종 풀이 코드

```python
import re, urllib.request
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_95f558e889cc66920c24a961f1fb8181.txt'
data=urllib.request.urlopen(url).read().decode()
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']

assert e==1
flag=long_to_bytes(c).decode()
assert int.from_bytes(flag.encode(),'big')==c
print(flag)
```

## 최종 플래그

`crypto{saltstack_fell_for_this!}`
