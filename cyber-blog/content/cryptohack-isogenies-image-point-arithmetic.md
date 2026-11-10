---
{"title":"Image Point Arithmetic","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"아이소제니는 군 준동형이라 φ(P+Q) = φ(P) + φ(Q)다. 상(image)들만 알면 합의 상도 덧셈 공식으로 구한다.","section":["CryptoHack","Isogenies"]}
---

## 개념

아이소제니는 덧셈을 보존한다.

$$
\phi(P + Q) = \phi(P) + \phi(Q)
$$

그래서 $\phi$ 자체를 몰라도 $\phi(P)$, $\phi(Q)$만 알면 $\phi(P + Q)$는 공역 곡선 $E'$ 위의 점 덧셈으로 구할 수 있다. SIDH 같은 프로토콜이 상대에게 기저점의 상 $\phi(P)$, $\phi(Q)$를 보내는 것도 이 성질 때문이다.

## 문제

$p = 63079$에서 $\phi(P) = (48622, 27709)$, $\phi(Q) = (9460, 13819)$가 주어진다. $\phi(P + Q)$의 x 좌표를 구한다.

## 풀이

두 점의 x 좌표가 다르므로 일반 덧셈 공식을 쓴다.

$$
\lambda = \frac{13819 - 27709}{9460 - 48622} \bmod p, \qquad x_3 = \lambda^2 - x_1 - x_2
$$

계산하면 $x_3 =$ **37097**이다. 이 공식은 곡선의 $a$, $b$와 상관없이 x 좌표가 정해진다.

## 풀이 코드
```python
p=63079
x1,y1=48622,27709
x2,y2=9460,13819
slope=((y2-y1)*pow(x2-x1,-1,p))%p
x3=(slope*slope-x1-x2)%p
print(x3)
```

## 정답
```text
37097
```
