---
{"title":"Script Kiddie","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"첨부 코드의 ^는 거듭제곱이 아니라 비트별 XOR다. B = g ^ b에서 b = B ^ g를 바로 얻고, shared = A ^ b를 계산한다. 그 값을 SHA-1로 해시한 앞 16바이트가 AES 키다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/diffie-hellman/#scriptkiddie
- 첨부: [script.py](https://cryptohack.org/static/challenges/script_70449139467b5442a859d310e6945690.py), [output.txt](https://cryptohack.org/static/challenges/output_92cc8b7f0db768b53291efbf969ca3ca.txt)

## 풀이 원리

첨부 코드의 `^`는 거듭제곱이 아니라 비트별 XOR다. `B = g ^ b`에서 `b = B ^ g`를 바로 얻고, `shared = A ^ b`를 계산한다. 그 값을 SHA-1로 해시한 앞 16바이트가 AES 키다.

## 최종 풀이 코드

```python
import ast, hashlib, re, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
url='https://cryptohack.org/static/challenges/output_92cc8b7f0db768b53291efbf969ca3ca.txt'
data=requests.get(url,timeout=20).text
v={k:int(n) for k,n in re.findall(r'(?m)^(p|g|A|B): (\d+)',data)}
b=v['B']^v['g']
assert v['g']^b==v['B']
shared=v['A']^b
iv=ast.literal_eval(re.search(r'(?m)^iv: (.+)',data).group(1))
ct=ast.literal_eval(re.search(r'(?m)^encrypted_flag: (.+)',data).group(1))
key=hashlib.sha1(str(shared).encode()).digest()[:16]
flag=unpad(AES.new(key,AES.MODE_CBC,bytes.fromhex(iv)).decrypt(bytes.fromhex(ct)),16).decode()
assert flag.startswith('crypto{')
print(flag)
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

복원한 `b`로 공개값 B를 재계산해 일치함을 확인했다. AES-CBC 복호화의 PKCS#7 패딩도 유효하다.

```text
crypto{b3_c4r3ful_w1th_y0ur_n0tati0n}
```

## 최종 플래그

`crypto{b3_c4r3ful_w1th_y0ur_n0tati0n}`
