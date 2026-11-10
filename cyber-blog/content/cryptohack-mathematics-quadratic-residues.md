---
{"title":"Quadratic Residues","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"29를 법으로 하여 세 후보의 제곱근을 전수 조사한다. 가능한 후보 6의 두 근 중 작은 값을 고른다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

29를 법으로 하여 세 후보의 제곱근을 전수 조사한다. 가능한 후보 6의 두 근 중 작은 값을 고른다.

## 최종 풀이 코드

필요 패키지: `python3`, `pycryptodome`, `sympy`(코드에서 사용하는 경우).

```python
p = 29
candidates = [14, 6, 11]
roots = {n: [x for x in range(p) if x*x % p == n] for n in candidates}
assert sum(bool(v) for v in roots.values()) == 1
flag = min(next(v for v in roots.values() if v))
assert flag*flag % p == 6
print(flag)
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

코드를 실행하여 아래 결과를 얻었다. 코드 안의 `assert`로 핵심 관계를 확인했다. 출력값을 문제의 조건에 다시 대입해 확인한다.

```text
8
```

## 최종 답

`8`
