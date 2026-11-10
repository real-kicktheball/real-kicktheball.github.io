---
{"title":"Triple DES","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"두 DES 약한 키는 각각 암호화가 자기 역연산이다. 두 키를 조합한 2-key Triple DES도 자기 역연산이므로 encrypt_flag 결과를 같은 키의 encrypt에 다시 넣으면 원문이 나온다. 서비스의 IV 전후 XOR도 이 성…","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

두 DES 약한 키는 각각 암호화가 자기 역연산이다. 두 키를 조합한 2-key Triple DES도 자기 역연산이므로 `encrypt_flag` 결과를 같은 키의 `encrypt`에 다시 넣으면 원문이 나온다. 서비스의 IV 전후 XOR도 이 성질을 유지한다.

## 최종 풀이 코드

```python
import requests
from Crypto.Util.Padding import unpad
u='https://aes.cryptohack.org/triple_des/'
key='0101010101010101fefefefefefefefe'
c=requests.get(u+'encrypt_flag/'+key+'/').json()['ciphertext']
p=requests.get(u+'encrypt/'+key+'/'+c+'/').json()['ciphertext']
print(unpad(bytes.fromhex(p),8).decode())
```

## 최종 플래그

```text
crypto{n0t_4ll_k3ys_4r3_g00d_k3ys}
```
