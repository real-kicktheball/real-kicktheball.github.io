---
{"title":"Sharks on the Wire","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"Wireshark/tshark 디스플레이 필터로 패킷 캡처를 분석하는 연습이다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

TLS를 공부하려면 실제 패킷을 봐야 한다. **Wireshark**(CLI는 `tshark`)는 pcap 파일을 프로토콜별로 해석해서 보여준다. 원하는 패킷만 보려면 **디스플레이 필터**를 쓴다.

| 필터 | 의미 |
|---|---|
| `ip.dst == 1.2.3.4` | 목적지 IP |
| `tcp.port == 443` | TCP 443 포트 |
| `tls.handshake.type == 1` | ClientHello |
| `tls.handshake.type == 2` | ServerHello |

## 문제

cryptohack.org 접속을 캡처한 pcapng 파일이 주어진다. CryptoHack 서버(`178.62.74.206`)로 가는 패킷이 몇 개인지 묻는다.

## 풀이

`ip.dst == 178.62.74.206` 필터를 걸고 프레임 수를 세면 **15**개다. TCP ACK 같은 패킷도 빼지 않고 전부 센다.

## 풀이 코드
```bash
curl -fsSL 'https://cryptohack.org/static/challenges/cryptohack_6b3a90f7c585d399088758fda92fb9f6.org.pcapng' -o /tmp/cryptohack-tls1.pcapng
tshark -r /tmp/cryptohack-tls1.pcapng -Y 'ip.dst == 178.62.74.206' -T fields -e frame.number 2>/dev/null | wc -l
```

## 정답
`15`
