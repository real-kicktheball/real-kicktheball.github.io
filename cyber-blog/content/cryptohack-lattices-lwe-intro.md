---
{"title":"LWE Intro","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"오차 없는 선형 방정식은 가우스 소거로 바로 풀린다. LWE는 여기에 작은 오차를 더해 어렵게 만든다.","section":["CryptoHack","Lattices"]}
---

## 개념

### 연립방정식은 쉽다

$$
\begin{aligned}
2x + 3y &= 13 \\
x + y &= 5
\end{aligned}
$$

두 번째 식에 2를 곱해서 빼면 $y = 3$이고, $x = 2$다. 이렇게 식끼리 빼서 미지수를 하나씩 없애는 방법을 **가우스 소거법**이라 한다.

### 작은 오차를 섞으면?

$$
\begin{aligned}
2x + 3y &= 14 \quad (\text{원래 13인데 } +1) \\
x + y &= 4 \quad (\text{원래 5인데 } -1)
\end{aligned}
$$

이걸 그대로 풀면 $y = 6$, $x = -2$가 나온다. 원래 답(2, 3)과 전혀 다르다. 작은 오차가 계산하면서 **커지고 섞여서** 답을 완전히 망가뜨린다.

### LWE (Learning With Errors)

"방정식에 **작은 오차**를 일부러 섞어서 답을 찾기 어렵게 만드는" 문제를 LWE라 한다. 미지수와 방정식이 수백 개면 양자 컴퓨터로도 풀기 어렵다고 알려져 있다. 그래서 차세대 암호(Kyber)의 기초가 된다.

이 문제는 오차가 없을 때 쓰는 방법, 즉 **Gaussian elimination(가우스 소거법)**을 묻는다.

### 정리

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
