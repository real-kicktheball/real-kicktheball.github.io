---
{"title":"Monoprime","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"RSA 법 n 자체가 소수이므로 φ(n)=n−1이다. e의 역원을 구해 복호화한다.","section":["CryptoHack","RSA"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/rsa/#monoprime
- 첨부: [output.txt](https://cryptohack.org/static/challenges/output_086036e35349a406b94bfac9a7af6cca.txt)

## 풀이 원리

RSA 법 n 자체가 소수이므로 φ(n)=n−1이다. e의 역원을 구해 복호화한다.

## 최종 풀이 코드

```python
import re, urllib.request
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_086036e35349a406b94bfac9a7af6cca.txt'
data=urllib.request.urlopen(url).read().decode()
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']

from sympy import isprime
assert isprime(n)
d=pow(e,-1,n-1)
m=pow(c,d,n)
assert pow(m,e,n)==c
flag=long_to_bytes(m).decode()
print(flag)
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. 재암호화한 정수가 원래 암호문과 같은지 확인한다.

```text
crypto{0n3_pr1m3_41n7_pr1m3_l0l}
```

## 최종 플래그

`crypto{0n3_pr1m3_41n7_pr1m3_l0l}`
