---
{"title":"Bruce Schneier's Password","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"NumPy int64 곱은 조용히 오버플로한다. 실제 곱은 합성수인데 오버플로된 값은 소수가 되는 입력을 찾는다.","section":["CryptoHack","Misc"]}
---

## 개념

컴퓨터의 숫자 상자에는 **크기 제한**이 있다. 64비트 상자는 약 922경(9.2 × 10¹⁸)까지만 담을 수 있다. 그보다 커지면 **넘쳐서(오버플로)** 이상한 값이 된다.

### 비유: 자동차 주행거리계

주행거리계가 999,999km까지만 표시된다면, 1km를 더 달리면 **000,000**이 된다. 실제로는 100만 km인데 0km로 보인다.

### 직접 해보기 (2자리 계산기라면)

두 자리(00~99)만 표시하는 계산기에서 $12 \times 11$을 하면 실제 값은 132인데 화면에는 **32**만 나온다. 132는 합성수($= 4 \times 3 \times 11$)인데, 32만 보고 판단하면 엉뚱한 결론이 나온다.

### 이 문제에서

서버는 비밀번호 글자 번호들의 **곱이 소수인지** 검사한다. 그런데 여러 글자의 곱은 원래 절대 소수가 될 수 없다(여러 수를 곱했으니까). 하지만 서버가 쓰는 NumPy는 64비트 상자로 곱셈을 해서 **넘친 값**으로 검사한다.

그래서 넘친 값이 우연히 소수가 되는 비밀번호를 찾으면 통과한다. 짝수가 섞이면 결과가 짝수가 되니까, 번호가 홀수인 글자만 써서 찾았다.

### 정리

파이썬 정수는 크기 제한이 없다. 하지만 **NumPy 배열의 `int64`**는 64비트를 넘으면 경고 없이 $2^{64}$으로 나눈 나머지(부호 있는 값)가 된다.

$$
\text{np.prod}(x) = \left(\prod x_i\right) \bmod 2^{64} \quad (\text{부호 있는 표현})
$$

"곱이 소수인지" 같은 검사를 NumPy로 하면, 실제 수학적 성질과 다른 값을 검사하게 된다.

## 문제

서버는 비밀번호가 다음 조건을 만족하면 플래그를 준다.

- 대소문자, 숫자가 모두 들어 있다.
- 각 문자의 ASCII 합이 소수다.
- ASCII 곱(NumPy `int64`)이 소수다.

ASCII 코드가 2 이상인 문자 여러 개의 곱은 실제로는 절대 소수가 아니다.

## 풀이

1. 곱이 짝수가 되지 않게 ASCII 코드가 홀수인 문자만 쓴다.
2. 11글자를 랜덤으로 만들면서 합과 **오버플로된 int64 곱**이 둘 다 소수인 경우를 찾는다.
3. 그 비밀번호를 보내면 서버도 같은 오버플로 값을 소수로 판정해서 플래그를 준다.

## 풀이 코드
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

## 플래그
```text
crypto{https://www.schneierfacts.com/facts/1341}
```
