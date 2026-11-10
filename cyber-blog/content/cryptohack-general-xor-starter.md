---
{"title":"XOR Starter","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"XOR은 비트가 다르면 1인 연산이다. 문자열 각 문자를 13과 XOR한다.","section":["CryptoHack","General"]}
---

## 개념

**XOR**($\oplus$)은 두 비트가 다르면 1, 같으면 0을 내는 연산이다.

| A | B | A ⊕ B |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

정수끼리 XOR하면 각 비트 자리마다 이 연산을 한다. 문자열은 `ord`로 정수로 바꾼 뒤 XOR하고 다시 `chr`로 돌린다.

## 문제

문자열 `label`의 각 문자를 정수 13과 XOR한 결과를 `crypto{...}`로 감싸라는 문제다.

## 풀이

`'l'`은 108 = `0b1101100`, 13 = `0b0001101`이다. XOR하면 `0b1100001` = 97 = `'a'`가 된다. 나머지 문자도 같은 방식으로 바꾸면 `aloha`가 나온다.

## 풀이 코드
```python
text = 'label'
print('crypto{' + ''.join(chr(ord(c)^13) for c in text) + '}')
```

## 플래그
```text
crypto{aloha}
```
