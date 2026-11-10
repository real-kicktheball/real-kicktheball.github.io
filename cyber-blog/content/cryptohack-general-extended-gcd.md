---
{"title":"Extended GCD","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"확장 유클리드 알고리즘으로 au + bv = gcd(a,b)를 만족하는 u, v를 구한다. 모듈러 역원 계산의 기초다.","section":["CryptoHack","General"]}
---

## 개념

**확장 유클리드 알고리즘**은 GCD와 함께 다음 식을 만족하는 정수 $u, v$(Bézout 계수)도 구한다.

$$
a \cdot u + b \cdot v = \gcd(a, b)
$$

$\gcd(a,b)=1$이면 $a u \equiv 1 \pmod b$가 된다. 즉 $u$가 **$a$의 모듈러 역원**이다. RSA 개인키 $d$를 구할 때 쓰는 계산이 바로 이것이다.

## 문제

소수 $p = 26513$, $q = 32321$에 대해 $p u + q v = \gcd(p, q)$를 만족하는 $u, v$를 구하고, 둘 중 작은 값을 제출한다.

## 풀이

재귀적으로 $\gcd(b, a \bmod b)$의 계수를 구한 뒤 거꾸로 올라오며 계수를 갱신한다.

$$
(x, y) \leftarrow \left(y,\ x - \left\lfloor \tfrac{a}{b} \right\rfloor y\right)
$$

결과는 $u = 10245$, $v = -8404$이다. 실제로 $26513 \cdot 10245 + 32321 \cdot (-8404) = 1$이 성립한다. 작은 값은 **-8404**이다.

## 풀이 코드
```python
def egcd(a,b):
    if b==0:return a,1,0
    g,x,y=egcd(b,a%b)
    return g,y,x-(a//b)*y
g,u,v=egcd(26513,32321)
assert 26513*u+32321*v==g==1
print(min(u,v))
```

## 플래그
```text
-8404
```
