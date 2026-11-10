---
{"title":"Bytes and Big Integers","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"큰 정수를 big-endian 바이트열로 변환하면 ASCII 플래그가 나온다.","section":["CryptoHack","General"]}
---

## 풀이 원리

큰 정수를 big-endian 바이트열로 변환하면 ASCII 플래그가 나온다.

## 최종 풀이 코드

```python
n = 11515195063862318899931685488813747395775516287289682636499965282714637259206269
print(n.to_bytes((n.bit_length()+7)//8, 'big').decode())
```

## 최종 플래그

```text
crypto{3nc0d1n6_4ll_7h3_w4y_d0wn}
```
