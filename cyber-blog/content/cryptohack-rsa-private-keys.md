---
{"title":"Private Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"개인키 d는 e의 mod φ(N) 역원이다. ed ≡ 1 (mod φ(N))이면 (m^e)^d = m이 성립한다.","section":["CryptoHack","RSA"]}
---

## 개념

비밀키 $d$는 **"$e$번 곱한 걸 원래대로 되돌리는 횟수"**다. $e \times d$를 $\varphi(N)$으로 나눈 나머지가 1이 되도록 고른다.

$$
e \times d \equiv 1 \pmod{\varphi(N)}
$$

### 직접 해보기 (앞의 작은 RSA: $N = 33$, $e = 3$)

1. $\varphi(33) = (3 - 1)(11 - 1) = 20$
2. $3 \times d$를 20으로 나눈 나머지가 1이 되는 $d$를 찾는다.
3. $3 \times 7 = 21 = 20 + 1$ → $d = 7$

비밀키는 $d = 7$이다.

### 왜 되돌아올까?

$m$을 $e$번 곱하고, 그걸 또 $d$번 곱하면 총 $e \times d = 21$번 곱한 셈이다. $21 = 20 + 1$이고, 20번($\varphi(N)$번) 곱하면 1로 돌아오니까 결국 $m$을 1번 곱한 것과 같다. 그래서 원래 메시지가 나온다.

### 정리

**개인 지수** $d$는 $e$의 $\varphi(N)$에 대한 모듈러 역원이다.

$$
e \cdot d \equiv 1 \pmod{\varphi(N)}
$$

이러면 복호화가 원래 평문으로 돌아온다. $ed = 1 + k\varphi(N)$으로 쓰고 오일러 정리를 적용하면 다음과 같다.

$$
c^d = m^{ed} = m^{1 + k\varphi(N)} = m \cdot \left(m^{\varphi(N)}\right)^k \equiv m \pmod N
$$

$d$는 확장 유클리드 알고리즘이나 `pow(e, -1, phi)`로 구한다.

## 문제

앞 문제의 $p$, $q$와 $e = 65537$로 $d$를 구한다.

## 풀이

$\varphi(N) = (p-1)(q-1)$을 구하고 `pow(e, -1, phi)`를 계산하면 된다. $ed \bmod \varphi(N) = 1$인 것도 확인했다.

## 풀이 코드
```python
p=857504083339712752489993810777
q=1029224947942998075080348647219
e=65537
phi=(p-1)*(q-1)
d=pow(e,-1,phi)
assert e*d % phi == 1
print(d)
```

## 정답
`121832886702415731577073962957377780195510499965398469843281`
