---
{"title":"Triple DES","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"DES에는 E_K(E_K(x)) = x가 되는 약한 키가 있다. 3DES도 약한 키를 쓰면 암호화를 두 번 하면 원래대로 돌아온다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**DES**는 56비트 키를 쓰는 옛 블록 암호다. 키가 너무 짧아서 3번 겹쳐 쓰는 **3DES**가 나왔다.

$$
C = E_{K_3}(D_{K_2}(E_{K_1}(P)))
$$

DES에는 **약한 키(weak key)**가 4개 있다. 이 키들은 라운드 키 16개가 모두 같아져서 암호화가 곧 복호화가 된다.

$$
E_K(E_K(P)) = P
$$

`0101010101010101`, `FEFEFEFEFEFEFEFE` 등이 그 예다.

## 문제

서버가 사용자가 준 키로 3DES 암호화를 해준다(`encrypt_flag`, `encrypt`). 복호화 API는 없다.

## 풀이

1. 키를 약한 키 두 개 $K_1 = \texttt{01..01}$, $K_2 = \texttt{FE..FE}$로 준다(2-key 3DES).
2. 각 DES 단계가 자기 역연산이라 3DES 전체도 자기 역연산이 된다.
3. `encrypt_flag` 결과를 같은 키로 `encrypt`에 한 번 더 넣으면 평문이 나온다. 서비스가 IV와 앞뒤로 XOR하는 부분도 대칭이라 그대로 상쇄된다.

## 풀이 코드
```python
import requests
from Crypto.Util.Padding import unpad
u='https://aes.cryptohack.org/triple_des/'
key='0101010101010101fefefefefefefefe'
c=requests.get(u+'encrypt_flag/'+key+'/').json()['ciphertext']
p=requests.get(u+'encrypt/'+key+'/'+c+'/').json()['ciphertext']
print(unpad(bytes.fromhex(p),8).decode())
```

## 플래그
```text
crypto{n0t_4ll_k3ys_4r3_g00d_k3ys}
```
