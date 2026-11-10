---
{"title":"Background Reading","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"곡선 위 점의 덧셈은 교환법칙을 만족한다. 교환법칙을 갖는 군을 아벨 군(abelian group)이라고 한다.","section":["CryptoHack","Elliptic Curves"]}
---

## 풀이 원리

곡선 위 점의 덧셈은 교환법칙을 만족한다. 교환법칙을 갖는 군을 아벨 군(abelian group)이라고 한다.

## 최종 풀이 코드

Python 3에서 실행한다. 필요한 외부 패키지는 `ecc4`에만 `pycryptodome`이다.

```python
print('crypto{abelian}')
```

## 검증 방법

코드를 실행해 아래 결과와 일치하는지 확인한다. 이어서 위 원문 링크에서 같은 값을 제출하면 정답 처리된다. 코드 안의 `assert`는 문제에서 제공한 테스트 벡터나 수학적 조건을 확인한다.

```text
crypto{abelian}
```

## 최종 플래그

`crypto{abelian}`
