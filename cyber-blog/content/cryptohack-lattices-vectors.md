---
{"title":"Vectors","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"벡터의 선형 결합을 먼저 계산하고 마지막에 내적을 취한다. 2v-w=(3,12,6)이므로 3(2v-w)=(9,36,18)이고 2u=(14,14,4)이다. 내적은 126+504+72=702다.","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

벡터의 선형 결합을 먼저 계산하고 마지막에 내적을 취한다. $2v-w=(3,12,6)$이므로 $3(2v-w)=(9,36,18)$이고 $2u=(14,14,4)$이다. 내적은 $126+504+72=702$다.

## 최종 풀이 코드

```python
v = (2, 6, 3)
w = (1, 0, 0)
u = (7, 7, 2)
a = [3 * (2 * x - y) for x, y in zip(v, w)]
b = [2 * x for x in u]
print(sum(x * y for x, y in zip(a, b)))
```

## 최종 정답

```text
702
```
