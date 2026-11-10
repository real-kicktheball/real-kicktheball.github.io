---
{"title":"ECB CBC WTF","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CBC 복호화는 P_i = D(C_i) ⊕ C_{i-1}이다. ECB 복호화 오라클로 D(C_i)를 얻으면 CBC 암호문을 풀 수 있다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**CBC 모드**는 평문 블록을 이전 암호문 블록과 XOR한 뒤 암호화한다.

$$
C_i = E_K(P_i \oplus C_{i-1}), \qquad C_0 = IV
$$

복호화는 반대 순서다.

$$
P_i = D_K(C_i) \oplus C_{i-1}
$$

즉 블록 단위 복호화 $D_K$만 할 수 있으면 CBC는 XOR 한 번으로 풀린다.

## 문제

플래그는 CBC로 암호화돼 있다(IV가 암호문 앞에 붙어 있음). 그런데 서버의 `decrypt`는 같은 키로 **ECB 복호화**를 해준다.

## 풀이

1. 암호문을 16바이트씩 나누고, 첫 블록은 IV로 둔다.
2. 각 암호 블록 $C_i$를 ECB `decrypt`에 보내 $D_K(C_i)$를 얻는다.
3. 이전 블록 $C_{i-1}$과 XOR해서 평문을 복원한다.

## 풀이 코드
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

## 플래그
```text
crypto{3cb_5uck5_4v01d_17_!!!!!}
```
