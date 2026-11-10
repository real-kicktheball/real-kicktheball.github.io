---
{"title":"Saying Hello","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS는 ClientHello에서 지원 목록을 보내고 서버가 cipher suite 하나를 고른다. 협상 결과를 직접 확인한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

**cipher suite**는 TLS 연결에서 쓸 알고리즘 조합이다. OpenSSL 표기로 `ECDHE-RSA-AES256-GCM-SHA384`를 나눠 보면 다음과 같다.

| 부분 | 역할 |
|---|---|
| ECDHE | 키 교환(타원곡선 임시 DH, 전방 보안) |
| RSA | 서버 인증(인증서 서명) |
| AES256-GCM | 데이터 암호화(AEAD) |
| SHA384 | PRF·핸드셰이크 해시 |

클라이언트가 ClientHello에 지원 목록을 보내면 서버가 그중 하나를 고른다.

## 문제

`tls1.cryptohack.org`에 TLS 1.2로 접속했을 때 서버가 고르는 cipher suite를 OpenSSL 표기로 묻는다.

## 풀이

`openssl s_client -tls1_2`로 접속하면 출력에 `Cipher is ECDHE-RSA-AES256-GCM-SHA384`가 나온다.

## 풀이 코드
```bash
openssl s_client -connect tls1.cryptohack.org:443 -servername tls1.cryptohack.org -tls1_2 </dev/null 2>/dev/null | grep 'Cipher is' 
```

## 정답
`ECDHE-RSA-AES256-GCM-SHA384`
