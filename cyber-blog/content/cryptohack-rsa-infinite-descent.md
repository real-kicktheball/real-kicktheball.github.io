---
{"title":"Infinite Descent","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"p와 q가 너무 가까우면 페르마 인수분해로 바로 깨진다. N = a² - b²로 표현한다.","section":["CryptoHack","RSA"]}
---

## 개념

**페르마 인수분해**는 $N$을 두 제곱수의 차로 쓰는 방법이다.

$$
N = a^2 - b^2 = (a - b)(a + b)
$$

$p$, $q$가 가까우면 $a = \frac{p+q}{2}$는 $\sqrt N$과 거의 같고, $b = \frac{p-q}{2}$는 작다. 그래서 다음 순서로 찾는다.

1. $a = \lceil \sqrt N \rceil$부터 시작한다.
2. $a^2 - N$이 완전제곱수인지 확인한다.
3. 아니면 $a$를 1씩 늘린다.

$p$와 $q$의 차이가 작을수록 몇 번 만에 끝난다.

## 문제

키 생성 코드가 같은 시작값 $r$에서 $p$와 $q$를 조금씩 늘려서 만든다. 그래서 두 소수가 매우 가깝다.

## 풀이

$a = \lceil \sqrt n \rceil$에서 바로 $a^2 - n$이 완전제곱수 $b^2$가 됐다. $p = a + b$, $q = a - b$로 복원해서 복호화했다.

## 풀이 코드
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

## 플래그
`crypto{f3rm47_w45_4_g3n1u5}`
