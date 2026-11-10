---
{"title":"Confusion through Substitution","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"제공된 역 S-box로 상태 행렬의 각 바이트를 역치환한다. 첨부 소스에서 역 S-box 상수만 읽어 사용한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

제공된 역 S-box로 상태 행렬의 각 바이트를 역치환한다. 첨부 소스에서 역 S-box 상수만 읽어 사용한다.

## 최종 풀이 코드

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

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

## 최종 플래그

```text
crypto{l1n34rly}
```
