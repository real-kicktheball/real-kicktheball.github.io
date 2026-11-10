---
{"title":"Chinese Remainder Theorem","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"서로소인 법의 곱 935에서 표준 중국인의 나머지 정리 합을 구성한다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

서로소인 법의 곱 935에서 표준 중국인의 나머지 정리 합을 구성한다.

## 최종 풀이 코드

```python
mods = [5, 11, 17]
rems = [2, 3, 5]
N = 1
for n in mods: N *= n
x = sum(a * (N//n) * pow(N//n, -1, n) for a,n in zip(rems,mods)) % N
assert [x%n for n in mods] == rems
print(x)
```

## 최종 답

`872`
