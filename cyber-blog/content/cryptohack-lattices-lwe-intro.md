---
{"title":"LWE Intro","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"오차 없는 선형 방정식은 가우스 소거로 바로 풀린다. LWE는 여기에 작은 오차를 더해 어렵게 만든다.","section":["CryptoHack","Lattices"]}
---

## 개념

$A \cdot S = b \pmod q$ 같은 선형 방정식은 **가우스 소거법**으로 쉽게 풀린다.

**LWE(Learning With Errors)**는 여기에 작은 오차 $e$를 더한다.

$$
b = A \cdot S + e \pmod q
$$

오차가 조금만 있어도 가우스 소거를 하면서 오차가 커지고 섞여서 $S$를 구할 수 없다. 격자 관점에서 보면 $b$에 가장 가까운 격자점을 찾는 문제(CVP)가 된다. 양자 컴퓨터로도 어렵다고 알려져 있어서 양자내성암호(Kyber 등)의 기반이 된다.

## 문제

오차가 없을 때 $S$를 구하는 알고리즘의 이름을 묻는다.

## 풀이

답은 `Gaussian elimination`이다.

## 풀이 코드
```python
print("Gaussian elimination")
```

## 정답
```text
Gaussian elimination
```
