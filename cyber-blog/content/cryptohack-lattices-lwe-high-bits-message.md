---
{"title":"LWE High Bits Message","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"LWE 암호에서 메시지를 Δ = q/p로 크게 키워 상위 비트에 넣으면, 작은 오차는 반올림으로 사라진다.","section":["CryptoHack","Lattices"]}
---

## 개념

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
