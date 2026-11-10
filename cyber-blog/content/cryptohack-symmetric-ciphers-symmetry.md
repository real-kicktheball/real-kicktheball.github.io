---
{"title":"Symmetry","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"OFB 모드는 같은 키와 IV로 암호화 함수를 다시 호출하면 XOR 키스트림이 상쇄된다. 반환된 첫 16바이트가 IV이다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

OFB 모드는 같은 키와 IV로 암호화 함수를 다시 호출하면 XOR 키스트림이 상쇄된다. 반환된 첫 16바이트가 IV이다.

## 최종 풀이 코드

```python
import requests
u='https://aes.cryptohack.org/symmetry/'
c=bytes.fromhex(requests.get(u+'encrypt_flag/').json()['ciphertext'])
p=requests.get(u+'encrypt/'+c[16:].hex()+'/'+c[:16].hex()+'/').json()['ciphertext']
print(bytes.fromhex(p).decode())
```

## 최종 플래그

```text
crypto{0fb_15_5ymm37r1c4l_!!!11!}
```
