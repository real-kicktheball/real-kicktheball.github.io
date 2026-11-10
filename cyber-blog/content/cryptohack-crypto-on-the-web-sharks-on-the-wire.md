---
{"title":"Sharks on the Wire","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"패킷 캡처에서 CryptoHack 서버 IP 178.62.74.206을 목적지로 하는 패킷을 센다. TCP ACK와 DNS 등을 임의로 제외하지 않고 전체 프레임에 필터를 적용한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

패킷 캡처에서 CryptoHack 서버 IP `178.62.74.206`을 목적지로 하는 패킷을 센다. TCP ACK와 DNS 등을 임의로 제외하지 않고 전체 프레임에 필터를 적용한다.

## 최종 풀이 코드

curl, openssl 또는 tshark가 필요하다.

```bash
curl -fsSL 'https://cryptohack.org/static/challenges/cryptohack_6b3a90f7c585d399088758fda92fb9f6.org.pcapng' -o /tmp/cryptohack-tls1.pcapng
tshark -r /tmp/cryptohack-tls1.pcapng -Y 'ip.dst == 178.62.74.206' -T fields -e frame.number 2>/dev/null | wc -l
```

## 검증 방법

코드를 실행해 아래 출력의 핵심 값과 비교한다. 문제 페이지에 동일한 값을 제출하면 채점 결과를 확인할 수 있다.

```text
15
```

## 최종 답

`15`
