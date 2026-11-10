---
{"title":"Chinese Remainder Theorem","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"서로소인 법의 곱 935에서 표준 중국인의 나머지 정리 합을 구성한다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

서로소인 법의 곱 935에서 표준 중국인의 나머지 정리 합을 구성한다.

## 최종 풀이 코드

필요 패키지: `python3`, `pycryptodome`, `sympy`(코드에서 사용하는 경우).

```python
mods = [5, 11, 17]
rems = [2, 3, 5]
N = 1
for n in mods: N *= n
x = sum(a * (N//n) * pow(N//n, -1, n) for a,n in zip(rems,mods)) % N
assert [x%n for n in mods] == rems
print(x)
```

## 검증

CryptoHack 계정에 정답을 제출해 성공을 확인했다. 코드를 실행하여 아래 결과를 얻었다. 코드 안의 `assert`로 핵심 관계를 확인했다. 출력값을 문제의 조건에 다시 대입해 확인한다.

```text
872
```

## 최종 답

`872`
