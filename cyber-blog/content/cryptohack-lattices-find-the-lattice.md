---
{"title":"Find the Lattice","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"NTRU 같은 격자 암호의 공개키 h에서 작은 비밀 (f, g)는 2차원 격자의 짧은 벡터다. 가우스 축소로 비밀키를 찾는다.","section":["CryptoHack","Lattices"]}
---

## 개념

다음과 같은 장난감 암호를 생각해보자.

- 비밀키: 작은 수 $f$, $g$
- 공개키: $h = f^{-1} g \bmod q$

$fh \equiv g \pmod q$이므로 어떤 정수 $k$에 대해 다음이 성립한다.

$$
f \cdot (1, h) + k \cdot (0, q) = (f, g)
$$

즉 $(f, g)$는 기저 $\{(1, h), (0, q)\}$로 만든 격자 위의 점이다. $f$, $g$가 $q$에 비해 작으면 이 격자의 **가장 짧은 벡터**가 된다. 2차원이니 가우스 축소로 바로 찾는다.

## 문제

공개키 $(q, h)$와 암호문 $e = (r h + m) \bmod q$가 주어진다.

## 풀이

1. 격자 $\langle (1, h), (0, q) \rangle$에 가우스 축소를 해서 짧은 벡터 $(f, g)$를 얻는다.
2. $a = f e \bmod q = (r g + f m) \bmod q$를 계산한다. 값들이 작아서 실제 정수로 성립한다.
3. $\bmod g$를 하면 $r g$가 사라진다. 그래서 $m = a \cdot f^{-1} \bmod g$이다.

## 풀이 코드
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

## 정답
```text
crypto{Gauss_lattice_attack!}
```
