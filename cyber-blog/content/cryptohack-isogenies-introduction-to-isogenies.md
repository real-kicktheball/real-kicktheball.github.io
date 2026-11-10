---
{"title":"Introduction to Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"분리 가능 isogeny에서는 차수(degree)가 커널의 원소 수와 같다. 차수가 65537이므로 크기도 65537이다.","section":["CryptoHack","Isogenies"]}
---

분야: Isogenies / iso_introduction  
문제: https://cryptohack.org/challenges/isogenies/#iso_introduction_chall  
검증: 2026-11-10, 로컬 실행 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

분리 가능 isogeny에서는 차수(degree)가 커널의 원소 수와 같다. 차수가 65537이므로 크기도 65537이다.

## 최종 풀이 코드

다음 코드를 `python`으로 실행한다. 첨부 파일을 사용하는 코드는 공식 URL에서 내려받는다.

```python
degree = 65537
kernel_size = degree  # separable isogeny
print(kernel_size)
```

## 검증 방법

표준 출력이 아래 정답과 같은지 확인한다. 플랫폼 제출 상태는 별도로 기록한다.

## 최종 정답

```text
65537
```
