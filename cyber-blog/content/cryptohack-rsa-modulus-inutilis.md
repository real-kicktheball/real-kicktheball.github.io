---
{"title":"Modulus Inutilis","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"e = 3이고 m³ < N이면 모듈러 연산이 일어나지 않는다. 정수 세제곱근으로 바로 복호화된다.","section":["CryptoHack","RSA"]}
---

## 개념

$e = 3$처럼 작은 지수를 쓰고 패딩이 없다고 하자. 평문이 짧아서 $m^3 < N$이면 $\bmod N$이 아무 의미가 없다.

$$
c = m^3 \bmod N = m^3
$$

암호문이 그냥 정수 세제곱이라 **정수 세제곱근**만 구하면 된다. 실제 RSA는 OAEP 같은 패딩으로 $m$을 $N$ 크기까지 키워서 이걸 막는다.

## 문제

$n$, $e = 3$, 암호문이 주어진다.

## 풀이

`sympy.integer_nthroot(c, 3)`으로 세제곱근을 구한다. 정확히 나누어떨어지는 걸 확인했고, 결과를 바이트로 바꾸면 플래그가 나온다.

## 풀이 코드
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

## 플래그
`crypto{N33d_m04R_p4dd1ng}`
