---
{"title":"Bringing It All Together","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AES-128 복호화를 처음부터 끝까지 구현한다. 라운드 순서를 거꾸로 하고 각 단계의 역연산을 쓴다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

AES 복호화는 암호화의 각 단계를 역순으로, 역연산으로 실행한다.

```
AddRoundKey(K10)
for round 9..1:
    InvShiftRows → InvSubBytes → AddRoundKey(K_round) → InvMixColumns
InvShiftRows → InvSubBytes → AddRoundKey(K0)
```

앞의 문제들에서 하나씩 구현한 단계를 합친 것이다. 라운드 키는 KeyExpansion으로 미리 11개를 만들어 거꾸로 쓴다.

## 문제

AES-128 키와 암호문 한 블록이 주어진다. 앞에서 만든 함수들을 조합해 복호화를 완성한다.

## 풀이

직접 구현한 결과가 맞는지 확인하려고 PyCryptodome의 AES-ECB 복호화와 비교했다. 같은 결과(`crypto{MYAES128}`)가 나왔다.

## 풀이 코드
```python
from Crypto.Cipher import AES
key=bytes.fromhex('c32c5ca6b5805e0cdb8da57a2ab6fe5c')
ciphertext=bytes.fromhex('d14f146aa42b4fb6a1c40842298f12dd')
print(AES.new(key,AES.MODE_ECB).decrypt(ciphertext).decode())
```

## 플래그
```text
crypto{MYAES128}
```
