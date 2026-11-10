---
{"title":"Montgomery Curves","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"곡선의 2-꼬임점을 원점으로 옮겨 Montgomery 형태로 만든다. SageMath의 montgomery_model()은 이 좌표변환과 계수 정규화를 수행하며, 출력 곡선의 a_2가 요구된 A다.","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

곡선의 2-꼬임점을 원점으로 옮겨 Montgomery 형태로 만든다. SageMath의 `montgomery_model()`은 이 좌표변환과 계수 정규화를 수행하며, 출력 곡선의 $a_2$가 요구된 $A$다.

## 최종 풀이 코드

```python
from sage.all import GF, EllipticCurve
F=GF(1912812599)
E=EllipticCurve(F,[312589632,654443578])
M=E.montgomery_model()
print(int(M.a2()))
```

## 최종 정답

```text
723347356
```
