---
{"title":"Point Negation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"타원곡선 점 P=(x, y)의 역원은 -P=(x, -y)다. 유한체에서는 -y를 p - y로 쓴다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

타원곡선은 x축 대칭이다. $(x, y)$가 곡선 위에 있으면 $(x, -y)$도 곡선 위에 있다. $P$와 $-P$를 잇는 직선은 수직선이라 세 번째 교점이 무한원점 $O$이다. 그래서 다음이 성립한다.

$$
P + (-P) = O, \qquad -P = (x, -y)
$$

유한체 $\mathbb{F}_p$에서는 $-y$를 $p - y$로 쓴다.

## 문제

곡선 $E: y^2 = x^3 + 497x + 1768 \pmod{9739}$와 $P = (8045, 6936)$이 주어진다. $P + Q = O$인 $Q$를 구한다.

## 풀이

$Q = -P = (8045,\ -6936 \bmod 9739) = (8045, 2803)$이다.

## 풀이 코드
```python
p = 9739
x, y = 8045, 6936
q = (x, -y % p)
assert (y+q[1]) % p == 0
print(f'crypto{{{q[0]},{q[1]}}}')
```

## 플래그
`crypto{8045,2803}`
