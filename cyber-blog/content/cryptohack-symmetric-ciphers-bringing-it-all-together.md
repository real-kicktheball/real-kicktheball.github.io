---
{"title":"Bringing It All Together","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"첨부파일의 16바이트 AES-128 키와 암호문을 읽는다. AES-ECB 단일 블록 복호화는 확장키를 역순으로 적용하는 정규 AES 역라운드와 같다.","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [Bringing It All Together](https://cryptohack.org/challenges/aes/#aes6)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)
- [aes_decrypt.py](https://cryptohack.org/static/challenges/aes_decrypt_f491744105801ec03d6a6f7a0e7f8101.py)
- [LICENSE](https://cryptohack.org/static/challenges/LICENSE_651b0602addd2b4bfa5d69ad7fca2dd5)

## 풀이 원리

첨부파일의 16바이트 AES-128 키와 암호문을 읽는다. AES-ECB 단일 블록 복호화는 확장키를 역순으로 적용하는 정규 AES 역라운드와 같다.

## 최종 풀이 코드

```python
from Crypto.Cipher import AES
key=bytes.fromhex('c32c5ca6b5805e0cdb8da57a2ab6fe5c')
ciphertext=bytes.fromhex('d14f146aa42b4fb6a1c40842298f12dd')
print(AES.new(key,AES.MODE_ECB).decrypt(ciphertext).decode())
```

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

## 최종 플래그

```text
crypto{MYAES128}
```
