---
{"title":"Public Keys","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"N=pq를 만들고 m^e mod N을 계산한다.","section":["CryptoHack","RSA"]}
---

## 풀이 원리

N=pq를 만들고 m^e mod N을 계산한다.

## 최종 풀이 코드

필요 패키지: `python3`, `pycryptodome`, `sympy`(코드에서 사용하는 경우).

```python
p,q,e,m = 17,23,65537,12
N=p*q
c=pow(m,e,N)
assert 0 <= c < N
print(c)
```

## 검증

CryptoHack 계정에 정답을 제출해 성공을 확인했다. 코드를 실행하여 아래 결과를 얻었다. 코드 안의 `assert`로 핵심 관계를 확인했다. 출력값을 문제의 조건에 다시 대입해 확인한다.

```text
301
```

## 최종 답

`301`
