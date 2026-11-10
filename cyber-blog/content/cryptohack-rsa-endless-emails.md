---
{"title":"Endless Emails","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"같은 메시지를 e=3으로 세 명에게 보내면 CRT로 m³을 복원하고 세제곱근을 구할 수 있다(Håstad 브로드캐스트 공격).","section":["CryptoHack","RSA"]}
---

## 개념

**Håstad 브로드캐스트 공격**은 같은 메시지 $m$을 $e = 3$, 패딩 없이 서로 다른 $N_1, N_2, N_3$로 보냈을 때 성립한다.

$$
c_i = m^3 \bmod N_i
$$

1. CRT로 세 식을 합치면 $C \equiv m^3 \pmod{N_1 N_2 N_3}$를 얻는다.
2. $m < N_i$이므로 $m^3 < N_1 N_2 N_3$이다.
3. 따라서 $C = m^3$이 정수로 정확히 성립한다. 세제곱근만 구하면 끝이다.

## 문제

$e = 3$인 공개키 7개와 각각의 암호문이 주어진다. 메시지 내용은 사람마다 다를 수도 있다고 한다.

## 풀이

어떤 세 개가 같은 메시지인지 모른다. 그래서 7개 중 3개를 고르는 조합 35가지를 모두 시도했다.

1. 고른 세 개에 CRT를 적용해 $C$를 만든다.
2. $C$가 정확한 세제곱수인지 확인한다.
3. 세제곱근을 바이트로 바꿨을 때 `crypto{`가 들어 있으면 그게 답이다.

## 풀이 코드
```python
import itertools, math, re, requests
from sympy import integer_nthroot
url='https://cryptohack.org/static/challenges/output_0ef6d6343784e59e2f44f61d2d29896f.txt'
data=requests.get(url,timeout=20).text
N=list(map(int,re.findall(r'(?m)^n = (\d+)',data)))
C=list(map(int,re.findall(r'(?m)^c = (\d+)',data)))
for ix in itertools.combinations(range(len(N)),3):
    ns=[N[i] for i in ix]
    cs=[C[i] for i in ix]
    if any(math.gcd(ns[i],ns[j])!=1 for i in range(3) for j in range(i+1,3)):
        continue
    product=math.prod(ns)
    cube=sum(c*(product//n)*pow(product//n,-1,n) for c,n in zip(cs,ns))%product
    message,exact=integer_nthroot(cube,3)
    if not exact: continue
    raw=message.to_bytes((message.bit_length()+7)//8,'big')
    match=re.search(rb'crypto\{[^}]+\}',raw)
    if match:
        assert all(pow(message,3,N[i])==C[i] for i in ix)
        print(match.group().decode())
        break
else:
    raise ValueError('No shared message')
```

## 플래그
`crypto{1f_y0u_d0nt_p4d_y0u_4r3_Vuln3rabl3}`
