---
{"title":"Montgomery Curves","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"곡선의 2-꼬임점을 원점으로 옮겨 Montgomery 형태로 만든다. SageMath의 montgomery_model()은 이 좌표변환과 계수 정규화를 수행하며, 출력 곡선의 a_2가 요구된 A다.","section":["CryptoHack","Isogenies"]}
---

분야: Isogenies / iso_background  
문제: https://cryptohack.org/challenges/isogenies/#b_compute_montgomery  
검증: 2026-11-10, 로컬 실행 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

곡선의 2-꼬임점을 원점으로 옮겨 Montgomery 형태로 만든다. SageMath의 `montgomery_model()`은 이 좌표변환과 계수 정규화를 수행하며, 출력 곡선의 $a_2$가 요구된 $A$다.

## 최종 풀이 코드

다음 코드를 `sage -python`으로 실행한다. 첨부 파일을 사용하는 코드는 공식 URL에서 내려받는다.

```python
from sage.all import GF, EllipticCurve
F=GF(1912812599)
E=EllipticCurve(F,[312589632,654443578])
M=E.montgomery_model()
print(int(M.a2()))
```

## 검증 방법

표준 출력이 아래 정답과 같은지 확인한다. 플랫폼 제출 상태는 별도로 기록한다.

## 최종 정답

```text
723347356
```
