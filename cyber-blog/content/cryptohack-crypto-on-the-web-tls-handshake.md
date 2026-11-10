---
{"title":"TLS Handshake","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 핸드셰이크에서 ClientHello와 ServerHello는 각각 32바이트 랜덤값을 보낸다. 키 유도와 재전송 방지에 쓰인다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

TLS 1.2 핸드셰이크는 대략 이런 순서다.

```
Client                              Server
ClientHello (client_random)  →
                             ←  ServerHello (server_random)
                             ←  Certificate, ServerKeyExchange, ServerHelloDone
ClientKeyExchange            →
ChangeCipherSpec, Finished   →
                             ←  ChangeCipherSpec, Finished
```

양쪽이 보내는 **32바이트 random**은 세션 키 유도에 들어간다. 같은 premaster secret이어도 세션마다 키가 달라지고, 예전 세션을 재전송하는 공격도 막는다.

## 문제

앞 문제와 같은 캡처에서 ServerHello의 random 값을 묻는다.

## 풀이

`tls.handshake.type == 2` 필터로 ServerHello(12번 패킷)를 찾는다. `tls.handshake.random` 필드를 hex로 뽑으면 답이다.

## 풀이 코드
```bash
curl -fsSL 'https://cryptohack.org/static/challenges/cryptohack_6b3a90f7c585d399088758fda92fb9f6.org.pcapng' -o /tmp/cryptohack-tls1.pcapng
tshark -r /tmp/cryptohack-tls1.pcapng -Y 'tls.handshake.type == 2' -T fields -e tls.handshake.random 2>/dev/null
```

## 정답
`67c6bf8ffda56fcb359fba7f0149f85422223cf021ab1a0af701de5dd2091498`
