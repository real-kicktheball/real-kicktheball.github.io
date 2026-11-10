---
{"title":"Forbidden Fruit","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AES-GCM에서 nonce를 재사용하면 인증 키 H가 드러나서 원하는 메시지의 태그를 위조할 수 있다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**GCM**은 CTR 암호화에 GHASH 기반 인증 태그를 더한 모드다. 태그는 $\mathrm{GF}(2^{128})$ 위의 다항식이다. 암호문 블록 1개, AAD 1개일 때는 다음과 같다.

$$
T = A \cdot H^3 \oplus C \cdot H^2 \oplus L \cdot H \oplus E_K(J_0)
$$

여기서 $H = E_K(0)$은 인증 키, $L$은 길이 블록이다.

nonce를 재사용하면 $E_K(J_0)$이 같아진다. 그래서 같은 길이 메시지 두 개의 태그를 빼면(XOR하면) 미지수가 $H$만 남는다.

$$
T_1 \oplus T_2 = (C_1 \oplus C_2) \cdot H^2
$$

$H^2$을 구하면 원하는 암호문의 태그를 계산할 수 있다.

## 문제

서버가 같은 nonce로 AES-GCM 암호화를 해준다. 다만 `give me the flag`라는 평문은 암호화를 거부한다. 이 평문의 유효한 암호문과 태그를 보내면 플래그를 준다.

## 풀이

1. `0`×16, `1`×16을 암호화해서 두 태그를 얻는다. $H^2 = (T_1 \oplus T_2) \cdot (C_1 \oplus C_2)^{-1}$로 계산한다.
2. CTR이라 키스트림 $= C_1 \oplus P_1$이다. 그래서 `give me the flag`의 암호문 $C'$를 직접 만든다.
3. $T' = T_1 \oplus (C_1 \oplus C') \cdot H^2$로 태그를 위조한다.
4. 서버의 복호화 API에 보내면 인증을 통과하고 플래그가 나온다.

## 풀이 코드
```python
import requests
s=requests.Session();base='https://aes.cryptohack.org/forbidden_fruit/'
def enc(pt):return s.get(base+'encrypt/'+pt.hex()+'/').json()
def mul(x,y):
 z=0;v=y
 for i in range(128):
  if x & (1<<(127-i)):z^=v
  v=(v>>1)^(0xe1000000000000000000000000000000 if v&1 else 0)
 return z
def power(x,n):
 out=1<<127
 while n:
  if n&1:out=mul(out,x)
  x=mul(x,x);n>>=1
 return out
p0=b'0'*16;p1=b'1'*16
r0=enc(p0);r1=enc(p1)
print(r0,r1)
c0=int(r0['ciphertext'],16);c1=int(r1['ciphertext'],16)
t0=int(r0['tag'],16);t1=int(r1['tag'],16)
dc=c0^c1;dt=t0^t1
assert mul(1<<127,dc)==dc
h2=mul(dt,power(dc,(1<<128)-2))
assert mul(dc,h2)==dt
want=b'give me the flag'
keystream=bytes(a^b for a,b in zip(bytes.fromhex(r0['ciphertext']),p0))
c2=int.from_bytes(bytes(a^b for a,b in zip(want,keystream)),'big')
t2=t0^mul(c0^c2,h2)
r=s.get(base+'decrypt/'+r0['nonce']+'/'+f'{c2:032x}'+'/'+f'{t2:032x}'+'/'+r0['associated_data']+'/').json()
print('result',r)
if 'plaintext' in r:print('FLAG',bytes.fromhex(r['plaintext']).decode())
```

## 플래그
```text
crypto{https://github.com/attr-encrypted/encryptor/pull/22}
```
