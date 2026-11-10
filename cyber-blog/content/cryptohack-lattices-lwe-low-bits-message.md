---
{"title":"LWE Low Bits Message","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"메시지를 하위 비트에 넣는 LWE는 오차를 p배 해서 더한다. 중앙 대표값으로 바꾼 뒤 mod p를 취한다.","section":["CryptoHack","Lattices"]}
---

## 개념

이번엔 반대로 메시지를 **낮은 자리**에 넣는다. 오차를 크게 키워서($p$배) 높은 자리로 보내고, 메시지는 맨 아래에 둔다.

$$
\text{값} = p \times \text{오차} + \text{메시지}
$$

받는 사람은 $p$로 나눈 나머지만 보면 된다. 오차 부분은 $p$의 배수라서 사라진다.

### 직접 해보기 ($p = 10$)

- 메시지 $m = 7$, 오차 $e = 3$: $10 \times 3 + 7 = 37$
- $37 \bmod 10 = 7$ ✔

### 함정: 오차가 음수일 때

오차가 $e = -3$이면 $10 \times (-3) + 7 = -23$이다. 그런데 나머지 세계($q = 100$)에서 $-23$은 **77**로 표시된다.

- 그대로 계산하면: $77 \bmod 10 = 7$ (우연히 맞음)
- 일반적으로는 $q$가 $p$의 배수가 아니라서 틀린 값이 나온다.

그래서 값이 $q$의 절반보다 크면 **$q$를 빼서 음수로 되돌린** 다음 나머지를 구해야 한다.

### 이 문제에서

계산 결과가 64656인데, 65537의 절반보다 크다. 그래서 $64656 - 65537 = -881$로 바꾼 뒤 257로 나눈 나머지를 구하면 정답 **147**이 나온다.

### 정리

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
