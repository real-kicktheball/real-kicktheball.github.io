---
{"title":"ASCII","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"주어진 ASCII 정수 배열의 각 원소에 chr을 적용한다.","section":["CryptoHack","General"]}
---

## 풀이 원리

주어진 ASCII 정수 배열의 각 원소에 `chr`을 적용한다.

## 최종 풀이 코드

```python
values = [99,114,121,112,116,111,123,65,83,67,73,73,95,112,114,49,110,116,52,98,108,51,125]
print(''.join(map(chr, values)))
```

## 최종 플래그

```text
crypto{ASCII_pr1nt4bl3}
```
