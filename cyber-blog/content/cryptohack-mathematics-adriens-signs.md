---
{"title":"Adrien's Signs","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"p ≡ 3 (mod 4)에서 -1은 이차비잉여다. 그래서 부호를 바꾼 값은 르장드르 기호도 바뀐다. 이걸로 비트를 복원한다.","section":["CryptoHack","Mathematics"]}
---

## 개념

이차잉여와 이차비잉여를 **+와 -**로 생각해보자.

| 곱 | 결과 |
|---|---|
| 잉여(+) × 잉여(+) | 잉여(+) |
| 잉여(+) × 비잉여(-) | 비잉여(-) |
| 비잉여(-) × 비잉여(-) | 잉여(+) |

정말 부호의 곱셈과 똑같다.

### 직접 해보기 ($p = 7$, 잉여: 1, 2, 4 / 비잉여: 3, 5, 6)

- $2 \times 4 = 8 \equiv 1$ → 잉여 × 잉여 = 잉여 ✔
- $2 \times 3 = 6$ → 잉여 × 비잉여 = 비잉여 ✔
- $3 \times 5 = 15 \equiv 1$ → 비잉여 × 비잉여 = 잉여 ✔

그리고 $-1 \equiv 6$은 **비잉여**다. 그래서 어떤 수에 마이너스를 붙이면 잉여/비잉여가 **뒤집힌다**. 2는 잉여인데 $-2 \equiv 5$는 비잉여다.

### 이 문제에서

비밀 비트가 1이면 잉여인 숫자를 보내고, 0이면 마이너스를 붙여서 보낸다. 마이너스를 붙이면 비잉여가 되니까 숫자마다 잉여인지만 판정하면 비트가 다 보인다. 숨기려고 붙인 마이너스 부호가 오히려 정답을 알려준 셈이다.

### 정리

$p \equiv 3 \pmod 4$이면 **$-1$은 이차비잉여**다. 오일러 판정법으로 확인할 수 있다.

$$
(-1)^{(p-1)/2} = -1 \qquad (\tfrac{p-1}{2}\text{가 홀수})
$$

이차잉여의 곱셈 규칙을 적용하면 $n$이 잉여일 때 $-n$은 비잉여가 된다.

$$
\left(\frac{-n}{p}\right) = \left(\frac{-1}{p}\right)\left(\frac{n}{p}\right) = -\left(\frac{n}{p}\right)
$$

## 문제

플래그의 각 비트를 다음처럼 암호화했다($a$, $p$는 공개).

- 비트가 1이면 $n = a^e \bmod p$를 출력한다.
- 비트가 0이면 $-n \bmod p$를 출력한다.

$e$는 매번 랜덤이다.

## 풀이

1. $a$가 이차잉여인지 먼저 확인한다. $a^{(p-1)/2} \equiv 1$이다.
2. 잉여의 거듭제곱 $a^e$는 $e$와 상관없이 항상 이차잉여다.
3. 반대로 $-a^e$는 $p \equiv 3 \pmod 4$이므로 항상 이차비잉여다.

그래서 출력값마다 르장드르 기호를 계산하면 1이면 비트 1, -1이면 비트 0이다. 비트를 8개씩 묶어 바이트로 바꾸면 플래그가 된다.

## 풀이 코드
```python
import ast, requests
url='https://cryptohack.org/static/challenges/output_80fc6398d2fd9f272186d0af510323f9.txt'
nums=ast.literal_eval(requests.get(url,timeout=20).text)
a,p=288260533169915,1007621497415251
assert p%4==3 and pow(a,(p-1)//2,p)==1
bits=''.join('1' if pow(n,(p-1)//2,p)==1 else '0' for n in nums)
flag=bytes(int(bits[i:i+8],2) for i in range(0,len(bits),8)).decode()
assert flag.startswith('crypto{') and flag.endswith('}')
print(flag)
```

## 플래그
`crypto{p4tterns_1n_re5idu3s}`
