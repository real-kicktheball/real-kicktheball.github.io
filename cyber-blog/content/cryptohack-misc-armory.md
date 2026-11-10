---
{"title":"Armory","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"Shamir 3-of-7처럼 보이지만 다항식 계수가 난수가 아니라 앞선 계수의 SHA-256으로 만들어진다. 제공된 몫은 첫 번째 몫이고, 그 x 좌표는 SHA256(secret)이다. 따라서 세 번째 계수는 SHA256(x)로 직접 계산할…","section":["CryptoHack","Misc"]}
---

## 풀이 방법

Shamir 3-of-7처럼 보이지만 다항식 계수가 난수가 아니라 앞선 계수의 SHA-256으로 만들어진다. 제공된 몫은 첫 번째 몫이고, 그 $x$ 좌표는 `SHA256(secret)`이다. 따라서 세 번째 계수는 `SHA256(x)`로 직접 계산할 수 있다. $y=secret+x^2+H(x)x^2\pmod p$에서 상수항 `secret`을 역산한다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. 네트워크가 필요한 코드는 공식 서버에 접속한다.

```python
from ast import literal_eval
from hashlib import sha256
from urllib.request import urlopen

URL="https://cryptohack.org/static/challenges/share_f6dca6a2f215b12ddebb68a90380542d.txt"
x,y=literal_eval(urlopen(URL).read().decode())
p=77793805322526801978326005188088213205424384389488111175220421173086192558047
next_coef=int.from_bytes(sha256(x.to_bytes(32,'big')).digest(),'big')
secret=(y-x*x-next_coef*x*x)%p
flag=secret.to_bytes((secret.bit_length()+7)//8,'big')
assert int.from_bytes(sha256(flag).digest(),'big')==x
print(flag.decode())
```

## 검증 방법

코드의 출력이 아래 플래그와 같은지 확인한다. Armory에서는 $x=SHA256(secret)$ 검사도 수행한다.

## 최종 플래그

```text
crypto{fr46m3n73d_b4ckup_vuln?}
```
