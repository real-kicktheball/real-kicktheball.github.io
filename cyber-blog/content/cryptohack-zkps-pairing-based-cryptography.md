---
{"title":"Pairing-Based Cryptography","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"페어링 e(aP, bQ) = e(P, Q)^(ab)를 쓰면 DH 삼중쌍이 맞는지 판별할 수 있다(DDH가 쉬워진다).","section":["CryptoHack","ZKPs"]}
---

## 개념

**페어링**은 점 두 개를 넣으면 숫자 하나를 돌려주는 특별한 함수다. 가장 중요한 성질은 다음과 같다.

$$
e(aP,\ bQ) = e(P,\ Q)^{ab}
$$

점에 곱한 숫자들이 **결과의 지수에서 곱해진다**.

### 이걸로 뭘 할 수 있을까?

보통 Diffie-Hellman에서 $aP$, $bQ$, 그리고 어떤 값 $Z$를 보고 "$Z$가 정말 $a \times b$로 만든 값인가?"를 판단하기는 어렵다. 그런데 페어링이 있으면 계산 한 번으로 확인할 수 있다.

$$
Z \stackrel{?}{=} e(aP,\ bQ)
$$

### 비유

두 사람이 각자 비밀 숫자로 물감을 섞어 공개했다. 누가 "이게 두 비밀을 다 섞은 색이야"라고 주장할 때, 페어링은 **비밀을 모르고도** 그 주장이 맞는지 확인해주는 특수 안경이다.

### 이 문제에서

각 줄에 $xG_1$, $yG_2$, $z$가 있다. 비트가 1이면 $z = e(yG_2, xG_1)$로 만들었고, 0이면 다른 값이다. 페어링을 직접 계산해서 같으면 1, 다르면 0으로 적는다. 비트를 이어 붙이면 플래그가 나온다.

### 정리

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
