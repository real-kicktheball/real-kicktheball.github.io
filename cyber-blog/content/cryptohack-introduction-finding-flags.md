---
{"title":"Finding Flags","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Introduction","Cryptography"],"summary":"문제 본문이 플래그 형식을 예시로 제시하면서 해당 문자열을 그대로 제출하라고 한다. 따라서 예시에 나온 crypto{...}를 추출한다.","section":["CryptoHack","Introduction"]}
---

- 문제: [Finding Flags](https://cryptohack.org/challenges/introduction/#fflags)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)


## 풀이 원리

문제 본문이 플래그 형식을 예시로 제시하면서 해당 문자열을 그대로 제출하라고 한다. 따라서 예시에 나온 `crypto{...}`를 추출한다.

## 최종 풀이 코드

```python
import re
text = "These flags will usually be in the format crypto{y0ur_f1rst_fl4g}."
print(re.search(r"crypto\{[^}]+\}", text).group())
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{y0ur_f1rst_fl4g}
```
