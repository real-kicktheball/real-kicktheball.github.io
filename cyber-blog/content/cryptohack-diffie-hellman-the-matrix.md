---
{"title":"The Matrix","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"가역 행렬군 GL(n, 2)에서 M^e를 주면 군의 위수를 이용해 e의 역지수로 M을 복원할 수 있다. RSA와 같은 원리다.","section":["CryptoHack","Diffie-Hellman"]}
---

## 개념

$\mathrm{GF}(2)$ 위의 가역 $n \times n$ 행렬들은 곱셈에 대해 군 $\mathrm{GL}(n, 2)$를 이룬다.

RSA와 같은 원리를 쓸 수 있다. 군의 모든 원소에 대해 $M^{E} = I$가 되는 $E$(군의 지수)를 알고, $\gcd(e, E) = 1$이라 하자. 그러면 $d = e^{-1} \bmod E$로 $e$제곱을 되돌린다.

$$
(M^{e})^{d} = M^{ed} = M^{1 + kE} = M
$$

$\mathrm{GL}(n, 2)$에서 각 행렬의 위수는 특성다항식 인수들의 위수로 정해진다. 그래서 다음 값을 $E$로 쓰면 모든 원소의 위수를 나눈다.

$$
E = \operatorname{lcm}(2^1 - 1, 2^2 - 1, \dots, 2^{50} - 1) \times 64
$$

$\times 64$는 단위근이 아닌 부분(멱영 부분)의 위수를 커버하는 2의 거듭제곱이다.

## 문제

플래그 비트로 50×50 가역 행렬 $M$을 만들고 $C = M^{31337}$을 공개했다.

## 풀이

1. 위 $E$를 계산하고 $\gcd(31337, E) = 1$인 것을 확인한다.
2. $d = 31337^{-1} \bmod E$로 $M = C^{d}$를 구한다(SageMath).
3. $M^{31337} = C$가 맞는지 확인한다.
4. 생성 코드가 비트를 `msg[i::50]`으로 행에 나눠 넣었기 때문에 열 방향으로 읽어서 플래그를 복원한다.

## 풀이 코드
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

## 플래그
`crypto{there_is_no_spoon_66eff188}`
