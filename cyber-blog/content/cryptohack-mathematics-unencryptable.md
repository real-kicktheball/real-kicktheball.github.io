---
{"title":"Unencryptable","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"RSA 고정점 m^e ≡ m (mod N)이 주어지면 1의 비자명한 제곱근을 만들 수 있어 N이 인수분해된다.","section":["CryptoHack","Mathematics"]}
---

## 개념

RSA로 암호화해도 **값이 변하지 않는 메시지**가 있다. 이걸 **고정점**이라 한다.

$$
m^e \equiv m \pmod N
$$

예를 들어 $m = 0$이나 $m = 1$은 몇 번을 제곱해도 그대로다. 그런데 이 문제는 0도 1도 아닌 이상한 고정점을 주는데, 이게 $N$을 쪼개는 힌트가 된다.

### "1의 이상한 제곱근" 찾기

보통 제곱해서 1이 되는 수는 1과 $-1$이다. 그런데 $N$이 두 소수의 곱이면 **제곱해서 1이 되는 다른 수**가 있다.

### 직접 해보기 ($N = 15 = 3 \times 5$)

$4^2 = 16 = 15 + 1$이라서 $4^2 \equiv 1 \pmod{15}$이다. 4는 1도 아니고 $-1(=14)$도 아니다.

$$
4^2 - 1 = (4 - 1)(4 + 1) = 3 \times 5 = 15
$$

$\gcd(4 - 1, 15) = \gcd(3, 15) = 3$, $\gcd(4 + 1, 15) = 5$다. $N$이 쪼개졌다.

### 이 문제에서

고정점 $m$을 계속 제곱하면 언젠가 1이 된다. 그 직전 값이 위의 4 같은 "이상한 제곱근"이다. 그걸로 최대공약수를 구하면 $p$, $q$가 나온다.

### 정리

$m^e \equiv m \pmod N$을 만족하는 $m$을 RSA의 **고정점**이라 한다. 양변을 $m$으로 나누면 다음 식이 된다.

$$
m^{e-1} \equiv 1 \pmod N
$$

$e = 65537$이면 $e - 1 = 2^{16}$이다. 그래서 $m, m^2, m^4, \dots$로 제곱을 반복하다 보면 어느 순간 1이 된다. 바로 그 직전 값 $x$는 다음 조건을 만족한다.

$$
x^2 \equiv 1, \qquad x \not\equiv \pm 1 \pmod N
$$

이런 $x$를 **1의 비자명한 제곱근**이라 한다. $x^2 - 1 = (x-1)(x+1) \equiv 0$인데 어느 쪽도 $N$의 배수가 아니다. 따라서 $\gcd(x - 1, N)$이 $p$나 $q$가 된다.

## 문제

$N$, $e$, 암호문 $c$와 함께 소스 코드의 `DATA`가 주어진다. `DATA`는 암호화해도 값이 그대로인 고정점이다.

## 풀이

1. `DATA`를 정수로 바꿔 $\text{DATA}^e \bmod N = \text{DATA}$인 것을 확인했다.
2. 원래는 위 방법으로 인수분해하는 게 의도된 풀이다.
3. 내 풀이 코드에서는 이 $N$이 FactorDB에 등록돼 있어서 인수를 조회해서 썼다.
4. $p$, $q$를 얻은 뒤 $d = e^{-1} \bmod (p-1)(q-1)$로 복호화한다.

## 풀이 코드
```python
import math, re, requests
from Crypto.Util.number import long_to_bytes
source_url='https://cryptohack.org/static/challenges/source_b1dbaf88b6cbdfcc484a693074e668d1.py'
output_url='https://cryptohack.org/static/challenges/output_d8d7a60bdc52b56d3be6f24a000f40cd.txt'
source=requests.get(source_url,timeout=20).text
data=requests.get(output_url,timeout=20).text
v={k:int(x,0) for k,x in re.findall(r'(?m)^([Nec]+) = (0x[0-9a-f]+|\d+)',data)}
n,e,c=v['N'],v['e'],v['c']
known=int(re.search(r'DATA = bytes.fromhex\("([0-9a-f]+)"\)',source).group(1),16)
assert pow(known,e,n)==known
r=requests.get('https://factordb.com/api',params={'query':str(n)},timeout=20)
r.raise_for_status()
factors=[int(p) for p,mult in r.json()['factors'] for _ in range(mult)]
assert len(factors)==2 and math.prod(factors)==n
p,q=factors
d=pow(e,-1,(p-1)*(q-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 플래그
`crypto{R3m3mb3r!_F1x3d_P0iNts_aR3_s3crE7s_t00}`
