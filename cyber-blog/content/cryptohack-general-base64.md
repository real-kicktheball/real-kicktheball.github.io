---
{"title":"Base64","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"16진수 원본을 먼저 바이트로 변환한 다음 Base64로 인코딩한다. 이 문제의 정답은 crypto{} 형식이 아니라 Base64 문자열이다.","section":["CryptoHack","General"]}
---

## 풀이 원리

16진수 원본을 먼저 바이트로 변환한 다음 Base64로 인코딩한다. 이 문제의 정답은 `crypto{}` 형식이 아니라 Base64 문자열이다.

## 최종 풀이 코드

```python
import base64
h = "72bca9b68fc16ac7beeb8f849dca1d8a783e8acf9679bf9269f7bf"
print(base64.b64encode(bytes.fromhex(h)).decode())
```

## 최종 플래그

```text
crypto/Base+64+Encoding+is+Web+Safe/
```
