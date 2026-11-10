---
{"title":"Marin's Secrets","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"생성 함수가 2^k−1 형태의 메르센 소수만 만든다. 공개된 메르센 소수 지수 목록의 후보를 n에 대입해 인수를 찾고, 남은 인수도 2의 거듭제곱보다 1 작은 형태임을 검사한다.","section":["CryptoHack","RSA"]}
---

## 문제

- 링크: https://cryptohack.org/challenges/rsa/#marin
- 첨부: [output.txt](https://cryptohack.org/static/challenges/output_f194012343666ced1a6699d196c8adc5.txt)

## 풀이 원리

생성 함수가 2^k−1 형태의 메르센 소수만 만든다. 공개된 메르센 소수 지수 목록의 후보를 n에 대입해 인수를 찾고, 남은 인수도 2의 거듭제곱보다 1 작은 형태임을 검사한다.

## 최종 풀이 코드

```python
import re, requests
from Crypto.Util.number import long_to_bytes, isPrime
url='https://cryptohack.org/static/challenges/output_f194012343666ced1a6699d196c8adc5.txt'
data=requests.get(url,timeout=20).text
v={k:int(x) for k,x in re.findall(r'(?m)^([nec]): (\d+)',data)}
n,e,c=v['n'],v['e'],v['c']
exponents=[2,3,5,7,13,17,19,31,61,89,107,127,521,607,1279,2203,2281,3217,4253]
p=next((1<<k)-1 for k in exponents if n%((1<<k)-1)==0)
q=n//p
assert q&(q+1)==0 and isPrime(p) and isPrime(q)
assert p*q==n
d=pow(e,-1,(p-1)*(q-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. 두 인수의 형태와 소수성을 확인하고 복호화한 값을 재암호화했다.

```text
crypto{Th3se_Pr1m3s_4r3_t00_r4r3}
```

## 최종 플래그

`crypto{Th3se_Pr1m3s_4r3_t00_r4r3}`
