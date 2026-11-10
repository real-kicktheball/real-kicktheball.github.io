---
{"title":"ECB Oracle","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"ECB는 블록마다 독립이다. 플래그 앞에 선택한 A 패딩을 붙여 다음 미지 바이트를 블록 끝에 배치하고, 가능한 ASCII 문자들을 각각 별도 블록에 넣어 암호문 블록을 비교한다. URL 길이 제한을 피하려고 한 번에 32개 후보만 보낸다.","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [ECB Oracle](https://cryptohack.org/challenges/aes/#ecb_oracle)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)


## 풀이 원리

ECB는 블록마다 독립이다. 플래그 앞에 선택한 `A` 패딩을 붙여 다음 미지 바이트를 블록 끝에 배치하고, 가능한 ASCII 문자들을 각각 별도 블록에 넣어 암호문 블록을 비교한다. URL 길이 제한을 피하려고 한 번에 32개 후보만 보낸다.

## 최종 풀이 코드

```python
import requests,string,time
s=requests.Session();u='https://aes.cryptohack.org/ecb_oracle/encrypt/'
def enc(data):
 for attempt in range(5):
  r=s.get(u+data.hex()+'/',timeout=30)
  try:return bytes.fromhex(r.json()['ciphertext'])
  except Exception:time.sleep(1+attempt)
 raise RuntimeError((r.status_code,r.text[:200]))
known=b'crypto{'
chars=(string.ascii_letters+string.digits+string.punctuation+' ').encode()
while len(known)<64:
 i=len(known);pad=b'A'*((15-i%16) or 16);block=(len(pad)+i)//16
 target=enc(pad)[16*block:16*(block+1)]
 base=(pad+known)[-15:]
 result=None
 for start in range(0,len(chars),32):
  group=chars[start:start+32]
  ct=enc(b''.join(base+bytes([x]) for x in group))
  d={ct[j*16:(j+1)*16]:x for j,x in enumerate(group)}
  if target in d:result=d[target];break
 if result is None:raise RuntimeError(f'no match after {known!r}')
 known+=bytes([result]);print(known.decode(),flush=True)
 if result==ord('}'):break
print('FLAG',known.decode())
```

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

## 최종 플래그

```text
crypto{p3n6u1n5_h473_3cb}
```
