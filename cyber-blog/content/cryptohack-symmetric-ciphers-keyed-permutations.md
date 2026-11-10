---
{"title":"Keyed Permutations","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"블록 암호는 키마다 하나의 순열(전단사 함수)이다. 그래야 복호화가 가능하다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**블록 암호**는 고정 길이 블록(AES는 128비트)을 같은 길이 블록으로 바꾼다. 키 $K$를 하나 정하면 암호화 $E_K$는 $2^{128}$개 입력을 $2^{128}$개 출력에 대응시키는 함수다.

복호화가 가능하려면 서로 다른 평문이 같은 암호문으로 가면 안 된다. 그래서 $E_K$는 다음 두 조건을 모두 만족해야 한다.

- **단사**: 서로 다른 입력은 서로 다른 출력으로 간다.
- **전사**: 모든 출력이 어떤 입력에서 나온다.

둘 다 만족하는 함수를 **전단사(bijection)**라 한다. 결국 블록 암호는 "키에 따라 바뀌는 순열(keyed permutation)"이다.

## 문제

입력과 출력이 일대일로 대응하는 함수를 수학적으로 무엇이라 부르는지 묻는다.

## 풀이

답은 `crypto{bijection}`이다.

## 플래그
```text
crypto{bijection}
```
