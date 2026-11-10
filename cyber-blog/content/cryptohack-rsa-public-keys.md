---
{"title":"Public Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"N=pq를 만들고 m^e mod N을 계산한다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

N=pq를 만들고 m^e mod N을 계산한다.

## 최종 풀이 코드

```python
p,q,e,m = 17,23,65537,12
N=p*q
c=pow(m,e,N)
assert 0 <= c < N
print(c)
```

## 최종 답

`301`
