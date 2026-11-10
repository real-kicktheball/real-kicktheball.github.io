---
{"title":"The Matrix","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"평문 비트열을 50×50의 가역 행렬 M으로 만든 후 C=M^31337을 공개한다. GL(50, 2)에 속하는 모든 행렬의 차수는 lcm(2^1−1, …, 2^50−1) × 64의 약수이다. 31337은 이 값과 서로소이므로 역지수 d를 구…","section":["CryptoHack","Diffie-Hellman"]}
---

## 풀이 원리

평문 비트열을 50×50의 가역 행렬 `M`으로 만든 후 `C=M^31337`을 공개한다. `GL(50, 2)`에 속하는 모든 행렬의 차수는 `lcm(2^1−1, …, 2^50−1) × 64`의 약수이다. `31337`은 이 값과 서로소이므로 역지수 `d`를 구해 `C^d=M`을 복원한다. 생성 코드가 비트를 `msg[i::50]`으로 행에 분배하므로 복원할 때는 열을 먼저 읽는다.

## 최종 익스플로잇

아래를 `solve.sage`로 저장하고 `sage solve.sage`로 실행한다.

```python
import requests

url = 'https://cryptohack.org/static/challenges/flag_403b981c77d39217c20390c1729b15f0.enc'
rows = requests.get(url, timeout=20).text.strip().splitlines()
C = Matrix(GF(2), [[int(bit) for bit in row] for row in rows])
assert C.nrows() == C.ncols() == 50

group_exponent = 64
for i in range(1, 51):
    group_exponent = lcm(group_exponent, 2^i - 1)
assert gcd(group_exponent, 31337) == 1
d = inverse_mod(31337, group_exponent)
M = C^d
assert M^31337 == C

bits = [int(M[row, col]) for col in range(50) for row in range(50)]
decoded = bytes(int(''.join(map(str, bits[i:i+8])), 2)
                for i in range(0, len(bits)-7, 8))
flag = decoded.split(b'}', 1)[0] + b'}'
assert flag.startswith(b'crypto{')
print(flag.decode())
```

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

복원한 행렬을 다시 31337제곱해 암호문과 정확히 일치함을 확인했다. 추출한 비트열은 정상적인 `crypto{...}` 형식을 갖는다.

## 최종 플래그

`crypto{there_is_no_spoon_66eff188}`
