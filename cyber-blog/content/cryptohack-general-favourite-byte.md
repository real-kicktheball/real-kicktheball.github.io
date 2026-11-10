---
{"title":"Favourite byte","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"단일 바이트 키는 256개뿐이다. 각 후보로 복호화하고 플래그 접두사 crypto{가 나타나는지 확인한다.","section":["CryptoHack","General"]}
---

- 문제: [Favourite byte](https://cryptohack.org/challenges/general/#xorkey0)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)


## 풀이 원리

단일 바이트 키는 256개뿐이다. 각 후보로 복호화하고 플래그 접두사 `crypto{`가 나타나는지 확인한다.

## 최종 풀이 코드

```python
ct=bytes.fromhex('73626960647f6b206821204f21254f7d694f7624662065622127234f726927756d')
for key in range(256):
    pt=bytes(x^key for x in ct)
    if pt.startswith(b'crypto{'):
        print(pt.decode())
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{0x10_15_my_f4v0ur173_by7e}
```
