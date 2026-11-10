---
{"title":"Flipping Cookie","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CBC에서 IV(이전 블록)의 비트를 뒤집으면 다음 평문 블록의 같은 위치 비트가 뒤집힌다(bit flipping).","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

CBC 복호화식 $P_1 = D_K(C_1) \oplus IV$를 보면, IV를 $\Delta$만큼 바꾸면 평문도 정확히 $\Delta$만큼 바뀐다.

$$
D_K(C_1) \oplus (IV \oplus \Delta) = P_1 \oplus \Delta
$$

원래 평문을 알면 $\Delta = P_{\text{원래}} \oplus P_{\text{원하는 값}}$으로 잡아서 원하는 평문을 만들 수 있다. 키를 몰라도 된다. 암호화는 기밀성만 주지 **무결성은 주지 않는다**는 걸 보여주는 예다.

## 문제

서버가 `admin=False;expiry=...` 쿠키를 CBC로 암호화해서 IV와 함께 준다. 쿠키를 복호화했을 때 `admin=True`이면 플래그를 준다.

## 풀이

1. `False`는 평문 6~10번째 바이트다(`admin=` 다음).
2. IV의 해당 위치를 `False ⊕ True;`로 XOR한다. 길이를 맞추려고 `True` 뒤에 `;`를 붙였다.
3. 바꾼 IV와 원래 암호문을 보내면 복호화 결과가 `admin=True;;expiry=...`가 되고 플래그를 받는다.

## 풀이 코드
```python
import requests
u='https://aes.cryptohack.org/flipping_cookie/'
c=bytes.fromhex(requests.get(u+'get_cookie/').json()['cookie'])
iv=bytearray(c[:16])
for i,(a,b) in enumerate(zip(b'False',b'True;')):
    iv[6+i]^=a^b
print(requests.get(u+'check_admin/'+c[16:].hex()+'/'+iv.hex()+'/').json()['flag'])
```

## 플래그
```text
crypto{4u7h3n71c4710n_15_3553n714l}
```
