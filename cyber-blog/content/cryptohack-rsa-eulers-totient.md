---
{"title":"Euler's Totient","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"두 소수의 곱에 대한 오일러 피함수는 (p−1)(q−1)이다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

두 소수의 곱에 대한 오일러 피함수는 (p−1)(q−1)이다.

## 최종 풀이 코드

```python
p=857504083339712752489993810777
q=1029224947942998075080348647219
phi=(p-1)*(q-1)
assert phi > 0
print(phi)
```

## 최종 답

`882564595536224140639625987657529300394956519977044270821168`
