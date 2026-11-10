---
{"title":"LWE High Bits Message","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"비밀 S가 제공되어 있으므로 t=(b-A\\cdot S)\\bmod q를 계산한다. 고위 비트 메시지는 m\\cdot\\Delta+e이며 \\Delta=\\operatorname{round}(q/p)=255다. 잡음이 \\Delta/2보다 작으므로 t/…","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

비밀 $S$가 제공되어 있으므로 $t=(b-A\cdot S)\bmod q$를 계산한다. 고위 비트 메시지는 $m\cdot\Delta+e$이며 $\Delta=\operatorname{round}(q/p)=255$다. 잡음이 $\Delta/2$보다 작으므로 $t/\Delta$를 가장 가까운 정수로 반올림하면 $m=201$이다.

## 최종 풀이 코드

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

## 최종 정답

```text
201
```
