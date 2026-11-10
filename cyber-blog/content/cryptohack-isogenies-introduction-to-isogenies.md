---
{"title":"Introduction to Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"아이소제니는 타원곡선 사이의 준동형 사상이다. 분리 가능한 아이소제니의 차수는 커널의 크기와 같다.","section":["CryptoHack","Isogenies"]}
---

## 개념

**아이소제니(isogeny)** $\phi: E \to E'$는 두 타원곡선 사이의 사상이다. 무한원점을 무한원점으로 보내고, 점의 덧셈 구조를 보존한다.

$$
\phi(P + Q) = \phi(P) + \phi(Q)
$$

가장 중요한 성질은 다음과 같다.

- **커널** $\ker \phi$는 $O$로 가는 점들의 집합이고, $E$의 유한 부분군이다.
- **분리 가능한(separable)** 아이소제니에서는 차수와 커널 크기가 같다: $\deg \phi = |\ker \phi|$
- 반대로 유한 부분군 $G$가 주어지면 $\ker \phi = G$인 아이소제니가 (동형을 제외하고) 하나 정해진다. **Vélu 공식**으로 계산한다.

아이소제니 기반 암호(CSIDH, SQIsign 등)는 "두 곡선 사이의 아이소제니를 찾기 어렵다"는 문제에 기반한다. 양자내성암호 후보다.

## 문제

차수가 65537인 분리 가능한 아이소제니의 커널 크기를 묻는다.

## 풀이

분리 가능이면 차수 = 커널 크기이므로 **65537**이다.

## 풀이 코드
```python
degree = 65537
kernel_size = degree  # separable isogeny
print(kernel_size)
```

## 정답
```text
65537
```
