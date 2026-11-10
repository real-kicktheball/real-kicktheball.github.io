---
{"title":"Square Eyes","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"N = p²이면 √N으로 바로 p가 나온다. 이때 φ(N) = p(p-1)이다.","section":["CryptoHack","RSA"]}
---

## 개념

이번엔 $N$을 **같은 소수를 두 번 곱해서** 만들었다: $N = p \times p = p^2$

그러면 그냥 제곱근을 구하면 $p$가 나온다. 쪼개기가 아주 쉽다.

### $\varphi$를 조심하자

$(p - 1) \times (p - 1)$이라고 계산하면 틀린다.

### 직접 해보기 ($N = 9 = 3^2$)

1부터 9까지 중 9와 서로소인 수는 1, 2, 4, 5, 7, 8로 **6개**다. 3의 배수(3, 6, 9)만 빠진다.

- 틀린 계산: $(3 - 1)(3 - 1) = 4$
- 맞는 계산: $3 \times (3 - 1) = 6$ ✔

$$
\varphi(p^2) = p^2 - p = p(p - 1)
$$

$p^2$개 중 $p$의 배수 $p$개만 빼면 되기 때문이다.

### 정리

$N$을 **같은 소수의 제곱** $p^2$으로 만들면 두 가지가 문제다.

1. 정수 제곱근으로 $p$가 바로 나온다.
2. $\varphi(p^2)$을 $(p-1)^2$으로 착각하기 쉽다. 실제 값은 다르다.

$1 \sim p^2$ 중 $p$의 배수는 $p$개다. 그래서 서로소인 수는 다음과 같다.

$$
\varphi(p^2) = p^2 - p = p(p - 1)
$$

## 문제

$N = p^2$, $e$, 암호문이 주어진다.

## 풀이

1. `isqrt(n)`으로 $p$를 구하고 $p^2 = n$인지 확인한다.
2. $\varphi = p(p-1)$로 $d$를 계산해 복호화한다.

## 풀이 코드
```python
import re, urllib.request
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_00dace150c0bc52f7abf03fc3e9529d2.txt'
data=urllib.request.urlopen(url).read().decode()
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']

from math import isqrt
p=isqrt(n)
assert p*p==n
d=pow(e,-1,p*(p-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 플래그
`crypto{squar3_r00t_i5_f4st3r_th4n_f4ct0r1ng!}`
