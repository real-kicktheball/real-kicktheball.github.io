---
{"title":"Network Attacks","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Introduction","Cryptography"],"summary":"JSON 프로토콜로 연결해 {\"buy\":\"flag\"}를 전송하면 서버가 플래그를 반환한다.","section":["CryptoHack","Introduction"]}
---

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

## 최종 플래그

```text
crypto{sh0pp1ng_f0r_fl4g5}
```
