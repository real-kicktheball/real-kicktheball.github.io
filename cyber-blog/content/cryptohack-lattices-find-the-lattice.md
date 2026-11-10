---
{"title":"Find the Lattice","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"공개키 (q,h)에서 fh\\equiv g\\pmod q를 만족하는 작은 (f,g)가 2차원 격자 \\langle(1,h),(0,q)\\rangle에 있다. Gauss 축소로 이 짧은 벡터를 복원한다. 그런 다음 fe\\bmod q에서 r g + f…","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

공개키 $(q,h)$에서 $fh\equiv g\pmod q$를 만족하는 작은 $(f,g)$가 2차원 격자 $\langle(1,h),(0,q)\rangle$에 있다. Gauss 축소로 이 짧은 벡터를 복원한다. 그런 다음 $fe\bmod q$에서 $r g + fm$을 얻고, $g$에 대한 역원을 이용해 $m$을 계산한다.

## 최종 풀이 코드

Python 3 표준 라이브러리만 사용한다. 실행하면 공식 `output.txt`를 받아 최종 정답을 출력한다.

```python
from ast import literal_eval
from fractions import Fraction
from urllib.request import urlopen

URL = "https://cryptohack.org/static/challenges/output_bc9603ab4045eea70eae450862d4be91.txt"
lines = urlopen(URL).read().decode().splitlines()
q,h = literal_eval(lines[0].split(': ',1)[1])
e = int(lines[1].split(': ',1)[1])

def dot(a,b): return a[0]*b[0] + a[1]*b[1]
def nearest(x):
    return (x.numerator+x.denominator//2)//x.denominator if x>=0 else -nearest(-x)
a,b = (1,h),(0,q)
while True:
    if dot(b,b)<dot(a,a): a,b=b,a
    k=nearest(Fraction(dot(a,b),dot(a,a)))
    if k==0: break
    b=(b[0]-k*a[0],b[1]-k*a[1])
for f,g in (a,b):
    if f<0: f,g=-f,-g
    if f>0 and g>0 and (f*h-g)%q==0:
        m=((f*e)%q)*pow(f,-1,g)%g
        flag=m.to_bytes((m.bit_length()+7)//8,'big').decode()
        print(flag)
        break
```

## 검증 방법

코드를 실행하여 아래 출력과 비교한다. 동일한 값을 CryptoHack에 제출한 후 해당 문제에 **solved** 표시가 나타나는 것도 확인했다.

## 최종 정답

```text
crypto{Gauss_lattice_attack!}
```
