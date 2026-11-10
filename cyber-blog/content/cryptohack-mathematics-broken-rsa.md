---
{"title":"Broken RSA","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"n이 소수이고 e=16이면 d가 존재하지 않는다. 대신 모듈러 제곱근을 네 번 구해서 평문 후보를 찾는다.","section":["CryptoHack","Mathematics"]}
---

## 개념

RSA 복호화에는 $ed \equiv 1 \pmod{\varphi(n)}$인 $d$가 필요하다. 그런데 두 가지가 잘못되면 $d$가 존재하지 않는다.

- $n$이 소수이면 $\varphi(n) = n - 1$이라 짝수다.
- $e = 16$도 짝수라서 $\gcd(e, \varphi(n)) \ne 1$이다.

이럴 때는 $16 = 2^4$라는 점을 쓴다. 16제곱은 제곱을 네 번 한 것이므로 **제곱근을 네 번** 구하면 거꾸로 갈 수 있다.

$$
c = m^{16} = \left(\left(\left(m^2\right)^2\right)^2\right)^2
$$

## 문제

소수 $n$, $e = 16$, 암호문 $c$가 주어진다.

## 풀이

1. $c$의 모든 모듈러 제곱근을 구한다. 각 단계마다 근이 최대 2배로 늘어난다.
2. 이걸 네 번 반복하면 최대 16개의 후보 $m$이 나온다.
3. 그중 바이트로 바꿨을 때 `crypto{`가 들어 있는 후보가 평문이다.

$n$이 $p \equiv 1 \pmod 4$ 형태라서 Tonelli–Shanks(SymPy `sqrt_mod`)로 근을 구했다.

## 풀이 코드
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

## 플래그
`crypto{m0dul4r_squ4r3_r00t}`
