---
{"title":"Stream of Consciousness","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"매 요청마다 고정된 CTR 키스트림으로 22개 문장 중 하나를 암호화한다. 여러 암호문을 모으면 같은 위치의 문자들이 같은 키 바이트와 XOR되므로 영어 글자 빈도 기반 점수로 키스트림을 추정할 수 있다. crypto{ 접두사가 나타나는 행…","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [Stream of Consciousness](https://cryptohack.org/challenges/aes/#stream_consciousness)
- 검증: 서버에서 플래그 직접 획득; 플랫폼 제출 확인 전


## 풀이 원리

매 요청마다 고정된 CTR 키스트림으로 22개 문장 중 하나를 암호화한다. 여러 암호문을 모으면 같은 위치의 문자들이 같은 키 바이트와 XOR되므로 영어 글자 빈도 기반 점수로 키스트림을 추정할 수 있다. `crypto{` 접두사가 나타나는 행을 찾아 첫 바이트의 대소문자 오차를 교정한다.

## 최종 익스플로잇

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

## 검증 방법

Python 3에서 위 코드를 실행해 서버 응답 또는 복호화 결과가 아래 플래그와 일치하는지 확인한다.

## 최종 플래그

```text
crypto{k3y57r34m_r3u53_15_f474l}
```
