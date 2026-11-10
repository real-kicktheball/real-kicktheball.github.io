---
{"title":"Secure Protocols","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"서버 인증서의 issuer에서 조직(O) 필드를 확인한다. 실습 도메인의 TLS 인증서 발급 조직은 Let's Encrypt다.","section":["CryptoHack","Crypto on the Web"]}
---

- 원문: https://cryptohack.org/challenges/web/#secure-protocols
- 검증: 실제 TLS 1.2 핸드셰이크에서 아래 값 확인

## 풀이 원리

서버 인증서의 `issuer`에서 조직(O) 필드를 확인한다. 실습 도메인의 TLS 인증서 발급 조직은 Let's Encrypt다.

## 최종 풀이 코드

curl, openssl 또는 tshark가 필요하다.

```bash
openssl s_client -connect tls1.cryptohack.org:443 -servername tls1.cryptohack.org -tls1_2 </dev/null 2>/dev/null | openssl x509 -noout -issuer
```

## 검증 방법

코드를 실행해 아래 출력의 핵심 값과 비교한다. 문제 페이지에 동일한 값을 제출하면 채점 결과를 확인할 수 있다.

```text
Let's Encrypt
```

## 최종 답

`Let's Encrypt`
