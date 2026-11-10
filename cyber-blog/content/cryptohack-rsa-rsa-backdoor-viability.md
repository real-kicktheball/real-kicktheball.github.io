---
{"title":"RSA Backdoor Viability","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"4p - 1 = Ds² 형태(D가 작음)인 소수는 복소곱셈(CM) 타원곡선을 이용한 4p-1 방법으로 인수분해된다.","section":["CryptoHack","RSA"]}
---

## 개념

**백도어**는 "뒷문"이다. 겉보기엔 튼튼한 자물쇠인데, 만든 사람만 아는 비밀 통로가 있는 것이다.

이 문제의 소수는 겉보기엔 평범한 큰 소수다. 그런데 특별한 공식으로 만들어졌다.

$$
p = \frac{427 s^2 + 1}{4}
$$

이렇게 만들면 $4p - 1 = 427 \times s^2$라는 특별한 모양이 된다. 이 모양을 아는 사람은 **특수한 타원곡선**을 이용해서 $N$을 쪼갤 수 있다(4p-1 방법).

### 비슷한 예: 너무 매끈한 수

$p - 1$이 작은 소수들로만 이루어져 있으면($p = 31$이면 $p - 1 = 30 = 2 \times 3 \times 5$) "Pollard $p-1$"이라는 방법으로 쪼개진다. 이 문제는 $p - 1$ 대신 $4p - 1$에 특별한 모양을 숨겼다.

### 교훈

소수에 **어떤 규칙이든** 있으면 약점이 될 수 있다. 소수는 완전히 랜덤하게 골라야 한다.

### 정리

$p - 1$이 작은 소수들로만 이루어지면 Pollard $p-1$ 방법으로 인수분해된다. 이와 비슷하게 $4p - 1$이 특수한 형태여도 인수분해된다.

$$
4p - 1 = D s^2 \qquad (D\text{가 작은 square-free 수})
$$

이 경우 판별식 $-D$인 **복소곱셈(CM) 타원곡선**을 $\bmod N$에서 만든다. 그러면 그 곡선의 위수가 $\bmod p$에서 정확히 $p+1$이 된다. 이 성질로 $p$를 분리해낼 수 있다(Cheng의 4p-1 방법). 일부러 이런 소수를 심어두면 RSA 백도어가 된다.

## 문제

소수 생성 코드가 $p = (427 s^2 + 1)/4$ 형태로 만든다. 즉 $4p - 1 = 427 s^2$이다.

## 풀이

1. 의도된 풀이는 $D = 427$로 4p-1 방법을 적용하는 것이다.
2. 나는 이 $N$의 인수가 FactorDB에 공개돼 있어서 그걸 조회했다.
3. 인수 중 하나가 실제로 $(4p-1)/427$이 완전제곱수인 형태인지 확인했다.
4. 그다음 일반 RSA처럼 복호화했다.

## 풀이 코드
```python
import math, re, requests
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/output_57c296f30a4d023c3c29f9b311da7c85.txt'
data=requests.get(url,timeout=20).text
v={k:int(x) for k,x in re.findall(r'(?m)^(n|e|c) = (\d+)',data)}
n,e,c=v['n'],v['e'],v['c']
r=requests.get('https://factordb.com/api',params={'query':str(n)},timeout=20)
r.raise_for_status()
factors=[int(p) for p,mult in r.json()['factors'] for _ in range(mult)]
assert len(factors)==2 and math.prod(factors)==n
p,q=factors
assert any((4*z-1)%427==0 and math.isqrt((4*z-1)//427)**2==(4*z-1)//427 for z in factors)
d=pow(e,-1,(p-1)*(q-1))
m=pow(c,d,n)
assert pow(m,e,n)==c
print(long_to_bytes(m).decode())
```

## 플래그
`crypto{I_want_to_Break_Square-free_4p-1}`
