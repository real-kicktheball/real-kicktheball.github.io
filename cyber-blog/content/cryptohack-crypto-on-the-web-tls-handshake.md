---
{"title":"TLS Handshake","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"같은 캡처의 ServerHello 핸드셰이크 메시지(type 2)에서 32바이트 Random 필드를 추출한다. 패킷 12에 해당한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

같은 캡처의 `ServerHello` 핸드셰이크 메시지(type 2)에서 32바이트 `Random` 필드를 추출한다. 패킷 12에 해당한다.

## 최종 풀이 코드

curl, openssl 또는 tshark가 필요하다.

```bash
curl -fsSL 'https://cryptohack.org/static/challenges/cryptohack_6b3a90f7c585d399088758fda92fb9f6.org.pcapng' -o /tmp/cryptohack-tls1.pcapng
tshark -r /tmp/cryptohack-tls1.pcapng -Y 'tls.handshake.type == 2' -T fields -e tls.handshake.random 2>/dev/null
```

## 검증 방법

코드를 실행해 아래 출력의 핵심 값과 비교한다. 문제 페이지에 동일한 값을 제출하면 채점 결과를 확인할 수 있다.

```text
67c6bf8ffda56fcb359fba7f0149f85422223cf021ab1a0af701de5dd2091498
```

## 최종 답

`67c6bf8ffda56fcb359fba7f0149f85422223cf021ab1a0af701de5dd2091498`
