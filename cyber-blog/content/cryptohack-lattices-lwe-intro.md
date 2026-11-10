---
{"title":"LWE Intro","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"오차가 없으면 표본은 AS=b인 선형 방정식계다. 행 기본 연산으로 S를 구하는 Gaussian elimination(가우스 소거법)을 쓴다.","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

오차가 없으면 표본은 $AS=b$인 선형 방정식계다. 행 기본 연산으로 $S$를 구하는 Gaussian elimination(가우스 소거법)을 쓴다.

## 최종 풀이 코드

아래 코드를 Python 3에서 실행한다. `sympy`를 가져오는 문제는 `pip install sympy`가 필요하다.

```python
print("Gaussian elimination")
```

## 검증 방법

코드의 표준 출력이 아래 정답과 같은지 확인한다. 같은 값을 CryptoHack 문제의 제출 폼에 넣었을 때 계정에 **solved** 표시가 나타나는 것도 확인했다.

## 최종 정답

```text
Gaussian elimination
```
