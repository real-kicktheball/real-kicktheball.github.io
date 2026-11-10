---
{"title":"No Way Back Home","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"비밀값 v가 p의 배수라서 mod n에서는 역원이 없지만, mod q에서는 정상적으로 계산된다. q에서 v를 구한 뒤 CRT로 합친다.","section":["CryptoHack","Mathematics"]}
---

## 개념

곱셈으로 비밀을 가렸다 푸는 "세 번 주고받기" 프로토콜이다($n = pq$).

1. Alice는 $v \cdot k_A$를 보낸다.
2. Bob은 $k_B$를 곱해 $v k_A k_B$를 돌려준다.
3. Alice는 $k_A$를 지워 $v k_B$를 보낸다.

도청자는 세 값을 모두 본다. 그래서 다음 식으로 $v$를 구할 수 있다.

$$
v = \frac{(v k_A)(v k_B)}{v k_A k_B}
$$

다만 이 문제에서는 $v$가 $p$의 배수라 $\bmod n$에서 역원이 없다. 그래서 $\bmod q$와 $\bmod p$로 나눠서 생각해야 한다.

## 문제

$p$, $q$와 도청한 `vka`, `vkb`, `vkakb`, AES 암호문이 주어진다. AES 키는 $v$로 만든다.

## 풀이

1. $\bmod q$에서는 $v$가 0이 아니라 역원이 존재한다. 그래서 $v_q = vka \cdot vkb \cdot vkakb^{-1} \bmod q$로 계산된다.
2. $v$는 $p$의 배수이므로 $v \equiv 0 \pmod p$이다.
3. 두 조건을 CRT로 합쳐 $v = p \cdot (v_q \cdot p^{-1} \bmod q)$를 얻는다.
4. `SHA256(long_to_bytes(v))`를 키로 AES-ECB 복호화하면 플래그가 나온다.

## 풀이 코드
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

## 플래그
`crypto{1nv3rt1bl3_k3y_3xch4ng3_pr0t0c0l}`
