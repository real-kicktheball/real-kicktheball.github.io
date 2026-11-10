---
{"title":"Bruce Schneier's Password","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"서버는 암호의 ASCII 코드 합과 곱이 모두 소수인지 검사한다. NumPy의 int64 곱은 오버플로하므로, 실제 곱이 합성수여도 오버플로된 64비트 정수는 소수가 될 수 있다. 홀수 ASCII 문자만 선택해 곱이 홀수가 되게 하고, 대소…","section":["CryptoHack","Misc"]}
---

분야: Misc / passwords  
문제: https://cryptohack.org/challenges/misc/#schneierfact842  
소스: https://cryptohack.org/static/challenges/13400_dcf3cb755904e5c762a1dff3b4db64ff.py  
검증: 2026-11-10, NumPy int64 합·곱 검사 및 공식 소켓 서버에서 플래그 획득. CryptoHack 계정 정답 처리 확인

## 풀이 방법

서버는 암호의 ASCII 코드 합과 곱이 모두 소수인지 검사한다. NumPy의 `int64` 곱은 오버플로하므로, 실제 곱이 합성수여도 오버플로된 64비트 정수는 소수가 될 수 있다. 홀수 ASCII 문자만 선택해 곱이 홀수가 되게 하고, 대소문자·숫자 조건을 만족하는 11글자 문자열을 반복 생성하여 합과 오버플로 곱이 모두 소수인 값을 찾는다.

## 최종 익스플로잇

`pip install numpy pycryptodome` 후 Python 3에서 실행한다. 탐색은 고정 시드로 재현 가능하다.

```python
import json,random,socket,string,numpy as np
from Crypto.Util.number import isPrime
rng=random.Random(42)
pool=''.join(c for c in string.ascii_letters+string.digits+'_' if ord(c)%2)
while True:
 pwd=''.join(rng.choice(pool) for _ in range(11))
 if not(any(c.isdigit() for c in pwd) and any(c.islower() for c in pwd) and any(c.isupper() for c in pwd)):continue
 arr=np.array(list(map(ord,pwd)),dtype=np.int64)
 if isPrime(int(arr.sum())) and isPrime(int(arr.prod())):break
print('password',pwd,'sum',int(arr.sum()),'product',int(arr.prod()))
with socket.create_connection(('socket.cryptohack.org',13400),timeout=10) as sock:
 f=sock.makefile('rwb');f.readline()
 f.write(json.dumps({'password':pwd}).encode()+b'\n');f.flush()
 print(json.loads(f.readline())['msg'])

```

## 검증 방법

고정 시드에서는 암호 `I5s3kC5Sc1g`, 합 853, NumPy 곱 7070923416514165751이 나온다. 두 수는 모두 소수이며 서버 응답은 아래 플래그다.

## 최종 플래그

```text
crypto{https://www.schneierfacts.com/facts/1341}
```
