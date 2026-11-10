---
{"title":"Private Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"RSA 비밀지수 d는 e의 φ(N) 법 역원이다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

RSA 비밀지수 d는 e의 φ(N) 법 역원이다.

## 최종 풀이 코드

```python
p=857504083339712752489993810777
q=1029224947942998075080348647219
e=65537
phi=(p-1)*(q-1)
d=pow(e,-1,phi)
assert e*d % phi == 1
print(d)
```

## 최종 답

`121832886702415731577073962957377780195510499965398469843281`
