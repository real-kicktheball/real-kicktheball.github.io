---
{"title":"DLOG on the Surface","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"Weil pairing은 쌍선형이라 타원곡선 점의 계수 문제를 유한체 이산로그로 바꾼다. 위수가 2의 거듭제곱이면 쉽게 풀린다.","section":["CryptoHack","Isogenies"]}
---

## 개념

**Weil 페어링**은 곡선 위의 점 두 개를 넣으면 **숫자 하나**를 돌려주는 특별한 함수다. 중요한 성질이 있다.

$$
e(aP,\ bQ) = e(P,\ Q)^{ab}
$$

점에 곱한 숫자가 **결과의 지수로 빠져나온다**.

### 이걸 어디에 쓸까?

$R = aP + bQ$에서 $a$, $b$를 찾는 문제가 있다고 하자. 페어링을 쓰면 이렇게 된다.

$$
e(R, Q) = e(P, Q)^a
$$

($Q$끼리의 페어링은 1이라서 $b$ 부분이 사라진다)

곡선 위의 어려운 문제가 **보통 숫자의 거듭제곱 문제**로 바뀐다. 이 문제에서는 위수가 $2^{127}$이라서 거듭제곱 문제가 쉽게 풀린다.

### 직접 해보기 (지수가 빠져나오는 느낌)

$g = 2$, $a = 3$이면 $g^a = 8$이다. 8에서 지수 3을 찾는 건 $2 \to 4 \to 8$로 세 번이라 쉽다. 숫자가 $2^{127}$ 범위여도 2의 거듭제곱 구조라서 Pohlig–Hellman 방법으로 쪼개서 빨리 찾는다.

### 정리

**Weil pairing** $e_n: E[n] \times E[n] \to \mu_n$은 $n$-꼬임점 두 개를 $n$제곱근 하나로 보내는 함수다. 다음 성질이 핵심이다.

- **쌍선형성**: $e_n(aP, bQ) = e_n(P, Q)^{ab}$
- **비퇴화성**: $P$, $Q$가 $E[n]$의 기저이면 $e_n(P, Q)$는 원시 $n$제곱근이다.

$R = aP + bQ$라 하자. 그러면 각 계수가 지수로 분리된다.

$$
e_n(R, Q) = e_n(P, Q)^a, \qquad e_n(P, R) = e_n(P, Q)^b
$$

타원곡선 위의 문제가 유한체 $\mathbb{F}_{p^2}^{\times}$의 이산로그로 바뀐다(MOV 공격과 같은 아이디어).

## 문제

$p = 2^{127} - 1$에서 $E: y^2 = x^3 + x$ 위의 기저 $P$, $Q$와 두 점 $R = aP + bQ$, $S = cP + dQ$가 주어진다. $a, b, c, d$를 구해 AES 키를 만든다.

## 풀이

1. $n = p + 1 = 2^{127}$이다. $g = e_n(P, Q)$를 구한다.
2. $e_n(R, Q) = g^a$, $e_n(P, R) = g^b$에서 이산로그로 $a$, $b$를 구한다. $c$, $d$도 같은 방식이다.
3. 위수가 $2^{127}$이라 Pohlig–Hellman으로 금방 풀린다.
4. 네 수의 10진 문자열을 이어 SHA-256으로 키를 만들고 AES-CBC를 복호화한다.

## 풀이 코드
```python
from sage.all import *
from urllib.request import urlopen
import re,hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
p=2**127-1;n=p+1
F.<i>=GF(p^2,modulus=[1,0,1])
E=EllipticCurve(F,[1,0])
text=urlopen('https://cryptohack.org/static/challenges/output_a9fcd0db30822de938de639df287ab54.txt').read().decode()
pts={}
for label,x,y in re.findall(r'([PQRS]) = \((.*?) : (.*?) : 1\)',text):
 pts[label]=E(sage_eval(x,locals={'i':i}),sage_eval(y,locals={'i':i}))
P,Q,R,S=[pts[x] for x in 'PQRS']
base=P.weil_pairing(Q,n)
a=discrete_log(R.weil_pairing(Q,n),base,ord=n)
b=discrete_log(P.weil_pairing(R,n),base,ord=n)
c=discrete_log(S.weil_pairing(Q,n),base,ord=n)
d=discrete_log(P.weil_pairing(S,n),base,ord=n)
assert R==a*P+b*Q and S==c*P+d*Q
key=hashlib.sha256((str(a)+str(b)+str(c)+str(d)).encode()).digest()
iv=bytes.fromhex(re.search(r"iv = '(.*?)'",text).group(1))
ct=bytes.fromhex(re.search(r"ct = '(.*?)'",text).group(1))
print(unpad(AES.new(key,AES.MODE_CBC,iv).decrypt(ct),16).decode())
```

## 플래그
```text
crypto{now_try_writing_a_function_for_fast_torsion_basis_generation!}
```
