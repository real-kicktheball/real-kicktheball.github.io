---
{"title":"LWE Low Bits Message","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"비밀 S를 빼면 t=e p+m\\pmod q다. 이 인스턴스에서 표준 대표값 t=64656은 음수 -881이 q를 더해 표현된 값이다. 중앙 대표값으로 옮긴 뒤 p로 나눈 나머지를 취해 m=147을 얻는다.","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

비밀 $S$를 빼면 $t=e p+m\pmod q$다. 이 인스턴스에서 표준 대표값 $t=64656$은 음수 $-881$이 $q$를 더해 표현된 값이다. 중앙 대표값으로 옮긴 뒤 $p$로 나눈 나머지를 취해 $m=147$을 얻는다.

## 최종 풀이 코드

Python 3 표준 라이브러리만 사용한다. 실행하면 공식 `output.txt`를 받아 최종 정답을 출력한다.

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

## 검증 방법

코드를 실행하여 아래 출력과 비교한다. 동일한 값을 CryptoHack에 제출한 후 해당 문제에 **solved** 표시가 나타나는 것도 확인했다.

## 최종 정답

```text
147
```
