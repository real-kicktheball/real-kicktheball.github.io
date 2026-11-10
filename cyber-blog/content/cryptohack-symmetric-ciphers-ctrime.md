---
{"title":"CTRIME","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"서비스는 선택한 평문과 비밀 플래그를 이어 붙인 뒤 zlib로 압축하고 CTR로 암호화한다. CTR은 길이를 숨기지 않으므로, 입력에 플래그 접두사를 붙여 압축 길이를 비교하면 다음 바이트가 일치하는 후보가 짧아진다. DEFLATE의 바이트…","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

서비스는 선택한 평문과 비밀 플래그를 이어 붙인 뒤 zlib로 압축하고 CTR로 암호화한다. CTR은 길이를 숨기지 않으므로, 입력에 플래그 접두사를 붙여 압축 길이를 비교하면 다음 바이트가 일치하는 후보가 짧아진다. DEFLATE의 바이트 단위 출력에서 동점이 생기면 앞에 무관한 `X`를 0~5바이트 넣어 경계를 바꿔 비교한다.

## 최종 익스플로잇

```python
import requests,string,concurrent.futures,time
u='https://aes.cryptohack.org/ctrime/encrypt/'
chars=string.ascii_letters+string.digits+'_}'
known='crypto{'
def score(arg):
 n,c=arg
 p=(b'X'*n+(known+c).encode()).hex()
 for k in range(4):
  try:
   r=requests.get(u+p+'/',timeout=20).json()
   return c,len(bytes.fromhex(r['ciphertext']))
  except:time.sleep(k+1)
 raise RuntimeError(arg)
with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex:
 while len(known)<70:
  for n in range(6):
   vals=list(ex.map(score,((n,c) for c in chars)))
   m=min(x[1] for x in vals)
   best=[x[0] for x in vals if x[1]==m]
   if len(best)==1:break
  print(known,'pad',n,'min',m,'candidates',''.join(best),flush=True)
  if len(best)!=1:raise RuntimeError('tie')
  known+=best[0]
  if known.endswith('}'):break
print('FLAG',known)
```

## 최종 플래그

```text
crypto{CRIME_571ll_p4y5}
```
