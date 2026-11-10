---
{"title":"Point Negation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"점의 역원은 x 좌표가 같고 y 좌표가 부호 반전된 점이다. 유한체에서는 -6936 mod 9739 = 2803이다.","section":["CryptoHack","Elliptic Curves"]}
---

- 원문: https://cryptohack.org/challenges/ecc/#ecc0
- 분야: Elliptic Curves / ecc-starter
- 검증: CryptoHack 공식 제출 API에서 `Success!` 응답 확인

## 풀이 원리

점의 역원은 x 좌표가 같고 y 좌표가 부호 반전된 점이다. 유한체에서는 `-6936 mod 9739 = 2803`이다.

## 최종 풀이 코드

Python 3에서 실행한다. 필요한 외부 패키지는 `ecc4`에만 `pycryptodome`이다.

```python
p = 9739
x, y = 8045, 6936
q = (x, -y % p)
assert (y+q[1]) % p == 0
print(f'crypto{{{q[0]},{q[1]}}}')
```

## 검증 방법

코드를 실행해 아래 결과와 일치하는지 확인한다. 이어서 위 원문 링크에서 같은 값을 제출하면 정답 처리된다. 코드 안의 `assert`는 문제에서 제공한 테스트 벡터나 수학적 조건을 확인한다.

```text
crypto{8045,2803}
```

## 최종 플래그

`crypto{8045,2803}`
