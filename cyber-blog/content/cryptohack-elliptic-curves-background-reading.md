---
{"title":"Background Reading","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"타원곡선 위 점들은 덧셈에 대해 아벨 군을 이룬다. ECC는 이 군에서 이산로그가 어렵다는 데 기반한다.","section":["CryptoHack","Elliptic Curves"]}
---

## 개념

**타원곡선**은 다음 꼴의 방정식을 만족하는 점 $(x, y)$들의 집합이다(Weierstrass 형태).

$$
E: y^2 = x^3 + ax + b, \qquad 4a^3 + 27b^2 \ne 0
$$

조건 $4a^3 + 27b^2 \ne 0$은 곡선에 뾰족점이나 교차점이 없게 한다. 여기에 무한원점 $O$를 더하면 점들끼리 "덧셈"을 정의할 수 있다. 이 덧셈은 군의 성질을 모두 만족한다.

| 성질 | 내용 |
|---|---|
| 항등원 | $P + O = P$ |
| 역원 | $P + (-P) = O$ |
| 결합법칙 | $(P + Q) + R = P + (Q + R)$ |
| 교환법칙 | $P + Q = Q + P$ |

교환법칙까지 성립하는 군을 **아벨 군(abelian group)**이라 한다.

ECC는 $Q = nP$에서 $n$을 찾는 **타원곡선 이산로그 문제(ECDLP)**가 어렵다는 데 기반한다. 같은 보안 수준에서 RSA보다 키가 훨씬 짧다. 256비트 ECC가 3072비트 RSA 수준이다.

## 문제

교환법칙을 만족하는 군을 무엇이라 부르는지 묻는다.

## 풀이

답은 `crypto{abelian}`이다.

## 풀이 코드
```python
print('crypto{abelian}')
```

## 플래그
`crypto{abelian}`
