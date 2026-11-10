---
{"title":"Passwords as Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"키는 /usr/share/dict/words의 단어 하나를 MD5 해시한 값이다. 공개 단어 목록의 모든 후보에 대해 MD5→AES-ECB 복호화를 시도해 플래그 형식을 찾는다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

키는 `/usr/share/dict/words`의 단어 하나를 MD5 해시한 값이다. 공개 단어 목록의 모든 후보에 대해 MD5→AES-ECB 복호화를 시도해 플래그 형식을 찾는다.

## 최종 풀이 코드

```python
import requests,hashlib
from Crypto.Cipher import AES
u='https://aes.cryptohack.org/passwords_as_keys/'
c=bytes.fromhex(requests.get(u+'encrypt_flag/').json()['ciphertext'])
words=requests.get('https://gist.githubusercontent.com/wchargin/8927565/raw/d9783627c731268fb2935a731a618aa8e95cf465/words').text.splitlines()
for word in words:
    p=AES.new(hashlib.md5(word.encode()).digest(),AES.MODE_ECB).decrypt(c)
    if p.startswith(b'crypto{'):
        print('password:',word,'flag:',p.decode());break
```

## 최종 플래그

```text
crypto{k3y5__r__n07__p455w0rdz?}
```
