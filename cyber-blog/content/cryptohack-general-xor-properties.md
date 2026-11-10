---
{"title":"XOR Properties","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"최종 식에서 KEY2가 중간 두 식에 두 번 등장해 상쇄된다. 따라서 FLAG = (FLAG^K1^K3^K2) ^ K1 ^ (K2^K3)이다.","section":["CryptoHack","General"]}
---

## 풀이 원리

최종 식에서 KEY2가 중간 두 식에 두 번 등장해 상쇄된다. 따라서 `FLAG = (FLAG^K1^K3^K2) ^ K1 ^ (K2^K3)`이다.

## 최종 풀이 코드

```python
from itertools import starmap
k1=bytes.fromhex('a6c8b6733c9b22de7bc0253266a3867df55acde8635e19c73313')
k2k3=bytes.fromhex('c1545756687e7573db23aa1c3452a098b71a7fbf0fddddde5fc1')
masked=bytes.fromhex('04ee9855208a2cd59091d04767ae47963170d1660df7f56f5faf')
print(bytes(a^b^c for a,b,c in zip(masked,k1,k2k3)).decode())
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{x0r_i5_ass0c1at1v3}
```
