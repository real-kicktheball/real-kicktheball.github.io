---
{"title":"Modes of Operation Starter","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"블록 암호는 한 블록만 처리한다. 긴 데이터를 암호화하려면 운영 모드(ECB, CBC, CTR 등)가 필요하다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

AES는 16바이트 한 블록만 암호화한다. 그보다 긴 메시지는 **운영 모드(mode of operation)**로 블록을 엮어야 한다.

| 모드 | 방식 | 특징 |
|---|---|---|
| ECB | 블록마다 독립적으로 암호화 | 같은 평문 블록 → 같은 암호문 블록 |
| CBC | 이전 암호문 블록과 XOR 후 암호화 | IV 필요, 병렬 암호화 불가 |
| CTR/OFB | 블록 암호로 키스트림을 만들어 XOR | 스트림 암호처럼 동작 |
| GCM | CTR + 인증 태그 | 기밀성 + 무결성 |

CryptoHack의 이 단원은 웹 API로 서버의 암복호화 함수를 호출하면서 진행한다.

## 문제

서버에 `encrypt_flag`(플래그를 ECB로 암호화)와 `decrypt`(같은 키로 ECB 복호화) API가 있다.

## 풀이

`encrypt_flag`로 받은 암호문을 그대로 `decrypt`에 넣으면 플래그 hex가 돌아온다. 복호화 오라클을 그냥 열어두면 안 된다는 걸 보여주는 문제다.

## 풀이 코드
```python
import requests
u='https://aes.cryptohack.org/block_cipher_starter/'
c=requests.get(u+'encrypt_flag/').json()['ciphertext']
p=requests.get(u+'decrypt/'+c+'/').json()['plaintext']
print(bytes.fromhex(p).decode())
```

## 플래그
```text
crypto{bl0ck_c1ph3r5_4r3_f457_!}
```
