---
{"title":"ECB Oracle","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"ECB는 같은 평문 블록이 같은 암호문 블록이 된다. 입력 길이를 조절해 비밀 바이트를 한 글자씩 블록 끝에 밀어 넣고 맞춘다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

ECB의 문제는 **같은 평문 블록이 항상 같은 암호문 블록**이 된다는 점이다. 서버가 `내 입력 || 비밀값`을 ECB로 암호화해준다면 바이트 단위로 비밀을 읽어낼 수 있다(byte-at-a-time 공격).

1. `A`를 15개 보낸다. 첫 블록은 `AAAAAAAAAAAAAAA?`가 된다. `?`는 비밀의 첫 바이트다.
2. 그 암호문 블록을 기억한다.
3. `AAAAAAAAAAAAAAA` + 후보 문자 $x$를 넣어서 같은 블록이 나오는 $x$를 찾는다.
4. 찾으면 `A`를 하나 줄여서 다음 바이트로 넘어간다.

한 바이트마다 후보는 최대 256개라서 전체 비밀을 금방 읽는다.

## 문제

`/ecb_oracle/encrypt/`가 `입력 || FLAG`를 패딩해서 ECB로 암호화해준다.

## 풀이

1. 이미 알아낸 부분 `known` 길이에 맞춰 패딩 `A`를 붙여 목표 블록을 얻는다. 다음 미지 바이트가 블록 마지막에 오도록 맞춘다.
2. `(pad + known)`의 마지막 15바이트 + 후보 문자로 만든 블록들을 한 요청에 여러 개 넣는다. 요청 수를 줄이려고 32개씩 묶었다.
3. 목표 블록과 같은 암호문이 나온 후보가 다음 글자다.
4. `}`가 나올 때까지 반복한다.

## 풀이 코드
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

## 플래그
```text
crypto{p3n6u1n5_h473_3cb}
```
