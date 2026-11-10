---
{"title":"Bytes and Big Integers","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"RSA 같은 암호는 메시지를 큰 정수로 다룬다. 바이트열을 big-endian 정수로 바꾸는 방법을 익힌다.","section":["CryptoHack","General"]}
---

## 개념

RSA 같은 공개키 암호는 수학 연산을 하기 때문에 메시지를 **하나의 큰 정수**로 바꿔서 다룬다. 바이트열을 16진수로 이어 붙인 다음 그 전체를 하나의 수로 읽는 방식이다.

$$
\texttt{"HELLO"} \rightarrow \texttt{0x48454c4c4f} = 310400273487
$$

이처럼 앞 바이트가 큰 자리에 오는 방식을 **big-endian**이라 한다.

- PyCryptodome: `bytes_to_long()`, `long_to_bytes()`
- 파이썬 기본: `int.from_bytes(b, 'big')`, `n.to_bytes(len, 'big')`

## 문제

정수 `11515195063862318899931685488813747395775516287289682636499965282714637259206269` 하나가 주어진다.

## 풀이

필요한 바이트 수는 $\lceil \text{bit\_length}/8 \rceil$이다. 이만큼 big-endian 바이트로 변환하면 ASCII 플래그가 나온다.

## 풀이 코드
```python
n = 11515195063862318899931685488813747395775516287289682636499965282714637259206269
print(n.to_bytes((n.bit_length()+7)//8, 'big').decode())
```

## 플래그
```text
crypto{3nc0d1n6_4ll_7h3_w4y_d0wn}
```
