---
{"title":"Monoprime","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"N이 소수 하나뿐이면 φ(N) = N - 1이라 누구나 개인키를 계산할 수 있다.","section":["CryptoHack","RSA"]}
---

## 개념

RSA는 **두 소수의 곱**을 써야 한다. 그런데 이 문제는 $N$을 **소수 하나**로 만들었다.

소수는 더 이상 쪼갤 게 없다. "쪼개기 어렵다"는 전제 자체가 사라진다. 소수 $p$의 $\varphi$는 아주 간단하다.

$$
\varphi(p) = p - 1
$$

1부터 $p$까지 중 $p$ 자신만 빼고 다 서로소이기 때문이다.

### 직접 해보기 ($N = 11$, 소수)

$\varphi(11) = 10$이다. $e = 3$이면 $3 \times 7 = 21 = 2 \times 10 + 1$이라 $d = 7$이다.

공개된 정보만으로 비밀키를 계산했다. 비밀이 하나도 없는 셈이다.

### 정리

RSA가 안전한 이유는 $\varphi(N)$을 계산하려면 인수분해가 필요하기 때문이다. 그런데 $N$이 **소수**이면 이 전제가 무너진다.

$$
\varphi(N) = N - 1
$$

인수분해 없이 공개값만으로 $d = e^{-1} \bmod (N-1)$을 바로 구할 수 있다.

## 문제

$n$, $e$, 암호문이 주어지는데 $n$이 소수 하나다.

## 풀이

$n$이 소수인지 확인하고 $d = e^{-1} \bmod (n-1)$을 계산한다. $m = c^d \bmod n$이 플래그다.

## 풀이 코드
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

## 플래그
`crypto{0n3_pr1m3_41n7_pr1m3_l0l}`
