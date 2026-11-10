---
{"title":"Great Snakes","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Introduction","Cryptography"],"summary":"파이썬 스크립트를 실행해 플래그를 얻는 문제. 안에서 쓰인 XOR 복호화를 정리했다.","section":["CryptoHack","Introduction"]}
---

## 개념

CryptoHack은 대부분 파이썬으로 문제를 푼다. 이 문제의 스크립트는 정수 배열의 각 원소를 `0x32`와 XOR해서 문자로 바꾼다.

XOR은 같은 값을 두 번 적용하면 원래대로 돌아온다.

$$
(m \oplus k) \oplus k = m
$$

그래서 같은 키로 한 번 더 XOR하는 게 곧 복호화다.

## 문제

`great_snakes.py`를 실행하면 플래그가 출력된다.

## 풀이

스크립트의 `ords` 배열을 가져와 각 값에 `0x32`를 XOR하고 `chr`로 바꾸면 플래그가 나온다. 직접 실행하는 것과 결과가 같다.

## 풀이 코드
```python
import requests, re
url = "https://cryptohack.org/static/challenges/great_snakes_35381fca29d68d8f3f25c9fa0a9026fb.py"
source = requests.get(url).text
ords = [int(x) for x in re.search(r"ords = \[([^]]+)\]", source).group(1).split(',')]
print(''.join(chr(x ^ 0x32) for x in ords))
```

## 플래그
```text
crypto{z3n_0f_pyth0n}
```
