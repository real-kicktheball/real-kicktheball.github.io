---
{"title":"Modulus Inutilis","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"e = 3이고 m³ < N이면 모듈러 연산이 일어나지 않는다. 정수 세제곱근으로 바로 복호화된다.","section":["CryptoHack","RSA"]}
---

## 개념

나머지를 구하는 이유는 숫자가 $N$을 넘어가면 "빙글 돌아서" 원래 값을 알아볼 수 없게 만들기 위해서다. 그런데 **메시지가 너무 작으면 돌지 않는다**.

### 직접 해보기 ($N = 1000$, $e = 3$)

$m = 7$이면 $7^3 = 343$이다. 343은 1000보다 작아서 나머지를 구해도 그대로 343이다.

$$
c = 343
$$

그러면 그냥 **세제곱근**을 구하면 된다. $\sqrt[3]{343} = 7$이다. 비밀키가 필요 없다.

$\bmod N$("Modulus")이 아무 쓸모가 없어서(Inutilis, 라틴어로 "쓸모없는") 이런 이름이 붙었다.

### 실제 RSA는?

메시지에 **패딩**(랜덤한 채움 값)을 붙여서 $N$만큼 크게 만든 뒤 암호화한다. 그러면 반드시 한 바퀴 이상 돌아서 이런 공격이 안 된다.

### 정리

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
