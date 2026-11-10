---
{"title":"No Way Back Home","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"전송된 vka=v·kA, vkb=v·kB, vkakb=v·kA·kB에서 v를 법 q로 복원한다. v는 p의 배수이므로 p 법에서 0이며, 중국인의 나머지 정리로 원래 v를 얻는다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

전송된 vka=v·kA, vkb=v·kB, vkakb=v·kA·kB에서 v를 법 q로 복원한다. v는 p의 배수이므로 p 법에서 0이며, 중국인의 나머지 정리로 원래 v를 얻는다.

## 최종 풀이 코드

```python
import hashlib, re, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/out_549f6bbac5f815ee3f197c2248a352cd.txt'
data=requests.get(url,timeout=20).text
p,q=map(int,re.search(r'p, q = \((\d+), (\d+)\)',data).groups())
v={k:int(x) for k,x in re.findall(r'(?m)^(vka|vkakb|vkb) = (\d+)',data)}
n=p*q
vmodq=v['vka']*v['vkb']*pow(v['vkakb'],-1,q)%q
secret=p*(vmodq*pow(p,-1,q)%q)
assert secret%p==0 and secret%q==vmodq
ct=bytes.fromhex(re.search(r"c = '([0-9a-f]+)'",data).group(1))
key=hashlib.sha256(long_to_bytes(secret)).digest()
flag=unpad(AES.new(key,AES.MODE_ECB).decrypt(ct),16).decode()
assert flag.startswith('crypto{') and flag.endswith('}')
print(flag)
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. 복구한 v의 두 합동 조건, AES 패딩, 플래그 형식을 확인한다.

```text
crypto{1nv3rt1bl3_k3y_3xch4ng3_pr0t0c0l}
```

## 최종 플래그

`crypto{1nv3rt1bl3_k3y_3xch4ng3_pr0t0c0l}`
