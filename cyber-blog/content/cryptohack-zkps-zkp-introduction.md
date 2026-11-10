---
{"title":"ZKP Introduction","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"영지식 증명은 비밀을 드러내지 않고 \"안다\"는 사실만 증명하는 방법이다. 1985년 Goldwasser, Micali, Rackoff가 제안했다.","section":["CryptoHack","ZKPs"]}
---

## 개념

**영지식 증명(ZKP)**은 증명자(Prover)가 검증자(Verifier)에게 어떤 사실이 참이라는 것만 납득시키는 방법이다. 그 외의 정보는 전혀 주지 않는다. 다음 세 성질을 만족해야 한다.

| 성질 | 의미 |
|---|---|
| 완전성(completeness) | 참이면 정직한 증명자는 항상 통과한다. |
| 건전성(soundness) | 거짓이면 속이는 증명자는 거의 통과하지 못한다. |
| 영지식성(zero-knowledge) | 검증자는 "참이다" 외에 아무것도 배우지 못한다. |

비밀번호를 보내지 않고 로그인하거나, 블록체인에서 거래 내용을 숨기면서 유효성만 증명하는 데 쓴다(zk-SNARK 등).

## 문제

ZKP 개념을 처음 제시한 Goldwasser, Micali, Rackoff 논문(*The Knowledge Complexity of Interactive Proof Systems*)의 발표 연도를 묻는다.

## 풀이

논문은 1985년 STOC에서 처음 발표됐다. 1989년 SIAM Journal 판본도 있지만 문제는 최초 발표 연도를 묻는다. 답은 `crypto{1985}`이다. ([ACM 원문](https://doi.org/10.1145/22145.22178))

## 풀이 코드
```python
year = 1985
print(f"crypto{{{year}}}")
```

## 정답
```text
crypto{1985}
```
