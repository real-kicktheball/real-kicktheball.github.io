---
{"title":"Flipping Cookie","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CBC 첫 평문 블록은 D_K(C_1) XOR IV이다. IV의 False 위치에 차분을 XOR하면 복호화 결과가 True;로 바뀐다. 뒤의 원래 세미콜론이 남아도 admin=True가 독립 항목으로 인식된다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

CBC 첫 평문 블록은 `D_K(C_1) XOR IV`이다. IV의 `False` 위치에 차분을 XOR하면 복호화 결과가 `True;`로 바뀐다. 뒤의 원래 세미콜론이 남아도 `admin=True`가 독립 항목으로 인식된다.

## 최종 풀이 코드

```python
import requests
u='https://aes.cryptohack.org/flipping_cookie/'
c=bytes.fromhex(requests.get(u+'get_cookie/').json()['cookie'])
iv=bytearray(c[:16])
for i,(a,b) in enumerate(zip(b'False',b'True;')):
    iv[6+i]^=a^b
print(requests.get(u+'check_admin/'+c[16:].hex()+'/'+iv.hex()+'/').json()['flag'])
```

## 최종 플래그

```text
crypto{4u7h3n71c4710n_15_3553n714l}
```
