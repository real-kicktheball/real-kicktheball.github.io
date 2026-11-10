---
{"title":"CTRIME","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"압축 후 암호화하면 암호문 길이가 평문 내용에 따라 달라진다. CRIME 공격처럼 길이 차이로 비밀을 한 글자씩 맞춘다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**CRIME 공격**은 "압축 → 암호화" 순서에서 생기는 정보 누출을 이용한다.

- DEFLATE(zlib) 압축은 반복되는 문자열을 짧게 줄인다.
- 내 입력이 비밀값과 겹치면 압축이 더 잘 돼서 결과가 짧아진다.
- CTR처럼 길이를 숨기지 않는 암호를 쓰면 **암호문 길이 = 압축 길이**다.

그래서 길이를 보고 내 추측이 맞았는지 알 수 있다. 실제로 TLS 압축이 꺼진 이유가 이 공격이다.

## 문제

서버가 `내 입력 || FLAG`를 zlib로 압축한 뒤 AES-CTR로 암호화해준다.

## 풀이

1. 지금까지 아는 부분 `crypto{` 뒤에 후보 문자 $c$를 붙여 보낸다.
2. 맞는 후보는 플래그와 겹치는 길이가 하나 늘어서 암호문이 가장 짧다.
3. 압축 결과가 바이트 단위라 여러 후보가 같은 길이로 나오는 경우가 있다. 그럴 때는 앞에 의미 없는 `X`를 0~5개 붙여서 비트 경계를 바꿔가며 다시 비교했다.
4. 이걸 `}`가 나올 때까지 반복한다.

## 풀이 코드
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

## 플래그
```text
crypto{CRIME_571ll_p4y5}
```
