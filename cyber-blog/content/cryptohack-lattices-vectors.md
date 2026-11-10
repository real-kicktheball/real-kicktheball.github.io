---
{"title":"Vectors","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"격자 암호의 기초인 벡터 공간, 선형 결합, 내적을 정리한다.","section":["CryptoHack","Lattices"]}
---

## 개념

격자 암호를 이해하려면 먼저 **벡터**를 다뤄야 한다. $\mathbb{R}^n$의 벡터 $v = (v_1, \dots, v_n)$에는 두 연산이 있다.

- 덧셈과 스칼라 곱: $av + bw$ 형태의 **선형 결합**을 만든다.
- **내적(dot product)**: 두 벡터에서 스칼라 하나를 만든다.

$$
v \cdot w = \sum_{i} v_i w_i
$$

내적이 0이면 두 벡터는 **직교**한다. 벡터의 길이도 내적으로 정의된다.

## 문제

$v = (2, 6, 3)$, $w = (1, 0, 0)$, $u = (7, 7, 2)$일 때 $3(2v - w) \cdot 2u$를 구한다.

## 풀이

1. $2v - w = (4, 12, 6) - (1, 0, 0) = (3, 12, 6)$
2. $3(2v - w) = (9, 36, 18)$
3. $2u = (14, 14, 4)$
4. 내적은 $9 \cdot 14 + 36 \cdot 14 + 18 \cdot 4 = 126 + 504 + 72 =$ **702**

## 풀이 코드
```python
v = (2, 6, 3)
w = (1, 0, 0)
u = (7, 7, 2)
a = [3 * (2 * x - y) for x, y in zip(v, w)]
b = [2 * x for x in u]
print(sum(x * y for x, y in zip(a, b)))
```

## 정답
```text
702
```
