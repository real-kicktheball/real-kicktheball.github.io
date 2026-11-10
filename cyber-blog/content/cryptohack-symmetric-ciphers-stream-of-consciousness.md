---
{"title":"Stream of Consciousness","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CTR에서 같은 키스트림을 여러 메시지에 재사용하면 many-time pad가 된다. 영어 빈도 분석으로 키스트림을 복원한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

스트림 암호(CTR, OTP 등)에서 **같은 키스트림을 재사용**하면 Many-time pad 문제가 된다.

$$
C_1 \oplus C_2 = P_1 \oplus P_2
$$

키스트림이 사라지고 평문끼리의 XOR만 남는다. 암호문이 많으면 같은 위치 $i$의 바이트들은 모두 같은 키 바이트 $k_i$로 XOR된 것이다. 그래서 각 위치마다 1바이트 XOR 문제가 된다.

1. 각 위치마다 $k_i$ 후보 256개를 시도한다.
2. 그 위치의 모든 암호문 바이트를 복호화한다.
3. 결과가 영어 문장답게(공백, e, t, a… 빈도가 높게) 나오는 후보를 고른다.

## 문제

서버가 요청할 때마다 22개 문장 중 하나를 **같은 키와 같은 카운터**로 CTR 암호화해서 준다. 그중 하나에 플래그가 있다.

## 풀이

1. 300번 요청해서 서로 다른 암호문을 모은다.
2. 위치별로 영어 글자 빈도 점수가 가장 높은 키 바이트를 고른다.
3. 복원한 키스트림으로 전체를 복호화하면 대부분 문장이 읽힌다.
4. `crypto{`로 시작하는 줄을 찾는다. 첫 글자 대소문자 같은 작은 오류는 알려진 접두사로 고쳤다.

## 풀이 코드
```python
import requests, concurrent.futures, math, string, re
u='https://aes.cryptohack.org/stream_consciousness/encrypt/'
def get(_):return requests.get(u,timeout=15).json()['ciphertext']
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
 cts=list(dict.fromkeys(bytes.fromhex(x) for x in ex.map(get,range(300))))
freq={' ':0.18,'e':0.102,'t':0.075,'a':0.065,'o':0.063,'i':0.056,'n':0.057,'s':0.053,'r':0.05,'h':0.049,'l':0.033,'d':0.032,'u':0.022,'c':0.023,'m':0.020,'f':0.018,'w':0.017,'g':0.016,'p':0.016,'y':0.015,'b':0.013,'v':0.008,'k':0.006,'x':0.002,'j':0.001,'q':0.001,'z':0.001}
def score(byte):
 c=chr(byte)
 if c in freq:return math.log(freq[c])
 if c in string.ascii_uppercase:return math.log(freq.get(c.lower(),0.001)*0.08)
 if c in ",.;:'\"?-":return math.log(0.01)
 if c in string.digits:return math.log(0.006)
 if c in '{}_':return math.log(0.004)
 return -100
key=[]
for i in range(max(map(len,cts))):
 vals=[c[i] for c in cts if len(c)>i]
 key.append(max(range(256),key=lambda k:sum(score(x^k) for x in vals)))
pts=[bytes(x^key[i] for i,x in enumerate(c)) for c in cts]
candidates=[(c,p) for c,p in zip(cts,pts) if p[1:7]==b'rypto{']
assert len(candidates)==1,candidates
flagct,_=candidates[0]
for i,ch in enumerate(b'crypto{'):key[i]=flagct[i]^ch
flag=bytes(x^key[i] for i,x in enumerate(flagct))
assert re.fullmatch(rb'crypto\{[A-Za-z0-9_]+\}',flag),flag
print(flag.decode())
```

## 플래그
```text
crypto{k3y57r34m_r3u53_15_f474l}
```
