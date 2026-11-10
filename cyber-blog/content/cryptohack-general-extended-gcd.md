---
{"title":"Extended GCD","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"확장 유클리드 알고리즘으로 au + bv = gcd(a,b)를 만족하는 u, v를 구한다. 모듈러 역원 계산의 기초다.","section":["CryptoHack","General"]}
---

## 개념

유클리드 호제법을 조금 더 하면 이런 질문에도 답할 수 있다.

> "$a$를 몇 번, $b$를 몇 번 더하고 빼면 최대공약수를 만들 수 있을까?"

$$
a \times u + b \times v = \gcd(a, b)
$$

### 직접 해보기 (3과 7)

3과 7의 최대공약수는 1이다. 3을 몇 번, 7을 몇 번 써서 1을 만들어보자.

$$
3 \times 5 + 7 \times (-2) = 15 - 14 = 1
$$

$u = 5$, $v = -2$이다. 손으로 찾았지만, 확장 유클리드 알고리즘은 이걸 자동으로 찾아준다.

### 이게 왜 중요할까?

위 식을 "7로 나눈 나머지"로만 보면 $7 \times (-2)$ 부분은 사라진다.

$$
3 \times 5 = 15 = 2 \times 7 + 1
$$

즉 **3에 5를 곱하면 7로 나눈 나머지가 1**이다. 이런 5를 "3의 역원"이라고 부른다. 일반 숫자에서 $3 \times \frac{1}{3} = 1$인 것처럼, 나머지 세계에서는 5가 $\frac{1}{3}$ 역할을 한다. RSA 비밀키를 만들 때 바로 이 계산을 쓴다.

### 정리

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
