---
{"title":"Marin's Secrets","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"소수를 메르센 소수(2^k - 1)에서만 고르면 후보가 수십 개뿐이라 하나씩 나눠보면 된다.","section":["CryptoHack","RSA"]}
---

## 개념

**메르센 소수**는 $2^k - 1$ 모양의 소수다.

| $k$ | $2^k - 1$ | 소수? |
|---:|---:|---|
| 2 | 3 | ✔ |
| 3 | 7 | ✔ |
| 4 | 15 | ✘ ($3 \times 5$) |
| 5 | 31 | ✔ |
| 7 | 127 | ✔ |

메르센 소수는 아주 드물다. 지금까지 발견된 게 50개 정도뿐이고, 목록이 인터넷에 다 공개돼 있다.

### 이 문제에서

RSA의 소수를 메르센 소수 중에서만 골랐다. 그러면 후보가 50개 정도밖에 안 된다. 목록에 있는 메르센 소수로 $N$을 하나씩 나눠보면 금방 찾는다.

### 직접 해보기

$N = 7 \times 31 = 217$이라면 3으로 나눠보고(✘), 7로 나눠보면 나누어떨어진다. $217 \div 7 = 31$이고, 31도 메르센 소수다($2^5 - 1$).

### 정리

**메르센 소수**는 $M_k = 2^k - 1$ 꼴의 소수다. 알려진 메르센 소수는 50여 개뿐이고 지수 목록도 공개돼 있다.

$$
k = 2, 3, 5, 7, 13, 17, 19, 31, 61, 89, 107, 127, 521, 607, 1279, \dots
$$

RSA 소수를 이 중에서 고르면 후보가 너무 적어서 하나씩 나눠보면 끝이다.

## 문제

키 생성 함수가 $2^k - 1$ 형태 소수만 만든다. $n$, $e$, $c$가 주어진다.

## 풀이

1. 메르센 소수 지수 목록으로 $2^k - 1$을 만들어 $n$을 나눠본다.
2. 나누어떨어지는 $p$를 찾으면 $q = n / p$이다.
3. $q$도 $2^j - 1$ 형태인지 확인했다(`q & (q+1) == 0`).
4. 이후 일반 RSA처럼 복호화한다.

## 풀이 코드
```python
import re, requests
from Crypto.Util.number import long_to_bytes, isPrime
url='https://cryptohack.org/static/challenges/output_f194012343666ced1a6699d196c8adc5.txt'
data=requests.get(url,timeout=20).text
v={k:int(x) for k,x in re.findall(r'(?m)^([nec]): (\d+)',data)}
n,e,c=v['n'],v['e'],v['c']
exponents=[2,3,5,7,13,17,19,31,61,89,107,127,521,607,1279,2203,2281,3217,4253]
p=next((1<<k)-1 for k in exponents if n%((1<<k)-1)==0)
q=n//p
assert q&(q+1)==0 and isPrime(p) and isPrime(q)
assert p*q==n
d=pow(e,-1,(p-1)*(q-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 플래그
`crypto{Th3se_Pr1m3s_4r3_t00_r4r3}`
