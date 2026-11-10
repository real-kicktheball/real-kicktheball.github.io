---
{"title":"Private Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"개인키 d는 e의 mod φ(N) 역원이다. ed ≡ 1 (mod φ(N))이면 (m^e)^d = m이 성립한다.","section":["CryptoHack","RSA"]}
---

## 개념

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
