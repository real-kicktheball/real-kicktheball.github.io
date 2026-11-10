---
{"title":"Armory","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"비밀 분산의 다항식 계수를 랜덤이 아니라 해시 체인으로 만들면 몫 하나만으로 비밀이 복원된다.","section":["CryptoHack","Misc"]}
---

## 개념

**비밀 분산**은 비밀 하나를 여러 조각으로 나눠서, **정해진 수 이상의 조각이 모여야** 비밀을 알 수 있게 하는 방법이다.

### 직선으로 이해하기 (2개 모이면 복원)

비밀이 $s = 5$라 하자. 랜덤 기울기 3을 골라 직선을 만든다.

$$
f(x) = 5 + 3x
$$

친구들에게 직선 위의 점을 하나씩 준다.

- 친구1: $(1, 8)$
- 친구2: $(2, 11)$
- 친구3: $(3, 14)$

점 **하나만으로는** 직선을 알 수 없다. 그 점을 지나는 직선이 무수히 많기 때문이다. 그런데 **두 점**이 모이면 직선이 하나로 정해지고, $x = 0$일 때 값 5가 비밀이다. 이게 **Shamir 비밀 분산**이다. 3개가 필요하면 포물선(2차식)을 쓴다.

### 이 문제의 실수

포물선의 계수를 **랜덤으로 안 고르고**, 이전 값을 해시해서 만들었다. 게다가 조각의 x좌표가 첫 번째 계수와 같다. 그러면 조각 하나만 있어도 나머지 계수를 직접 계산할 수 있다. 모르는 게 비밀 $s$ 하나만 남아서 바로 풀린다.

계수는 반드시 **완전히 랜덤**해야 조각 하나로는 아무것도 알 수 없다.

### 정리

**Shamir 비밀 분산** $(k, n)$은 비밀 $s$를 상수항으로 하는 $k-1$차 다항식을 만든다.

$$
f(x) = s + a_1 x + a_2 x^2 + \cdots + a_{k-1}x^{k-1} \pmod p
$$

$n$명에게 $(x_i, f(x_i))$를 나눠준다. 몫이 $k$개 모이면 라그랑주 보간으로 $s$를 복원한다. $k-1$개 이하로는 아무 정보도 없다.

이 성질은 **계수 $a_i$가 랜덤**일 때만 성립한다. 계수를 비밀이나 공개값에서 결정적으로 만들면 미지수가 줄어든다.

## 문제

3-of-7 분산인데 계수가 해시 체인으로 정해진다. $a_1 = H(s)$, $a_2 = H(a_1)$이다. 몫 하나 $(x, y)$만 주어지고, 이 몫의 $x$는 $a_1 = H(s)$이다.

## 풀이

1. $x = a_1$이므로 $a_2 = H(x)$를 바로 계산할 수 있다.
2. 그러면 $y = s + x \cdot x + a_2 x^2$에서 모르는 건 $s$뿐이다.
3. $s = y - x^2 - a_2 x^2 \bmod p$를 계산한다.
4. 확인으로 $H(s) = x$가 맞는지 봤다.

## 풀이 코드
```python
from ast import literal_eval
from hashlib import sha256
from urllib.request import urlopen

URL="https://cryptohack.org/static/challenges/share_f6dca6a2f215b12ddebb68a90380542d.txt"
x,y=literal_eval(urlopen(URL).read().decode())
p=77793805322526801978326005188088213205424384389488111175220421173086192558047
next_coef=int.from_bytes(sha256(x.to_bytes(32,'big')).digest(),'big')
secret=(y-x*x-next_coef*x*x)%p
flag=secret.to_bytes((secret.bit_length()+7)//8,'big')
assert int.from_bytes(sha256(flag).digest(),'big')==x
print(flag.decode())
```

## 플래그
```text
crypto{fr46m3n73d_b4ckup_vuln?}
```
