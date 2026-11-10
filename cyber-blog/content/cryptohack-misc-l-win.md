---
{"title":"L-Win","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"LFSR 출력 2L비트만 있으면 Berlekamp–Massey 알고리즘으로 점화식(연결 다항식)을 복원할 수 있다. 점화식을 거꾸로 돌려 초기 상태를 찾는다.","section":["CryptoHack","Misc"]}
---

## 개념

어떤 비트열을 만들어내는 가장 짧은 LFSR의 길이를 **선형 복잡도** $L$이라 한다. **Berlekamp–Massey 알고리즘**은 출력 $2L$비트만 있으면 그 LFSR의 연결 다항식(점화식)을 $O(n^2)$에 찾는다.

$$
s_{t+L} = c_1 s_{t+L-1} \oplus c_2 s_{t+L-2} \oplus \cdots \oplus c_L s_t
$$

$c_L = 1$이면 이 식을 $s_t$에 대해 풀 수 있다. 그래서 **과거 방향으로도** 상태를 되돌릴 수 있다.

## 문제

플래그(384비트)를 초기 상태로 하는 LFSR이 $16 \times 48 = 768$번 클록한 뒤 출력한 2048비트가 주어진다. 탭 위치는 비밀이다.

## 풀이

1. 2048비트에 Berlekamp–Massey를 돌리면 선형 복잡도 $L = 384$와 연결 다항식이 나온다.
2. 최고차 계수가 1이므로 점화식을 역방향으로 적용해 시간 $-1, -2, \dots, -768$의 비트를 차례로 복원한다.
3. 시간 $-768$부터 $-385$까지 384비트가 원래 초기 상태, 즉 플래그다.

## 풀이 코드
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

## 플래그
```text
crypto{minimal_polynomial_in_an_arbitrary_field}
```
