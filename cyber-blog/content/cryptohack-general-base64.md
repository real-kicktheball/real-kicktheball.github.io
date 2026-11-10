---
{"title":"Base64","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"Base64는 3바이트를 4글자로 바꾸는 인코딩이다. hex를 먼저 바이트로 바꾼 뒤 Base64로 인코딩한다.","section":["CryptoHack","General"]}
---

## 개념

**Base64**는 바이너리 데이터를 출력 가능한 64개 문자(`A-Z a-z 0-9 + /`)로 표현하는 인코딩이다.

- 3바이트(24비트)를 6비트씩 4조각으로 나눈다.
- 각 6비트 값(0~63)을 문자 하나에 대응시킨다.
- 그래서 결과 길이는 원본의 약 4/3배가 된다.

이메일 첨부파일이나 PEM 키처럼 텍스트만 다룰 수 있는 곳에서 바이너리를 옮길 때 쓴다.

## 문제

hex 문자열 `72bca9b68fc16ac7...`을 **바이트로 디코딩한 뒤** Base64로 인코딩하라는 문제다.

## 풀이

hex 문자열 자체를 Base64로 인코딩하면 안 된다. `bytes.fromhex()`로 원래 바이트를 먼저 복원하고 `base64.b64encode()`를 적용해야 한다. 이 문제의 답은 `crypto{}`로 감싸지 않은 Base64 문자열이다.

## 풀이 코드
```python
import base64
h = "72bca9b68fc16ac7beeb8f849dca1d8a783e8acf9679bf9269f7bf"
print(base64.b64encode(bytes.fromhex(h)).decode())
```

## 플래그
```text
crypto/Base+64+Encoding+is+Web+Safe/
```
