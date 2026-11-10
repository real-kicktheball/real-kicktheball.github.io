---
{"title":"Common Ground","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"gcd(N^a - 1, N^b - 1) = N^gcd(a,b) - 1 성질을 쓰면 엄청나게 큰 수의 GCD를 직접 계산하지 않고도 구할 수 있다.","section":["CryptoHack","Mathematics"]}
---

## 개념

$N^a - 1$과 $N^b - 1$의 최대공약수는 지수의 최대공약수로 정해진다.

$$
\gcd(N^a - 1,\ N^b - 1) = N^{\gcd(a, b)} - 1
$$

이유는 유클리드 알고리즘과 같은 구조이기 때문이다. $a = kb + r$이면 다음 식이 성립한다.

$$
N^a - 1 = N^r(N^{kb} - 1) + (N^r - 1)
$$

$N^{kb} - 1$은 $N^b - 1$로 나누어떨어진다. 그래서 $\gcd(N^a-1, N^b-1) = \gcd(N^b-1, N^r-1)$이 된다. 지수에서 유클리드 알고리즘을 그대로 돌리는 셈이다.

## 문제

$N$, $a$, $b$와 AES-CBC 암호문이 주어진다. AES 키는 $\gcd(N^a - 1, N^b - 1)$의 SHA-256에서 만들어진다. $a$, $b$가 매우 커서 $N^a$를 직접 계산할 수 없다.

## 풀이

1. 지수끼리만 $\gcd(a, b)$를 구한다.
2. $g = N^{\gcd(a,b)} - 1$을 계산한다.
3. `SHA256(long_to_bytes(g))`의 앞 16바이트를 키로 AES-CBC 복호화하면 플래그가 나온다.

## 풀이 코드
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

## 플래그
`crypto{n0_r34$0n_t0_b05h3r_w1th_l4rG3_GCD}`
