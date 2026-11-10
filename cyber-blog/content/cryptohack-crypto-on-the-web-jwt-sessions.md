---
{"title":"JWT Sessions","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"JWT는 통상 HTTP Authorization 헤더의 Bearer 토큰으로 서버에 보낸다. 이 문제는 헤더 이름을 요구한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

JWT는 통상 HTTP `Authorization` 헤더의 Bearer 토큰으로 서버에 보낸다. 이 문제는 헤더 이름을 요구한다.

## 최종 풀이 코드

Python 3에서 실행한다. 필요한 외부 패키지는 `ecc4`에만 `pycryptodome`이다.

```python
print('Authorization')
```

## 검증 방법

코드를 실행해 아래 결과와 일치하는지 확인한다. 이어서 위 원문 링크에서 같은 값을 제출하면 정답 처리된다. 코드 안의 `assert`는 문제에서 제공한 테스트 벡터나 수학적 조건을 확인한다.

```text
Authorization
```

## 최종 플래그

`Authorization`
