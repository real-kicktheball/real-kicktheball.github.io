---
{"title":"Keyed Permutations","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AES 블록 암호는 고정 키에 대해 입력 블록과 출력 블록을 일대일로 대응시켜야 복호화가 가능하다. 이러한 일대일 대응이면서 전사인 함수를 bijection(전단사)이라 한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

AES 블록 암호는 고정 키에 대해 입력 블록과 출력 블록을 일대일로 대응시켜야 복호화가 가능하다. 이러한 일대일 대응이면서 전사인 함수를 **bijection(전단사)**이라 한다.

## 검증 방법

정의와 공격 명칭을 문제 본문 및 공식 자료와 대조하고 정답을 제출한다.

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

- 공격명 표기 참고: [CryptoHack Symmetric write-up](https://hackmd.io/@phgvee/ryzEiFuIj)

## 최종 플래그

```text
crypto{bijection}
```
