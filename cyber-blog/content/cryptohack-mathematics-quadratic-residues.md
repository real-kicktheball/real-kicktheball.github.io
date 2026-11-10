---
{"title":"Quadratic Residues","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"29를 법으로 하여 세 후보의 제곱근을 전수 조사한다. 가능한 후보 6의 두 근 중 작은 값을 고른다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

29를 법으로 하여 세 후보의 제곱근을 전수 조사한다. 가능한 후보 6의 두 근 중 작은 값을 고른다.

## 최종 풀이 코드

```python
p = 29
candidates = [14, 6, 11]
roots = {n: [x for x in range(p) if x*x % p == n] for n in candidates}
assert sum(bool(v) for v in roots.values()) == 1
flag = min(next(v for v in roots.values() if v))
assert flag*flag % p == 6
print(flag)
```

## 최종 답

`8`
