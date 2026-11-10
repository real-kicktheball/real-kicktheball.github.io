---
{"title":"Jack's Birthday Confusion","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"생일 역설 때문에 아무 충돌이나 찾는 건 훨씬 쉽다. 11비트 해시에서 75% 확률로 충돌이 생기는 입력 개수를 구한다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

**생일 역설**은 23명만 모여도 생일이 같은 사람이 있을 확률이 50%를 넘는다는 것이다. 특정 날짜가 아니라 **아무 두 명**이면 되기 때문이다.

$k$개 입력이 모두 다른 해시값을 가질 확률은 다음과 같다.

$$
P(\text{충돌 없음}) = \prod_{i=0}^{k-1} \left(1 - \frac{i}{N}\right) \approx e^{-k^2 / 2N}
$$

그래서 충돌은 약 $\sqrt{N}$번이면 생긴다. $n$비트 해시의 충돌 저항성이 $2^{n/2}$인 이유다. SHA-256이 128비트 보안이라고 하는 것도 이 때문이다.

## 문제

JACK11(11비트)에서 75% 확률로 충돌이 하나라도 생기려면 몇 개의 입력을 해시해야 하는가?

## 풀이

$k = 1, 2, \dots$로 늘려가며 위 곱을 계산한다. $1 - P \ge 0.75$가 되는 첫 $k$는 **76**이다. 앞 문제의 1420과 비교하면 충돌 찾기가 훨씬 쉽다는 게 보인다.

## 풀이 코드
```python
N = 2**11
no_collision = 1.0
for n in range(1, N+2):
    no_collision *= (N-(n-1))/N
    if 1-no_collision >= 0.75:
        print(n)
        break
```

## 플래그
`76`
