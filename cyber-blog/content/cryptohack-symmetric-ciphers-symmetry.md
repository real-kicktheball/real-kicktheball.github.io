---
{"title":"Symmetry","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"OFB는 키스트림을 XOR하는 방식이라 암호화와 복호화가 같은 연산이다. 같은 IV로 다시 암호화하면 평문이 나온다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**OFB 모드**는 IV를 계속 암호화해서 키스트림을 만들고 평문과 XOR한다.

$$
O_0 = IV, \quad O_i = E_K(O_{i-1}), \quad C_i = P_i \oplus O_i
$$

키스트림은 평문과 무관하게 $K$와 $IV$로만 정해진다. 그래서 암호화와 복호화가 완전히 같은 연산이다.

$$
\text{Enc}(\text{Enc}(P)) = P \oplus O \oplus O = P
$$

## 문제

`encrypt_flag`가 IV와 OFB 암호문을 주고, `encrypt`는 사용자가 정한 IV로 OFB 암호화를 해준다.

## 풀이

플래그 암호문과 IV를 그대로 `encrypt`에 넣는다. 키스트림이 한 번 더 XOR되어 상쇄되고 평문이 나온다.

## 풀이 코드
```python
import requests
u='https://aes.cryptohack.org/symmetry/'
c=bytes.fromhex(requests.get(u+'encrypt_flag/').json()['ciphertext'])
p=requests.get(u+'encrypt/'+c[16:].hex()+'/'+c[:16].hex()+'/').json()['ciphertext']
print(bytes.fromhex(p).decode())
```

## 플래그
```text
crypto{0fb_15_5ymm37r1c4l_!!!11!}
```
