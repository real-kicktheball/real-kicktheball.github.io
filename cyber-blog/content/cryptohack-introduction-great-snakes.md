---
{"title":"Great Snakes","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Introduction","Cryptography"],"summary":"파이썬 스크립트를 실행해 플래그를 얻는 문제. 안에서 쓰인 XOR 복호화를 정리했다.","section":["CryptoHack","Introduction"]}
---

## 개념

**파이썬(Python)**은 컴퓨터에게 일을 시키는 언어다. 이름이 뱀(python)이라서 문제 이름이 "Great Snakes(대단한 뱀들)"이다.

이 문제는 파이썬 프로그램을 **실행만 하면** 정답이 나온다. 프로그램 안에서는 **XOR**이라는 계산을 해서 숨겨진 글자를 꺼낸다.

XOR은 "스위치 뒤집기"와 비슷하다.

- 불이 꺼진 방(0)에서 스위치를 누르면(1) → 불이 켜진다(1)
- 불이 켜진 방(1)에서 스위치를 누르면(1) → 불이 꺼진다(0)
- 스위치를 안 누르면(0) → 그대로다

그래서 **같은 스위치를 두 번 누르면 원래대로** 돌아온다. 암호를 걸 때 한 번 누르고, 풀 때 한 번 더 누르면 된다.

| 용어 | 뜻 |
|---|---|
| 파이썬 | 쉽게 배울 수 있는 프로그래밍 언어 |
| 실행 | 프로그램이 적힌 대로 일을 하게 시키는 것 |
| XOR | 같은 걸 두 번 하면 원래대로 돌아오는 "뒤집기" 계산 |

### 정리

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
