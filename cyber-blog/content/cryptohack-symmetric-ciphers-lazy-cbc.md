---
{"title":"Lazy CBC","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"IV와 키가 같다는 취약점을 이용한다. C1 0^128 C1을 복호화시키면 P1 XOR P3 = KEY가 된다. 오류 메시지가 평문 전체를 노출한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

IV와 키가 같다는 취약점을 이용한다. `C1 || 0^128 || C1`을 복호화시키면 `P1 XOR P3 = KEY`가 된다. 오류 메시지가 평문 전체를 노출한다.

## 최종 풀이 코드

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

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

## 최종 플래그

```text
crypto{50m3_p30pl3_d0n7_7h1nk_IV_15_1mp0r74n7_?}
```
