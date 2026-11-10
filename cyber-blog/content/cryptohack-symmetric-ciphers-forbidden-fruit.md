---
{"title":"Forbidden Fruit","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"GCM에서 nonce를 재사용하므로 두 개의 선택 평문에 대한 태그 차분에서 GHASH의 H²를 복원할 수 있다. 같은 길이의 평문을 암호화해 키스트림을 구한 뒤, 금지 문자열 give me the flag의 암호문과 올바른 태그를 만들어 …","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [Forbidden Fruit](https://cryptohack.org/challenges/aes/#forbidden_fruit)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)


## 풀이 원리

GCM에서 nonce를 재사용하므로 두 개의 선택 평문에 대한 태그 차분에서 GHASH의 `H²`를 복원할 수 있다. 같은 길이의 평문을 암호화해 키스트림을 구한 뒤, 금지 문자열 `give me the flag`의 암호문과 올바른 태그를 만들어 복호화 API로 보낸다.

## 최종 익스플로잇

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

## 검증 방법

Python 3에서 위 코드를 실행해 서버 응답의 최종 플래그가 아래 문자열과 일치하는지 확인한다.

## 최종 플래그

```text
crypto{https://github.com/attr-encrypted/encryptor/pull/22}
```
