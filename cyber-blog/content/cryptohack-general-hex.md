---
{"title":"Hex","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"16진수는 1바이트를 두 글자로 표현한다. hex 문자열을 bytes.fromhex로 바이트로 바꾼다.","section":["CryptoHack","General"]}
---

## 개념

암호 연산의 결과는 출력할 수 없는 바이트가 많아서 보통 **16진수(hex)**로 표현한다. 1바이트(0~255)는 두 자리 16진수(00~ff)로 정확히 대응한다.

| 문자 | 10진수 | 16진수 |
|---|---:|---|
| c | 99 | 63 |
| r | 114 | 72 |
| { | 123 | 7b |

파이썬에서는 `bytes.fromhex()`로 hex → bytes, `.hex()`로 bytes → hex 변환을 한다.

## 문제

`63727970746f7b...` 형태의 hex 문자열이 주어진다.

## 풀이

`63 72 79 70 74 6f 7b`가 `crypto{`이다. `bytes.fromhex()`로 바이트열로 바꾼 뒤 디코딩하면 된다.

## 풀이 코드
```python
data = "63727970746f7b596f755f77696c6c5f62655f776f726b696e675f776974685f6865785f737472696e67735f615f6c6f747d"
print(bytes.fromhex(data).decode())
```

## 플래그
```text
crypto{You_will_be_working_with_hex_strings_a_lot}
```
