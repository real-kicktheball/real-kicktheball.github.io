---
{"title":"Network Attacks","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Introduction","Cryptography"],"summary":"JSON 프로토콜로 연결해 {\"buy\":\"flag\"}를 전송하면 서버가 플래그를 반환한다.","section":["CryptoHack","Introduction"]}
---

- 문제: [Network Attacks](https://cryptohack.org/challenges/introduction/#nc-intro-2)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)
- [pwntools_example.py](https://cryptohack.org/static/challenges/pwntools_example_72a60ff13df200692898bb14a316ee0b.py)

## 풀이 원리

JSON 프로토콜로 연결해 `{"buy":"flag"}`를 전송하면 서버가 플래그를 반환한다.

## 최종 풀이 코드

```python
import socket, json
with socket.create_connection(("socket.cryptohack.org", 11112)) as s:
    s.recv(4096)
    s.sendall(b'{"buy":"flag"}\n')
    print(json.loads(s.recv(4096))["flag"])
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{sh0pp1ng_f0r_fl4g5}
```
