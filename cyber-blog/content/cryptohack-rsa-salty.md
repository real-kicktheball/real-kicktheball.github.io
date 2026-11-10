---
{"title":"Salty","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"공개지수 e=1이면 암호문이 평문 정수 그대로다.","section":["CryptoHack","RSA"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/rsa/#salty
- 첨부: [output.txt](https://cryptohack.org/static/challenges/output_95f558e889cc66920c24a961f1fb8181.txt)

## 풀이 원리

공개지수 e=1이면 암호문이 평문 정수 그대로다.

## 최종 풀이 코드

```python
import re, urllib.request
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_95f558e889cc66920c24a961f1fb8181.txt'
data=urllib.request.urlopen(url).read().decode()
params={k:int(v) for k,v in re.findall(r'(?m)^(\w+)\s*=\s*(\d+)\s*$',data)}
n,e,c=params['n'],params['e'],params['ct']

assert e==1
flag=long_to_bytes(c).decode()
assert int.from_bytes(flag.encode(),'big')==c
print(flag)
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. 다시 정수로 바꾸어 암호문과 일치하는지 확인한다.

```text
crypto{saltstack_fell_for_this!}
```

## 최종 플래그

`crypto{saltstack_fell_for_this!}`
