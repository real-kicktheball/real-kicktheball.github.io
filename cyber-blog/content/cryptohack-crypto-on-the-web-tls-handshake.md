---
{"title":"TLS Handshake","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"같은 캡처의 ServerHello 핸드셰이크 메시지(type 2)에서 32바이트 Random 필드를 추출한다. 패킷 12에 해당한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

같은 캡처의 `ServerHello` 핸드셰이크 메시지(type 2)에서 32바이트 `Random` 필드를 추출한다. 패킷 12에 해당한다.

## 최종 풀이 코드

```bash
curl -fsSL 'https://cryptohack.org/static/challenges/cryptohack_6b3a90f7c585d399088758fda92fb9f6.org.pcapng' -o /tmp/cryptohack-tls1.pcapng
tshark -r /tmp/cryptohack-tls1.pcapng -Y 'tls.handshake.type == 2' -T fields -e tls.handshake.random 2>/dev/null
```

## 최종 답

`67c6bf8ffda56fcb359fba7f0149f85422223cf021ab1a0af701de5dd2091498`
