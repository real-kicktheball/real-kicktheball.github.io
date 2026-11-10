---
{"title":"XOR Starter","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"문자열 label의 각 문자를 13과 XOR하고 crypto{}로 감싼다.","section":["CryptoHack","General"]}
---

## 풀이 원리

문자열 `label`의 각 문자를 13과 XOR하고 `crypto{}`로 감싼다.

## 최종 풀이 코드

```python
text = 'label'
print('crypto{' + ''.join(chr(ord(c)^13) for c in text) + '}')
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{aloha}
```
