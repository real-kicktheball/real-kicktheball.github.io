---
{"title":"Exceptional Curves","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"군의 차수를 직접 계산하면 #E(Fp)=p인 anomalous curve다. 소수 차수라도 Smart의 p-adic lifting 공격으로 ECDLP가 풀린다. Sage의 점 .log()가 이를 처리하며 복원된 개인키로 ECDH와 AES-C…","section":["CryptoHack","Elliptic Curves"]}
---

## 풀이 원리

군의 차수를 직접 계산하면 `#E(Fp)=p`인 anomalous curve다. 소수 차수라도 Smart의 p-adic lifting 공격으로 ECDLP가 풀린다. Sage의 점 `.log()`가 이를 처리하며 복원된 개인키로 ECDH와 AES-CBC 복호화를 수행한다.

## 최종 풀이 코드

`SageMath`와 Sage의 Python 환경에 `pycryptodome`, `requests`가 필요하다. `sage -python solve.py`로 실행한다.

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

## 검증 방법

코드의 `assert`가 성립하고 아래 출력이 나오는지 확인한다. AES 문제에서는 PKCS#7 패딩 해제가 성공해야 한다.

```text
crypto{H3ns3l_lift3d_my_fl4g!}
```

## 최종 플래그

`crypto{H3ns3l_lift3d_my_fl4g!}`
