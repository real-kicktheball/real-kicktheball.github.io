---
{"title":"Resisting Bruteforce","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AES-128 전체 라운드에 대한 가장 잘 알려진 단일 키 공격 이름은 biclique attack이다. 정답은 공격명이다.","section":["CryptoHack","Symmetric Ciphers"]}
---

- 문제: [Resisting Bruteforce](https://cryptohack.org/challenges/aes/#aes1)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)


## 풀이 원리

AES-128 전체 라운드에 대한 가장 잘 알려진 단일 키 공격 이름은 **biclique attack**이다. 정답은 공격명이다.

## 검증 방법

정의와 공격 명칭을 문제 본문 및 공식 자료와 대조하고 정답을 제출한다.

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

- 공격명 표기 참고: [CryptoHack Symmetric write-up](https://hackmd.io/@phgvee/ryzEiFuIj)

## 최종 플래그

```text
crypto{biclique}
```
