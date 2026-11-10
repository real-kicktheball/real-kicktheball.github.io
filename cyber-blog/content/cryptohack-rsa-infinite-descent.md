---
{"title":"Infinite Descent","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"p와 q를 같은 임의의 2048비트 정수 r에서 조금씩 증가시켰으므로 두 소수가 극히 가깝다. Fermat 인수분해에서 ceil(√n)의 제곱과 n의 차가 즉시 완전제곱수가 된다.","section":["CryptoHack","RSA"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/rsa/#infinite_descent
- 첨부: [output.txt](https://cryptohack.org/static/challenges/output_14f82a67efe7b7edffb810dbb7ab5f27.txt)

## 풀이 원리

p와 q를 같은 임의의 2048비트 정수 r에서 조금씩 증가시켰으므로 두 소수가 극히 가깝다. Fermat 인수분해에서 ceil(√n)의 제곱과 n의 차가 즉시 완전제곱수가 된다.

## 최종 풀이 코드

```python
import math, re, requests
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_14f82a67efe7b7edffb810dbb7ab5f27.txt'
data=requests.get(url,timeout=20).text
v={k:int(x) for k,x in re.findall(r'(?m)^(n|e|c) = (\d+)',data)}
n,e,c=v['n'],v['e'],v['c']
a=math.isqrt(n)
if a*a<n: a+=1
while True:
    b=math.isqrt(a*a-n)
    if b*b==a*a-n: break
    a+=1
p,q=a+b,a-b
assert p*q==n
d=pow(e,-1,(p-1)*(q-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. p·q=n과 RSA 재암호화 결과를 확인했다.

```text
crypto{f3rm47_w45_4_g3n1u5}
```

## 최종 플래그

`crypto{f3rm47_w45_4_g3n1u5}`
