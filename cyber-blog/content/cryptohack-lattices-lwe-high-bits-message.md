---
{"title":"LWE High Bits Message","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"비밀 S가 제공되어 있으므로 t=(b-A\\cdot S)\\bmod q를 계산한다. 고위 비트 메시지는 m\\cdot\\Delta+e이며 \\Delta=\\operatorname{round}(q/p)=255다. 잡음이 \\Delta/2보다 작으므로 t/…","section":["CryptoHack","Lattices"]}
---

분야: Lattices / lwe  
문제: https://cryptohack.org/challenges/post-quantum/#lwe-high-bits  
데이터: https://cryptohack.org/static/challenges/output_575f13474e5a8cc76e938508bce813c2.txt  
검증: 2026-11-10, 로컬 실행 및 CryptoHack 계정 정답 처리 확인

## 풀이 방법

비밀 $S$가 제공되어 있으므로 $t=(b-A\cdot S)\bmod q$를 계산한다. 고위 비트 메시지는 $m\cdot\Delta+e$이며 $\Delta=\operatorname{round}(q/p)=255$다. 잡음이 $\Delta/2$보다 작으므로 $t/\Delta$를 가장 가까운 정수로 반올림하면 $m=201$이다.

## 최종 풀이 코드

Python 3 표준 라이브러리만 사용한다. 실행하면 공식 `output.txt`를 받아 최종 정답을 출력한다.

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

## 검증 방법

코드를 실행하여 아래 출력과 비교한다. 동일한 값을 CryptoHack에 제출한 후 해당 문제에 **solved** 표시가 나타나는 것도 확인했다.

## 최종 정답

```text
201
```
