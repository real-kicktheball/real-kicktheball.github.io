---
{"title":"Merkle Trees","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"각 줄의 네 잎 해시 (a,b,c,d)에서 SHA256(SHA256(ab)SHA256(cd))가 제시된 루트와 같은지 검사한다. 같으면 1, 다르면 0으로 모아 바이트로 바꾼다. 생성기에서 거짓 증명은 b에 난수 8바이트를 덧붙여 만든다. …","section":["CryptoHack","Hash Functions"]}
---

- 원문: https://cryptohack.org/challenges/hashes/#merkletrees
- 첨부 파일: https://cryptohack.org/static/challenges/generate_15fce6199904ba00202bb32d01a11551.py
- 검증: 첨부 output.txt와 생성 코드의 Merkle 검증 방식으로 플래그 복원

## 풀이 원리

각 줄의 네 잎 해시 `(a,b,c,d)`에서 `SHA256(SHA256(a||b)||SHA256(c||d))`가 제시된 루트와 같은지 검사한다. 같으면 1, 다르면 0으로 모아 바이트로 바꾼다. 생성기에서 거짓 증명은 `b`에 난수 8바이트를 덧붙여 만든다. 플래그의 첫 비트가 0이라 출력 줄 수는 303개이며, 정수로 바꾼 뒤 최소 필요 길이인 38바이트로 복원한다.

## 최종 익스플로잇

Python 3에서 실행한다. `merkletrees`는 `requests`가 필요하다.

```python
import requests, ast, hashlib
url = 'https://cryptohack.org/static/challenges/output_1091e36a2522c149f174d6721df7ab02.txt'
lines = requests.get(url, timeout=20).text.splitlines()
bits = []
for line in lines:
    a, b, c, d, root = map(bytes.fromhex, ast.literal_eval(line))
    left = hashlib.sha256(a+b).digest()
    right = hashlib.sha256(c+d).digest()
    calculated = hashlib.sha256(left+right).digest()
    bits.append('1' if calculated == root else '0')
assert len(bits) == 303
value = int(''.join(bits), 2)
print(value.to_bytes((len(bits)+7)//8, 'big').decode())
```

## 검증 방법

스크립트를 실행하여 아래 출력이 나오는지 확인한다. `stuffing`은 역변환한 블록의 scramble 결과가 0임을 `assert`한다. `no_difference`는 공식 서비스의 충돌 판정을 확인한다.

```text
crypto{U_are_R3ady_For_S4plins_ch4lls}
```

## 최종 플래그

`crypto{U_are_R3ady_For_S4plins_ch4lls}`
