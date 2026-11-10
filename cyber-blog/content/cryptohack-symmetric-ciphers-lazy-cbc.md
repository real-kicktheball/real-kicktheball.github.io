---
{"title":"Lazy CBC","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CBC에서 IV를 키와 같게 쓰면, 복호화 결과를 볼 수 있을 때 C || 0 || C를 넣어 키를 꺼낼 수 있다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

IV를 키와 같게 쓰면 IV를 따로 관리하지 않아도 되니 편해 보인다. 하지만 복호화 결과가 노출되면 키가 그대로 새어 나온다.

암호문 $C \,\|\, 0 \,\|\, C$를 복호화시키면($IV = K$) 다음과 같다.

$$
\begin{aligned}
P_1 &= D(C) \oplus K \\
P_2 &= D(0) \oplus C \\
P_3 &= D(C) \oplus 0 = D(C)
\end{aligned}
$$

따라서 $P_1 \oplus P_3 = K$이다.

## 문제

서버는 `IV = KEY`인 CBC를 쓴다. `receive`로 보낸 암호문을 복호화했을 때 평문이 이상하면, 오류 메시지에 복호화된 평문 전체를 보여준다.

## 풀이

1. 아무 평문이나 암호화해서 $C$ 한 블록을 얻는다.
2. $C \| 0^{16} \| C$를 `receive`에 보내면 오류 메시지로 $P_1 P_2 P_3$가 나온다.
3. $P_1 \oplus P_3$이 키다.
4. `get_flag`에 키를 보내면 플래그를 받는다.

## 풀이 코드
```python
import requests,re
u='https://aes.cryptohack.org/lazy_cbc/'
c=bytes.fromhex(requests.get(u+'encrypt/'+('00'*16)+'/').json()['ciphertext'])
probe=c+b'\0'*16+c
err=requests.get(u+'receive/'+probe.hex()+'/').json()['error']
p=bytes.fromhex(re.search(r'Invalid plaintext: ([0-9a-f]+)',err).group(1))
key=bytes(a^b for a,b in zip(p[:16],p[32:48]))
print(bytes.fromhex(requests.get(u+'get_flag/'+key.hex()+'/').json()['plaintext']).decode())
```

## 플래그
```text
crypto{50m3_p30pl3_d0n7_7h1nk_IV_15_1mp0r74n7_?}
```
