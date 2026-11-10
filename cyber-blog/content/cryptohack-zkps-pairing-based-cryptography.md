---
{"title":"Pairing-Based Cryptography","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"각 출력 행에는 xG_1, yG_2, z가 있다. 원본 비트가 1이면 z=pairing(yG2,xG1)이고, 비트가 0이면 추가 무작위 배수 때문에 거의 항상 다르다. 모든 행에서 등식 여부를 한 비트로 변환하고, 출력 순서대로 비트를 이어…","section":["CryptoHack","ZKPs"]}
---

## 풀이 방법

각 출력 행에는 $xG_1$, $yG_2$, $z$가 있다. 원본 비트가 1이면 `z=pairing(yG2,xG1)`이고, 비트가 0이면 추가 무작위 배수 때문에 거의 항상 다르다. 모든 행에서 등식 여부를 한 비트로 변환하고, 출력 순서대로 비트를 이어 붙여 플래그 바이트를 복원한다.

## 최종 익스플로잇

```python
from ast import literal_eval
from urllib.request import urlopen
from py_ecc.optimized_bn128 import FQ,FQ2,FQ12,pairing
bits=[]
lines=urlopen('https://cryptohack.org/static/challenges/output_2d8920fd1c945fde7ff1ad5fc0810aa7.txt').read().decode().splitlines()
for j,line in enumerate(lines):
 x,y,z=literal_eval(line)
 P=tuple(FQ(v) for v in x)
 Q=tuple(FQ2(v) for v in y)
 bits.append(int(pairing(Q,P)==FQ12(z)))
value=int(''.join(map(str,bits)),2)
flag=value.to_bytes((value.bit_length()+7)//8,'big')
print(flag.decode())

```

## 최종 플래그

```text
crypto{Pa1rings_R_Str0ng}
```
