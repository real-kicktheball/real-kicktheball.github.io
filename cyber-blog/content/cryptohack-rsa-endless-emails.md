---
{"title":"Endless Emails","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"서로 다른 수신자에게 같은 메시지를 패딩 없이 공개지수 3으로 암호화했다. 같은 메시지를 가진 암호문 세 개를 찾고 중국인의 나머지 정리로 m³을 각 법의 곱에 대해 복원한다. 메시지 세제곱이 법의 곱보다 작으면 정수 세제곱근으로 원문을 얻…","section":["CryptoHack","RSA"]}
---

## 풀이 원리

서로 다른 수신자에게 같은 메시지를 패딩 없이 공개지수 3으로 암호화했다. 같은 메시지를 가진 암호문 세 개를 찾고 중국인의 나머지 정리로 `m³`을 각 법의 곱에 대해 복원한다. 메시지 세제곱이 법의 곱보다 작으면 정수 세제곱근으로 원문을 얻는다. 세 개의 인덱스 조합을 검사해 정확한 세제곱인 경우를 찾는다.

## 최종 풀이 코드

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

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

복원한 정수 `m`을 각 법에서 다시 세제곱해 선택한 암호문 세 개와 모두 일치함을 확인했다.

```text
crypto{1f_y0u_d0nt_p4d_y0u_4r3_Vuln3rabl3}
```

## 최종 플래그

`crypto{1f_y0u_d0nt_p4d_y0u_4r3_Vuln3rabl3}`
