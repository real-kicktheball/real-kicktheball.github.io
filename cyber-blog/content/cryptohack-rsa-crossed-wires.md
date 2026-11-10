---
{"title":"Crossed Wires","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"친구들이 모두 동일한 법 N에 대해 순차적으로 공개지수 e_i를 적용했다. 주어진 본인 비밀키 d와 공개지수 65537에서 ed−1이 φ(N)의 배수임을 이용해 N을 인수분해한다. 친구들의 지수 곱 E의 φ(N) 법 역원으로 한 번에 복호화…","section":["CryptoHack","RSA"]}
---

## 풀이 원리

친구들이 모두 동일한 법 N에 대해 순차적으로 공개지수 e_i를 적용했다. 주어진 본인 비밀키 d와 공개지수 65537에서 ed−1이 φ(N)의 배수임을 이용해 N을 인수분해한다. 친구들의 지수 곱 E의 φ(N) 법 역원으로 한 번에 복호화한다.

## 최종 풀이 코드

```python
import ast, math, requests
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_434cbf2b937bac1177bed299b2049a92.txt'
data=requests.get(url,timeout=20).text
N,d=ast.literal_eval(data.split('My private key: ')[1].splitlines()[0])
friends=ast.literal_eval(data.split("My Friend's public keys: ")[1].splitlines()[0])
c=int(data.split('Encrypted flag: ')[1].splitlines()[0])
e=65537
k=e*d-1
r,t=k,0
while r%2==0:
    r//=2
    t+=1
p=None
for g in range(2,100):
    x=pow(g,r,N)
    if x in (1,N-1): continue
    for _ in range(t):
        y=pow(x,2,N)
        if y==1:
            z=math.gcd(x-1,N)
            if 1<z<N: p=z
            break
        if y==N-1: break
        x=y
    if p: break
assert p and N%p==0
q=N//p
phi=(p-1)*(q-1)
assert e*d%phi==1
assert all(n==N for n,_ in friends)
E=math.prod(ei for _,ei in friends)
D=pow(E,-1,phi)
m=pow(c,D,N)
assert pow(m,E,N)==c
print(long_to_bytes(m).decode())
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 다시 실행해 아래 결과를 얻었다. 복원한 p,q의 곱, 본인 공개·비밀지수 관계, 모든 친구의 공통 N, 재암호화 결과를 확인한다.

```text
crypto{3ncrypt_y0ur_s3cr3t_w1th_y0ur_fr1end5_publ1c_k3y}
```

## 최종 플래그

`crypto{3ncrypt_y0ur_s3cr3t_w1th_y0ur_fr1end5_publ1c_k3y}`
