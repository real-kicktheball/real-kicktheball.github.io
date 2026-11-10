---
{"title":"Saying Hello","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 1.2로 버전을 제한해 서버와 핸드셰이크한다. 서버가 선택한 단일 cipher suite를 OpenSSL 표기법으로 읽는다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

TLS 1.2로 버전을 제한해 서버와 핸드셰이크한다. 서버가 선택한 단일 cipher suite를 OpenSSL 표기법으로 읽는다.

## 최종 풀이 코드

```bash
openssl s_client -connect tls1.cryptohack.org:443 -servername tls1.cryptohack.org -tls1_2 </dev/null 2>/dev/null | grep 'Cipher is' 
```

## 최종 답

`ECDHE-RSA-AES256-GCM-SHA384`
