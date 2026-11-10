---
{"title":"Working with Fields","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"유한체에서 g의 곱셈 역원을 계산한다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

유한체에서 g의 곱셈 역원을 계산한다.

## 최종 풀이 코드

```python
p,g=991,209
d=pow(g,-1,p)
assert g*d % p == 1
print(d)
```

## 최종 답

`569`
