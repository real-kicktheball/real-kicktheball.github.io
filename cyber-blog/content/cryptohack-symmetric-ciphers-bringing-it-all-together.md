---
{"title":"Bringing It All Together","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"첨부파일의 16바이트 AES-128 키와 암호문을 읽는다. AES-ECB 단일 블록 복호화는 확장키를 역순으로 적용하는 정규 AES 역라운드와 같다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

첨부파일의 16바이트 AES-128 키와 암호문을 읽는다. AES-ECB 단일 블록 복호화는 확장키를 역순으로 적용하는 정규 AES 역라운드와 같다.

## 최종 풀이 코드

```python
from Crypto.Cipher import AES
key=bytes.fromhex('c32c5ca6b5805e0cdb8da57a2ab6fe5c')
ciphertext=bytes.fromhex('d14f146aa42b4fb6a1c40842298f12dd')
print(AES.new(key,AES.MODE_ECB).decrypt(ciphertext).decode())
```

## 최종 플래그

```text
crypto{MYAES128}
```
