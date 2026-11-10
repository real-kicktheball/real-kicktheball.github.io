---
{"title":"Passwords as Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"사람이 고른 단어로 키를 만들면 키 공간이 단어 수만큼으로 줄어든다. 사전 공격으로 깨진다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

AES-128 키는 $2^{128}$가지라 브루트포스가 불가능하다. 단, 키가 **완전히 랜덤일 때** 이야기다.

키를 `MD5(단어)`처럼 만들면 키 공간은 사전에 있는 단어 수(수만~수십만 개)로 줄어든다. 해시는 키 길이만 맞춰줄 뿐 엔트로피를 늘려주지 않는다. 비밀번호에서 키를 만들 때는 솔트와 반복을 넣은 PBKDF2, scrypt, Argon2 같은 키 유도 함수를 써야 한다.

## 문제

서버가 `/usr/share/dict/words`에서 단어 하나를 골라 MD5로 키를 만들고 플래그를 AES-ECB로 암호화한다.

## 풀이

1. 같은 단어 목록을 받는다.
2. 모든 단어에 대해 `MD5(word)`를 키로 복호화를 시도한다.
3. 결과가 `crypto{`로 시작하는 단어가 키다. 몇 초면 찾는다.

## 풀이 코드
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

## 플래그
```text
crypto{k3y5__r__n07__p455w0rdz?}
```
