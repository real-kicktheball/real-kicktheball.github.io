---
{"title":"Exceptional Curves","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"곡선의 점 개수가 p와 같은 anomalous curve는 Smart 공격(p-adic lifting)으로 ECDLP가 선형 시간에 풀린다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

곡선 위 점의 개수 $\#E(\mathbb{F}_p)$가 정확히 $p$와 같으면 **anomalous curve**(trace가 1인 곡선)라 한다. 위수가 큰 소수라 Pohlig–Hellman은 안 통하지만, 다른 약점이 있다.

**Smart 공격**은 다음 순서로 동작한다.

1. 곡선과 점을 $p$진수 $\mathbb{Q}_p$로 끌어올린다(Hensel lifting).
2. $p$를 곱해 형식군(formal group)으로 보낸다.
3. 거기서 로그가 단순한 나눗셈이 된다.

$$
k = \frac{\psi_p(pQ)}{\psi_p(pG)} \bmod p
$$

ECC 표준이 곡선을 고를 때 $\#E \ne p$를 확인하는 이유다.

## 문제

곡선 파라미터, 생성점, 두 사람의 공개점, 암호문이 주어진다.

## 풀이

1. SageMath로 `E.order()`를 계산하면 $p$와 같다. anomalous curve다.
2. `A.log(G)`가 이 경우 Smart 공격으로 바로 로그를 구한다.
3. 공유점으로 키를 만들어 AES-CBC를 복호화했다. 플래그도 "Hensel lift"다.

## 풀이 코드
```python
from sage.all import *
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import hashlib,re,ast
import requests
src=requests.get('https://cryptohack.org/static/challenges/source_51cefb9344efd163a8f0c62470aac279.sage',timeout=20).text
out=requests.get('https://cryptohack.org/static/challenges/output_db96ba0b779440f32de9b556d0514b35.txt',timeout=20).text
p,a,b=[int(re.search(r'^\s*'+name+r' = (0x[0-9a-f]+)',src,re.M).group(1),16) for name in ('p','a','b')]
E=EllipticCurve(GF(p),[a,b]);assert E.order()==p
coords=[tuple(map(int,x)) for x in re.findall(r'\((\d+) : (\d+) : 1\)',out)]
G,A=map(lambda xy:E(*xy),coords)
B=E(*[int(re.search(r'^\s*'+name+r' = (0x[0-9a-f]+)',src,re.M).group(1),16) for name in ('b_x','b_y')])

n=A.log(G);assert n*G==A
v=ast.literal_eval(re.search(r'(\{.*\})',out).group(1))
key=hashlib.sha1(str(int((n*B)[0])).encode()).digest()[:16]
print(unpad(AES.new(key,AES.MODE_CBC,bytes.fromhex(v['iv'])).decrypt(bytes.fromhex(v['encrypted_flag'])),16).decode())

```

## 플래그
`crypto{H3ns3l_lift3d_my_fl4g!}`
