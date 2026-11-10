---
{"title":"Quadratic Residues","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"이차잉여는 x² ≡ a (mod p)의 해가 존재하는 a다. p=29에서 후보 세 개 중 이차잉여를 찾고 제곱근을 구한다.","section":["CryptoHack","Mathematics"]}
---

## 개념

$a$가 $p$에 대해 **이차잉여(quadratic residue)**라는 건 다음 식을 만족하는 $x$가 있다는 뜻이다.

$$
x^2 \equiv a \pmod p
$$

이런 $x$가 없으면 $a$는 **이차비잉여(quadratic non-residue)**다. 해가 있으면 $x$와 $-x$ 두 개가 쌍으로 나온다.

$\mathbb{F}_p^{\times}$의 원소 $p-1$개 중 정확히 절반이 이차잉여다. 이차잉여끼리의 곱셈은 다음 규칙을 따른다.

| 곱 | 결과 |
|---|---|
| 잉여 × 잉여 | 잉여 |
| 잉여 × 비잉여 | 비잉여 |
| 비잉여 × 비잉여 | 잉여 |

부호의 곱셈($+\cdot+=+$, $+\cdot-=-$, $-\cdot-=+$)과 같은 규칙이다.

## 문제

$p = 29$, 후보 `ints = [14, 6, 11]` 중 이차잉여인 수를 찾고, 그 제곱근 중 작은 값을 제출한다.

## 풀이

$p$가 작아서 $x = 0 \sim 28$을 모두 제곱해 보면 된다.

- 14, 11이 되는 $x$는 없다. 둘 다 이차비잉여다.
- 6은 $8^2 = 64 = 2 \cdot 29 + 6$이므로 이차잉여다.

다른 근은 $-8 \equiv 21$이다($21^2 = 441 \equiv 6$). 작은 값인 **8**이 답이다.

## 풀이 코드
```python
p = 29
candidates = [14, 6, 11]
roots = {n: [x for x in range(p) if x*x % p == n] for n in candidates}
assert sum(bool(v) for v in roots.values()) == 1
flag = min(next(v for v in roots.values() if v))
assert flag*flag % p == 6
print(flag)
```

## 정답
`8`
