---
{"title":"Network Attacks","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Introduction","Cryptography"],"summary":"pwntools/소켓으로 서버와 JSON을 주고받는 방법을 익히는 문제.","section":["CryptoHack","Introduction"]}
---

## 개념

이후 많은 문제가 원격 서버와 통신해야 풀린다. CryptoHack 서버는 대부분 **한 줄짜리 JSON**을 주고받는다. 요청을 JSON으로 보내고, 응답도 JSON으로 받아서 파싱하면 된다.

```
클라이언트 → {"buy": "flag"}
서버      → {"flag": "crypto{...}"}
```

## 문제

`socket.cryptohack.org:11112`에 접속하면 물건을 살 수 있는 상점 서버가 있다. 예제 스크립트는 `clothes`를 사는데, 이걸 `flag`로 바꿔야 한다.

## 풀이

연결 후 첫 안내 메시지를 받고 `{"buy":"flag"}`를 보낸다. 응답 JSON의 `flag` 값을 출력하면 된다.

## 풀이 코드
```python
import socket, json
with socket.create_connection(("socket.cryptohack.org", 11112)) as s:
    s.recv(4096)
    s.sendall(b'{"buy":"flag"}\n')
    print(json.loads(s.recv(4096))["flag"])
```

## 플래그
```text
crypto{sh0pp1ng_f0r_fl4g5}
```
