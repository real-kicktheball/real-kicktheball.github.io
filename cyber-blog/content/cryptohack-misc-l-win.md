---
{"title":"L-Win","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"출력 2048비트는 길이 384인 LFSR의 연속 비트다. Berlekamp–Massey 알고리즘으로 최소 연결 다항식을 복원하면 선형 복잡도 384와 점화식의 계수를 얻는다. 최고차 계수가 1이라 출력 시점 이전으로 점화식을 역방향 적용할…","section":["CryptoHack","Misc"]}
---

## 풀이 방법

출력 2048비트는 길이 384인 LFSR의 연속 비트다. Berlekamp–Massey 알고리즘으로 최소 연결 다항식을 복원하면 선형 복잡도 384와 점화식의 계수를 얻는다. 최고차 계수가 1이라 출력 시점 이전으로 점화식을 역방향 적용할 수 있다. 서버는 초기 플래그 상태를 넣고 16×48=768번 클록한 뒤 출력을 시작했으므로, 시간 인덱스 -768부터 -385까지의 384비트를 복원하면 원래 플래그다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. 공식 출력 파일을 받아 복원한다.

```python
from urllib.request import urlopen
bits=list(map(int,urlopen('https://cryptohack.org/static/challenges/output_7e5c4d93fa5d065d105e32efd7ef9682.txt').read().decode().strip()))
C=B=1;L=0;m=-1
for n in range(len(bits)):
 d=bits[n]
 for i in range(1,L+1):
  if (C>>i)&1:d^=bits[n-i]
 if d:
  T=C;C^=B<<(n-m)
  if 2*L<=n:L=n+1-L;B=T;m=n
s={i:x for i,x in enumerate(bits)}
for t in range(-1,-769,-1):
 v=s[t+L]
 for i in range(1,L):
  if (C>>i)&1:v^=s[t+L-i]
 s[t]=v
flag_bits=''.join(str(s[i]) for i in range(-768,-384))
flag=int(flag_bits,2).to_bytes(48,'big')
print(flag.decode())
```

## 검증 방법

Berlekamp–Massey에서 얻은 연결 다항식이 관측된 출력 전체를 만족하는지, 역방향으로 얻은 48바이트가 아래 플래그와 같은지 확인한다.

## 최종 플래그

```text
crypto{minimal_polynomial_in_an_arbitrary_field}
```
