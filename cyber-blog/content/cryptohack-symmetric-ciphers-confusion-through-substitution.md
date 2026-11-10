---
{"title":"Confusion through Substitution","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"SubBytes는 S-box로 바이트를 비선형 치환해 혼돈(confusion)을 만든다. 역 S-box로 되돌린다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

Shannon은 좋은 암호의 두 성질로 **혼돈(confusion)**과 **확산(diffusion)**을 꼽았다. 혼돈은 키와 암호문의 관계를 복잡하게 만드는 것이다.

AES는 **SubBytes** 단계의 S-box로 혼돈을 만든다. S-box는 각 바이트를 다음 순서로 바꾼다.

1. $\mathrm{GF}(2^8)$에서 곱셈 역원을 취한다.
2. 아핀 변환을 적용한다.

이 변환은 **비선형**이다. 선형 연산(XOR, 행렬곱)만 있으면 전체 암호가 선형식이 되어 쉽게 풀린다. S-box가 그걸 막는다. 실제로 뒤의 Beatboxer 문제가 S-box를 선형으로 바꿨을 때 어떻게 깨지는지 보여준다.

## 문제

상태 행렬과 AES의 S-box·역 S-box 표가 주어진다. 역치환으로 원래 바이트를 복원한다.

## 풀이

각 바이트 $x$를 `inv_s_box[x]`로 바꾸고 이어 붙인다.

## 풀이 코드
```python
import requests
u='https://cryptohack.org/static/challenges/sbox_8fc04ffb95faf5a5e6959195d5e2d94e.py'
s=requests.get(u).text
namespace={}
exec(s.split('state =',1)[0],namespace)
inv_s_box=namespace['inv_s_box']
state=[[251,64,182,81],[146,168,33,80],[199,159,195,24],[64,80,182,255]]
print(bytes(inv_s_box[x] for row in state for x in row).decode())
```

## 플래그
```text
crypto{l1n34rly}
```
