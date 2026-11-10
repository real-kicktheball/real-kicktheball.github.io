---
{"title":"Resisting Bruteforce","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"AES-128에 대한 가장 좋은 단일 키 공격은 biclique 공격인데, 전수조사보다 고작 4배 빠를 뿐이다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

좋은 블록 암호는 키를 전부 시도하는 것(브루트포스)보다 나은 공격이 없어야 한다. AES-128의 키 공간은 $2^{128}$이라 현실적으로 다 시도할 수 없다.

지금까지 알려진 AES 전체 라운드에 대한 가장 좋은 공격은 **biclique 공격**(2011)이다. 그런데 복잡도가 $2^{126.1}$ 정도라 브루트포스보다 4배 정도 빠를 뿐이다. 실제 위협은 아니다. 그래서 AES는 아직 안전하다고 본다.

## 문제

AES에 대한 가장 잘 알려진 단일 키 공격의 이름을 묻는다.

## 풀이

답은 `crypto{biclique}`이다.

## 플래그
```text
crypto{biclique}
```
