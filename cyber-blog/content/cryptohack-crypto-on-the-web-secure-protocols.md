---
{"title":"Secure Protocols","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 인증서는 CA가 서명해서 도메인 소유를 증명한다. 인증서의 발급자(issuer)를 확인해본다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

인터넷 주소 앞의 **https**에서 **s**는 "secure(안전한)"다. 이 안전한 연결을 만드는 약속을 **TLS**라 한다.

TLS는 두 가지를 해준다.

1. **암호화**: 주고받는 내용을 다른 사람이 못 보게 한다.
2. **인증**: 내가 접속한 곳이 진짜 그 사이트인지 확인한다.

### 인증서와 인증기관

사이트는 접속할 때 **인증서**를 보여준다. 인증서에는 "이 공개키는 cryptohack.org의 것"이라는 내용과 **인증기관(CA)의 도장**이 있다. 브라우저는 믿을 만한 기관 목록을 가지고 있어서, 그 기관의 도장이 맞는지 확인한다.

### 비유

주민등록증에 정부 도장이 있어서 믿을 수 있는 것과 같다. 아무나 만든 신분증은 도장이 없어서 믿을 수 없다.

### 이 문제에서

사이트 인증서의 **발급자(Issuer)** 항목을 보면 도장을 찍은 기관 이름이 나온다. 브라우저 주소창의 자물쇠를 누르면 볼 수 있다. 답은 무료로 인증서를 발급해주는 기관 **Let's Encrypt**다.

### 정리

**TLS**는 HTTPS의 기반 프로토콜이다. 접속할 때 서버는 **인증서**를 보낸다. 인증서에는 "이 공개키는 이 도메인의 것"이라는 내용이 있다. 브라우저가 신뢰하는 **CA(인증기관)**가 여기에 서명한다.

브라우저는 이 서명 사슬을 따라가서 루트 CA까지 확인한다. 그래서 중간자가 가짜 공개키를 끼워 넣는 것을 막을 수 있다. 무료 자동 발급 CA인 Let's Encrypt가 현재 가장 많은 인증서를 발급한다.

## 문제

`tls1.cryptohack.org`의 인증서를 발급한 조직(issuer의 O 필드)을 묻는다.

## 풀이

`openssl s_client`로 접속해서 받은 인증서를 `openssl x509 -noout -issuer`로 보면 발급 조직이 `Let's Encrypt`이다. 브라우저 자물쇠 아이콘의 인증서 정보에서도 확인할 수 있다.

## 풀이 코드
```bash
openssl s_client -connect tls1.cryptohack.org:443 -servername tls1.cryptohack.org -tls1_2 </dev/null 2>/dev/null | openssl x509 -noout -issuer
```

## 정답
`Let's Encrypt`
