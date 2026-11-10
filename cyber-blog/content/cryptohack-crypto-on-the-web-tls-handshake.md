---
{"title":"TLS Handshake","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 핸드셰이크에서 ClientHello와 ServerHello는 각각 32바이트 랜덤값을 보낸다. 키 유도와 재전송 방지에 쓰인다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

TLS 연결은 처음에 **인사(핸드셰이크)**부터 한다. 서로 어떤 암호를 쓸지 정하고 열쇠를 만드는 과정이다.

### 인사 순서 (간단 버전)

| 순서 | 누가 | 말 |
|---|---|---|
| 1 | 브라우저 | "안녕(ClientHello)! 난 이런 암호들을 쓸 수 있어. 내 랜덤값은 이거야" |
| 2 | 서버 | "안녕(ServerHello)! 이 암호로 하자. 내 랜덤값은 이거야" |
| 3 | 서버 | "내 인증서야" |
| 4 | 둘 다 | 열쇠를 만드는 정보를 교환한다 |
| 5 | 둘 다 | "준비 끝(Finished)" |

### 랜덤값은 왜 보낼까?

양쪽이 보낸 **32바이트 랜덤값**은 열쇠를 만들 때 섞인다. 그래서 매번 연결할 때마다 열쇠가 달라진다. 누가 예전 대화를 녹음해서 다시 틀어도(재전송 공격) 통하지 않는다.

### 이 문제에서

Wireshark로 ServerHello 패킷(`tls.handshake.type == 2`)을 찾아서 서버가 보낸 랜덤값을 읽으면 답이다.

### 정리

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
