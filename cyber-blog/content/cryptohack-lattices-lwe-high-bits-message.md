---
{"title":"LWE High Bits Message","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"LWE 암호에서 메시지를 Δ = q/p로 크게 키워 상위 비트에 넣으면, 작은 오차는 반올림으로 사라진다.","section":["CryptoHack","Lattices"]}
---

## 개념

LWE 암호문에는 **작은 오차**가 섞여 있다. 그래서 메시지를 숨길 때 오차 때문에 메시지가 망가지지 않도록 **크게 벌려서** 넣는다.

### 비유: 큰 눈금 자

1cm 눈금 자로 길이를 재는데, 손이 떨려서 ±3mm 오차가 생긴다고 하자. 그래도 **반올림**하면 정확한 cm 값을 알 수 있다. 오차가 눈금 간격의 절반(5mm)보다 작기 때문이다.

### 직접 해보기 ($q = 100$, 메시지 범위 0~9, 눈금 $\Delta = 10$)

- 메시지 $m = 7$을 크게 벌린다: $7 \times 10 = 70$
- 오차 $+3$이 섞인다: $73$
- 받는 사람: $73 \div 10 = 7.3$ → 반올림 → **7** ✔

오차가 눈금의 절반(5)보다 작으면 항상 정확히 복원된다. 메시지를 숫자의 **높은 자리**에 넣는 방식이라서 "high bits"라고 한다.

### 이 문제에서

$q = 65537$, 메시지 범위 $p = 257$이라서 눈금은 $\Delta = 65537 / 257 \approx 255$다. 계산한 값을 255로 나누고 반올림하면 메시지가 나온다.

### 정리

LWE로 메시지를 암호화하는 방법 중 하나는 메시지를 **상위 비트**에 넣는 것이다.

$$
b = A \cdot S + \Delta m + e \pmod q, \qquad \Delta = \operatorname{round}(q / p)
$$

$m$은 $0 \sim p-1$ 범위다. $\Delta$배 해서 크게 벌려놨기 때문에 오차 $|e| < \Delta/2$이면 반올림으로 복원된다.

$$
m = \operatorname{round}\!\left(\frac{b - A \cdot S}{\Delta}\right) \bmod p
$$

Kyber 같은 실제 LWE 암호도 이 방식을 쓴다.

## 문제

$q = 65537$, $p = 257$, 비밀 $S$, 암호문 $(A, b)$가 주어진다.

## 풀이

1. $\Delta = \operatorname{round}(65537/257) = 255$이다.
2. $t = (b - A \cdot S) \bmod q$를 구한다.
3. $t / 255$를 반올림하고 $\bmod 257$을 하면 **201**이다.

## 풀이 코드
```python
from ast import literal_eval
from urllib.request import urlopen

URL = "https://cryptohack.org/static/challenges/output_575f13474e5a8cc76e938508bce813c2.txt"
data = {}
for line in urlopen(URL).read().decode().splitlines():
    if ' = ' in line:
        k,v=line.split(' = ',1)
        data[k.strip()] = literal_eval(v.strip())
q,p=65537,257
delta=round(q/p)
t=(data['b']-sum(a*s for a,s in zip(data['A'],data['S'])))%q
print(round(t/delta)%p)
```

## 정답
```text
201
```
