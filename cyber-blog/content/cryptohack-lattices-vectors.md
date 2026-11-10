---
{"title":"Vectors","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"벡터의 선형 결합을 먼저 계산하고 마지막에 내적을 취한다. 2v-w=(3,12,6)이므로 3(2v-w)=(9,36,18)이고 2u=(14,14,4)이다. 내적은 126+504+72=702다.","section":["CryptoHack","Lattices"]}
---

분야: Lattices / lattices  
문제: https://cryptohack.org/challenges/post-quantum/#vectors  
검증: 2026-11-10, 로컬 실행 및 CryptoHack 계정 정답 처리 확인

## 풀이 방법

벡터의 선형 결합을 먼저 계산하고 마지막에 내적을 취한다. $2v-w=(3,12,6)$이므로 $3(2v-w)=(9,36,18)$이고 $2u=(14,14,4)$이다. 내적은 $126+504+72=702$다.

## 최종 풀이 코드

아래 코드를 Python 3에서 실행한다. `sympy`를 가져오는 문제는 `pip install sympy`가 필요하다.

```python
v = (2, 6, 3)
w = (1, 0, 0)
u = (7, 7, 2)
a = [3 * (2 * x - y) for x, y in zip(v, w)]
b = [2 * x for x in u]
print(sum(x * y for x, y in zip(a, b)))
```

## 검증 방법

코드의 표준 출력이 아래 정답과 같은지 확인한다. 같은 값을 CryptoHack 문제의 제출 폼에 넣었을 때 계정에 **solved** 표시가 나타나는 것도 확인했다.

## 최종 정답

```text
702
```
