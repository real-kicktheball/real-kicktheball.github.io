---
{"title":"Script Kiddie","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"파이썬에서 ^는 거듭제곱이 아니라 XOR이다. 표기 실수 하나로 DH가 무의미해진다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 개념

수학에서 $g^a$는 "$g$를 $a$번 곱하기"다. 그런데 **파이썬에서 `^`는 거듭제곱이 아니라 XOR**이다.

```python
2 ^ 3        # = 1  (XOR: 10 ⊕ 11 = 01)
2 ** 3       # = 8  (거듭제곱)
pow(2, 3, 7) # = 1  (8을 7로 나눈 나머지)
```

### 직접 해보기

이 문제의 스크립트는 `B = g ^ b`라고 썼다. 거듭제곱이 아니라 XOR이다. $g = 2$, $b = 13$이면 이렇게 된다.

$$
B = 2 \oplus 13 = 0010 \oplus 1101 = 1111 = 15
$$

XOR은 두 번 하면 사라지니까 다음처럼 비밀이 그대로 나온다.

$$
b = B \oplus g = 15 \oplus 2 = 13
$$

이산로그 같은 어려운 문제가 아예 없어진 셈이다. 플래그 내용도 "표기법을 조심해라"다. 문제 이름의 Script Kiddie는 "남의 코드를 이해하지 못하고 그대로 쓰는 초보"라는 뜻이다.

### 정리

수학에서 $g^a$는 거듭제곱이지만 **파이썬에서 `^`는 비트 XOR**이다. 거듭제곱은 `**`나 `pow()`를 써야 한다.

```python
g ^ b       # XOR
pow(g, b, p)  # 모듈러 거듭제곱
```

XOR로 DH를 하면 $B = g \oplus b$라서 $b = B \oplus g$로 바로 풀린다. 플래그 내용도 "표기법을 조심하라"이다.

## 문제

DH 스크립트와 출력($p$, $g$, $A$, $B$, IV, 암호문)이 주어진다. 스크립트가 `pow` 대신 `^`를 썼다.

## 풀이

1. $b = B \oplus g$를 구한다.
2. 스크립트와 똑같이 공유 비밀 $A \oplus b$를 계산한다.
3. SHA-1로 키를 만들어 CBC 복호화한다.

## 풀이 코드
```python
import ast, hashlib, re, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
url='https://cryptohack.org/static/challenges/output_92cc8b7f0db768b53291efbf969ca3ca.txt'
data=requests.get(url,timeout=20).text
v={k:int(n) for k,n in re.findall(r'(?m)^(p|g|A|B): (\d+)',data)}
b=v['B']^v['g']
assert v['g']^b==v['B']
shared=v['A']^b
iv=ast.literal_eval(re.search(r'(?m)^iv: (.+)',data).group(1))
ct=ast.literal_eval(re.search(r'(?m)^encrypted_flag: (.+)',data).group(1))
key=hashlib.sha1(str(shared).encode()).digest()[:16]
flag=unpad(AES.new(key,AES.MODE_CBC,bytes.fromhex(iv)).decrypt(bytes.fromhex(ct)),16).decode()
assert flag.startswith('crypto{')
print(flag)
```

## 플래그
`crypto{b3_c4r3ful_w1th_y0ur_n0tati0n}`
