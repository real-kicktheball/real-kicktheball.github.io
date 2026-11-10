---
{"title":"ECB CBC WTF","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CBC의 P_i=D_K(C_i) XOR C_(i-1) 식을 사용한다. 주어진 ECB 복호화 API로 각 CBC 암호 블록의 D_K(C_i)를 구한 뒤 앞 블록 또는 IV와 XOR한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

CBC의 `P_i=D_K(C_i) XOR C_(i-1)` 식을 사용한다. 주어진 ECB 복호화 API로 각 CBC 암호 블록의 `D_K(C_i)`를 구한 뒤 앞 블록 또는 IV와 XOR한다.

## 최종 풀이 코드

```python
import requests
u='https://aes.cryptohack.org/ecbcbcwtf/'
c=bytes.fromhex(requests.get(u+'encrypt_flag/').json()['ciphertext'])
prev=c[:16];out=b''
for i in range(16,len(c),16):
    block=c[i:i+16]
    dec=bytes.fromhex(requests.get(u+'decrypt/'+block.hex()+'/').json()['plaintext'])
    out+=bytes(a^b for a,b in zip(dec,prev))
    prev=block
print(out.decode())
```

## 최종 플래그

```text
crypto{3cb_5uck5_4v01d_17_!!!!!}
```
