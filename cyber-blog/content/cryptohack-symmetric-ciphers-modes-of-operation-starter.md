---
{"title":"Modes of Operation Starter","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"서버의 encrypt_flag로 암호문을 받은 뒤 동일 키의 ECB decrypt API에 그대로 전달한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

서버의 `encrypt_flag`로 암호문을 받은 뒤 동일 키의 ECB `decrypt` API에 그대로 전달한다.

## 최종 풀이 코드

```python
import requests
u='https://aes.cryptohack.org/block_cipher_starter/'
c=requests.get(u+'encrypt_flag/').json()['ciphertext']
p=requests.get(u+'decrypt/'+c+'/').json()['plaintext']
print(bytes.fromhex(p).decode())
```

## 최종 플래그

```text
crypto{bl0ck_c1ph3r5_4r3_f457_!}
```
