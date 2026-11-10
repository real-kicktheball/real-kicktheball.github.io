---
{"title":"ZKP Introduction","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"Goldwasser, Micali, Rackoff의 논문은 1985년 STOC 학회에서 발표됐다. 1989년 SIAM Journal 판본도 있으나 이 문제는 최초 발표 연도를 요구한다. ACM 원문 기록의 출판 연도를 확인한다.","section":["CryptoHack","ZKPs"]}
---

분야: ZKPs / zkp-intro  
문제: https://cryptohack.org/challenges/zkp/#zkpintro  
검증: 2026-11-10, 로컬 실행 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

Goldwasser, Micali, Rackoff의 논문은 1985년 STOC 학회에서 발표됐다. 1989년 SIAM Journal 판본도 있으나 이 문제는 최초 발표 연도를 요구한다. [ACM 원문 기록](https://doi.org/10.1145/22145.22178)의 출판 연도를 확인한다.

## 최종 풀이 코드

다음 코드를 `python`으로 실행한다. 첨부 파일을 사용하는 코드는 공식 URL에서 내려받는다.

```python
year = 1985
print(f"crypto{{{year}}}")
```

## 검증 방법

표준 출력이 아래 정답과 같은지 확인한다. 플랫폼 제출 상태는 별도로 기록한다.

## 최종 정답

```text
crypto{1985}
```
