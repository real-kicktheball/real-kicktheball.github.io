---
{"title":"Crossed Wires","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"같은 N을 공유하는 상황에서 내 (e, d)를 알면 N이 인수분해된다. 친구들의 공개키로 여러 번 암호화한 것도 한 번에 푼다.","section":["CryptoHack","RSA"]}
---

## 개념

같은 $N$을 여러 사람이 공유하면 안 된다. 내 $e$, $d$만 알아도 $N$을 인수분해할 수 있기 때문이다.

$ed - 1 = k\varphi(N)$이라서 $ed - 1$은 $\varphi(N)$의 배수다. 이걸 $2^t \cdot r$로 쓴다($r$은 홀수). 그러면 임의의 $g$에 대해 $g^{2^t r} \equiv 1$이 된다.

1. $x = g^r$에서 시작한다.
2. 제곱을 반복하다가 처음 1이 되는 순간을 찾는다.
3. 그 직전 값은 **1의 비자명한 제곱근**이고, $\gcd(x - 1, N)$이 인수가 된다.

## 문제

내 개인키 $(N, d)$와 친구 5명의 공개 지수 $e_i$(모두 같은 $N$)가 주어진다. 플래그는 친구들의 키로 차례대로 암호화돼 있다.

## 풀이

1. 내 $e = 65537$, $d$로 위 방법을 써서 $N = pq$를 인수분해한다.
2. 암호화는 지수를 차례로 곱한 것과 같다. $E = \prod e_i$로 두면 $c = m^{E}$이다.
3. $D = E^{-1} \bmod \varphi(N)$으로 한 번에 복호화한다.

## 풀이 코드
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

## 플래그
`crypto{3ncrypt_y0ur_s3cr3t_w1th_y0ur_fr1end5_publ1c_k3y}`
