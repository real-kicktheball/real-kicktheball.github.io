---
{"title":"Hex","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"16진수 문자열을 바이트로 해석하고 UTF-8로 디코딩한다.","section":["CryptoHack","General"]}
---

## 풀이 원리

16진수 문자열을 바이트로 해석하고 UTF-8로 디코딩한다.

## 최종 풀이 코드

```python
data = "63727970746f7b596f755f77696c6c5f62655f776f726b696e675f776974685f6865785f737472696e67735f615f6c6f747d"
print(bytes.fromhex(data).decode())
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{You_will_be_working_with_hex_strings_a_lot}
```
