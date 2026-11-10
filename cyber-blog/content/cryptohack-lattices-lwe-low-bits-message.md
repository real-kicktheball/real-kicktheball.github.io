---
{"title":"LWE Low Bits Message","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"메시지를 하위 비트에 넣는 LWE는 오차를 p배 해서 더한다. 중앙 대표값으로 바꾼 뒤 mod p를 취한다.","section":["CryptoHack","Lattices"]}
---

## 개념

반대로 메시지를 **하위 비트**에 넣을 수도 있다. 오차를 $p$배 키워서 더하는 방식이다.

$$
b = A \cdot S + p \cdot e + m \pmod q
$$

$t = b - A \cdot S = pe + m$이 실제 정수로 성립하면 $\bmod p$를 하는 것만으로 $m$이 나온다. 조심할 점은 $e$가 음수일 수 있다는 것이다. $\bmod q$ 결과를 그대로 쓰면 안 되고 **중앙 대표값**($-q/2 \sim q/2$)으로 바꿔야 한다.

## 문제

$q = 65537$, $p = 257$, 비밀 $S$, 암호문 $(A, b)$가 주어진다.

## 풀이

1. $t = (b - A \cdot S) \bmod q = 64656$이 나온다.
2. $q/2$보다 크므로 $t - q = -881$로 바꾼다.
3. $-881 \bmod 257 =$ **147**이다.

64656을 그대로 $\bmod 257$ 하면 틀린 값이 나온다.

## 풀이 코드
```python
from ast import literal_eval
from urllib.request import urlopen

URL = "https://cryptohack.org/static/challenges/output_9eb8e78124c8c48ec9eb687bf1d10a4e.txt"
data = {}
for line in urlopen(URL).read().decode().splitlines():
    if ' = ' in line:
        k,v=line.split(' = ',1)
        data[k.strip()] = literal_eval(v.strip())
q,p=65537,257
t=(data['b']-sum(a*s for a,s in zip(data['A'],data['S'])))%q
if t>q//2: t-=q
print(t%p)
```

## 정답
```text
147
```
