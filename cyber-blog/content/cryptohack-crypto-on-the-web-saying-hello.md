---
{"title":"Saying Hello","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 1.2로 버전을 제한해 서버와 핸드셰이크한다. 서버가 선택한 단일 cipher suite를 OpenSSL 표기법으로 읽는다.","section":["CryptoHack","Crypto on the Web"]}
---

- 원문: https://cryptohack.org/challenges/web/#saying-hello
- 검증: 실제 TLS 1.2 핸드셰이크에서 아래 값 확인

## 풀이 원리

TLS 1.2로 버전을 제한해 서버와 핸드셰이크한다. 서버가 선택한 단일 cipher suite를 OpenSSL 표기법으로 읽는다.

## 최종 풀이 코드

curl, openssl 또는 tshark가 필요하다.

```bash
openssl s_client -connect tls1.cryptohack.org:443 -servername tls1.cryptohack.org -tls1_2 </dev/null 2>/dev/null | grep 'Cipher is' 
```

## 검증 방법

코드를 실행해 아래 출력의 핵심 값과 비교한다. 문제 페이지에 동일한 값을 제출하면 채점 결과를 확인할 수 있다.

```text
ECDHE-RSA-AES256-GCM-SHA384
```

## 최종 답

`ECDHE-RSA-AES256-GCM-SHA384`
