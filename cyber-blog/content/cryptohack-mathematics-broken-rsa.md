---
{"title":"Broken RSA","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"e=16이며 법 n은 소수다. 암호문을 네 차례 모듈러 제곱근으로 되돌리면 가능한 평문 후보가 나온다. 원문이 문장으로 시작하므로 플래그 패턴을 포함한 후보를 선택한다.","section":["CryptoHack","Mathematics"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/maths/#broken-rsa
- 첨부: [broken_rsa.txt](https://cryptohack.org/static/challenges/broken_rsa_34db5007b0788a5cd306f3bd47e9ca71.txt)

## 풀이 원리

e=16이며 법 n은 소수다. 암호문을 네 차례 모듈러 제곱근으로 되돌리면 가능한 평문 후보가 나온다. 원문이 문장으로 시작하므로 플래그 패턴을 포함한 후보를 선택한다.

## 최종 풀이 코드

```python
import re, requests
from sympy import isprime, sqrt_mod
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/broken_rsa_34db5007b0788a5cd306f3bd47e9ca71.txt'
data=requests.get(url,timeout=20).text
v={k:int(x) for k,x in re.findall(r'(?m)^(n|e|ct) = (\d+)',data)}
n,e,c=v['n'],v['e'],v['ct']
assert isprime(n) and e==16
roots={c}
for _ in range(4):
    roots={int(x) for y in roots for x in sqrt_mod(y,n,all_roots=True)}
m=next(x for x in roots if b'crypto{' in long_to_bytes(x))
assert pow(m,e,n)==c
flag=re.search(rb'crypto\{[^}]+\}',long_to_bytes(m)).group().decode()
print(flag)
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. 평문 후보를 다시 16제곱해 암호문과 일치하는지 검사한다. 문장 내부에서 플래그를 추출한다.

```text
crypto{m0dul4r_squ4r3_r00t}
```

## 최종 플래그

`crypto{m0dul4r_squ4r3_r00t}`
