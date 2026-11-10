---
{"title":"Pairing-Based Cryptography","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"페어링 e(aP, bQ) = e(P, Q)^(ab)를 쓰면 DH 삼중쌍이 맞는지 판별할 수 있다(DDH가 쉬워진다).","section":["CryptoHack","ZKPs"]}
---

## 개념

**쌍선형 페어링** $e: G_1 \times G_2 \to G_T$는 다음 성질을 가진다.

$$
e(aP, bQ) = e(P, Q)^{ab}
$$

이 성질 때문에 페어링이 있는 군에서는 **결정적 DH(DDH)**가 쉬워진다. $(aP, bQ, Z)$가 주어졌을 때 $Z = e(P, Q)^{ab}$인지 페어링 한 번으로 확인할 수 있다. BLS 서명, zk-SNARK가 이 성질을 쓴다.

여기서는 BN254(alt_bn128) 곡선을 쓴다. 이더리움 프리컴파일로 유명한 곡선이다.

## 문제

출력의 각 줄에 $(xG_1, yG_2, z)$가 있다. 플래그 비트가 1이면 $z = e(yG_2, xG_1)$이고, 0이면 다른 랜덤 값이 곱해져 있다.

## 풀이

1. 줄마다 `py_ecc`로 $e(yG_2, xG_1)$을 계산해서 $z$와 비교한다.
2. 같으면 1, 다르면 0으로 비트를 모은다.
3. 순서대로 이어 바이트로 바꾸면 플래그가 나온다.

## 풀이 코드
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

## 플래그
```text
crypto{Pa1rings_R_Str0ng}
```
