---
{"title":"Secure Protocols","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"서버 인증서의 issuer에서 조직(O) 필드를 확인한다. 실습 도메인의 TLS 인증서 발급 조직은 Let's Encrypt다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

서버 인증서의 `issuer`에서 조직(O) 필드를 확인한다. 실습 도메인의 TLS 인증서 발급 조직은 Let's Encrypt다.

## 최종 풀이 코드

```bash
openssl s_client -connect tls1.cryptohack.org:443 -servername tls1.cryptohack.org -tls1_2 </dev/null 2>/dev/null | openssl x509 -noout -issuer
```

## 최종 답

`Let's Encrypt`
