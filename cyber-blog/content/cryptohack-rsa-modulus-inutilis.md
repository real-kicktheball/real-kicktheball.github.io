---
{"title":"Modulus Inutilis","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"e=3이고 메시지가 법에 비해 짧아 c=m³가 모듈러 환원되지 않았다. 정수 세제곱근을 취한다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

e=3이고 메시지가 법에 비해 짧아 c=m³가 모듈러 환원되지 않았다. 정수 세제곱근을 취한다.

## 최종 풀이 코드

```python
import re, urllib.request
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_30cff153b7432055fc947fc5abdb57d3.txt'
data=urllib.request.urlopen(url).read().decode()
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']

from sympy import integer_nthroot
assert e==3
m,exact=integer_nthroot(c,3)
assert exact and m**3==c
print(long_to_bytes(m).decode())
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. 복원한 m의 세제곱이 암호문 c와 정확히 일치한다.

```text
crypto{N33d_m04R_p4dd1ng}
```

## 최종 플래그

`crypto{N33d_m04R_p4dd1ng}`
