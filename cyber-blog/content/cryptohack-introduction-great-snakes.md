---
{"title":"Great Snakes","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Introduction","Cryptography"],"summary":"첨부 스크립트의 정수 배열에 0x32를 XOR한 값을 문자로 되돌린다. XOR은 자기 역연산이다.","section":["CryptoHack","Introduction"]}
---

## 풀이 원리

첨부 스크립트의 정수 배열에 `0x32`를 XOR한 값을 문자로 되돌린다. XOR은 자기 역연산이다.

## 최종 풀이 코드

```python
import requests, re
url = "https://cryptohack.org/static/challenges/great_snakes_35381fca29d68d8f3f25c9fa0a9026fb.py"
source = requests.get(url).text
ords = [int(x) for x in re.search(r"ords = \[([^]]+)\]", source).group(1).split(',')]
print(''.join(chr(x ^ 0x32) for x in ords))
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{z3n_0f_pyth0n}
```
