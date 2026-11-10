---
{"title":"Salty","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"e = 1이면 c = m mod N이라 암호화가 전혀 되지 않는다.","section":["CryptoHack","RSA"]}
---

## 개념

RSA 암호화는 $m$을 $e$번 곱하는 것이다. 그런데 $e = 1$이면 **한 번만 곱한다**. 한 번 곱한 건 원래 그대로다.

$$
c = m^1 = m
$$

자물쇠를 채웠다고 생각했는데 실제로는 아무것도 안 잠근 셈이다. 암호문이 곧 평문이다.

### 직접 해보기

$m = 4$, $e = 1$, $N = 33$이면 $c = 4^1 \bmod 33 = 4$다. 암호문을 그대로 글자로 바꾸면 평문이 나온다.

실제로 SaltStack이라는 프로그램이 이런 실수를 한 적이 있다. 그래서 문제 이름이 Salty다.

### 정리

$e = 1$이면 암호화가 아무것도 하지 않는다.

$$
c = m^1 \bmod N = m \qquad (m < N)
$$

$e$가 작을수록 암호화가 빠르지만, 너무 작으면 이런 문제가 생긴다. SaltStack이 실제로 RSA 공개 지수를 1로 설정한 버그를 냈던 적이 있다(플래그가 그 이야기다).

## 문제

$n$, $e = 1$, 암호문이 주어진다.

## 풀이

암호문 정수를 그대로 바이트로 바꾸면 평문이 나온다.

## 풀이 코드
```python
import re, urllib.request
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_95f558e889cc66920c24a961f1fb8181.txt'
data=urllib.request.urlopen(url).read().decode()
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']

assert e==1
flag=long_to_bytes(c).decode()
assert int.from_bytes(flag.encode(),'big')==c
print(flag)
```

## 플래그
`crypto{saltstack_fell_for_this!}`
