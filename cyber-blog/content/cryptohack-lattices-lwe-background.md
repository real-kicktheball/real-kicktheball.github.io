---
{"title":"LWE Background","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"LWE는 2005년 Oded Regev가 제안했고, 최악의 경우 격자 문제만큼 어렵다는 증명이 있다.","section":["CryptoHack","Lattices"]}
---

## 개념

LWE는 2005년 이스라엘 출신 컴퓨터 과학자 **오데드 레게브(Oded Regev)**가 처음 제안했다.

### 왜 대단할까?

보통 암호는 "**대부분의 경우** 풀기 어렵다"고 믿고 쓴다. 그런데 레게브는 이런 걸 증명했다.

> LWE를 **평균적으로** 풀 수 있다면, 가장 어려운 격자 문제도 **최악의 경우까지** 풀 수 있다.

즉 LWE는 "아주 어려운 문제만큼 어렵다"는 보증이 있다. 이 공로로 레게브는 2018년 괴델상(컴퓨터 과학의 큰 상)을 받았다.

### 지금 쓰이는 곳

2024년 미국 표준기술연구소(NIST)는 양자 컴퓨터 시대를 대비한 새 암호 표준을 발표했다. 그중 **ML-KEM(Kyber)**이 LWE를 바탕으로 만들어졌다. 크롬 브라우저 같은 곳에서 이미 쓰이고 있다.

### 정리

LWE는 2005년 **Oded Regev**가 논문 *On Lattices, Learning with Errors, Random Linear Codes, and Cryptography*에서 제안했다.

이 논문의 핵심은 평균적인 LWE를 푸는 것이 최악의 경우 격자 문제(GapSVP, SIVP)를 푸는 것만큼 어렵다는 증명이다. 대부분 암호는 "평균적으로 어렵다"는 가정에 기대는데, LWE는 더 강한 보장을 준다. Regev는 이 공로로 2018년 괴델상을 받았다.

## 문제

LWE를 처음 제안한 사람을 묻는다.

## 풀이

답은 `Oded Regev`이다.

## 풀이 코드
```python
print("Oded Regev")
```

## 정답
```text
Oded Regev
```
