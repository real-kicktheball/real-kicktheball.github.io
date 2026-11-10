---
{"title":"Bit by Bit","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"ElGamal은 르장드르 기호(이차잉여 여부)를 보존할 수 있다. 메시지가 잉여/비잉여로 비트를 담으면 그대로 읽힌다.","section":["CryptoHack","Misc"]}
---

## 개념

**ElGamal**은 Diffie-Hellman을 이용한 공개키 암호다. 메시지 $m$에 "비밀 공유값"을 곱해서 숨긴다.

$$
c_2 = m \times (\text{공유값})
$$

### 숨겨지지 않는 성질

Mathematics 단원에서 배운 **이차잉여**를 떠올려보자. 잉여/비잉여는 부호처럼 곱해진다.

| | 잉여(+) | 비잉여(-) |
|---|---|---|
| × 잉여(+) | 잉여(+) | 비잉여(-) |

공유값이 항상 **잉여(+)**라면 이렇게 된다.

- $m$이 잉여(+) → $c_2$도 잉여(+)
- $m$이 비잉여(-) → $c_2$도 비잉여(-)

곱해서 숨겨도 **+/- 부호는 그대로** 남는다.

### 직접 해보기 ($p = 7$, 잉여: 1, 2, 4)

공유값이 2(잉여)라 하자.

- $m = 4$(잉여) → $c_2 = 8 \equiv 1$ → 잉여 ✔
- $m = 3$(비잉여) → $c_2 = 6$ → 비잉여 ✔

### 이 문제에서

비트가 1이면 잉여인 메시지를, 0이면 비잉여인 메시지를 암호화했다. 암호문 $c_2$의 잉여 여부만 확인하면 비트가 다 보인다. 플래그도 "암호화한 뒤에도 보존되는 것이 있다"는 뜻이다.

### 정리

**ElGamal 암호화**는 $c_1 = g^k$, $c_2 = m \cdot h^k$이다($h = g^x$가 공개키).

르장드르 기호는 곱셈적이다.

$$
\left(\frac{c_2}{q}\right) = \left(\frac{m}{q}\right)\left(\frac{h^k}{q}\right)
$$

$h^k$가 항상 이차잉여라면 $\left(\frac{c_2}{q}\right) = \left(\frac{m}{q}\right)$가 된다. 그러면 메시지의 잉여 여부가 암호문에 그대로 남는다. ElGamal을 쓸 때 메시지를 이차잉여 부분군 안에 넣어야 하는 이유다(DDH 가정).

## 문제

플래그의 각 비트를 다음 메시지로 ElGamal 암호화했다.

$$
m = \text{padding} \cdot 2^{1 + \text{bit}}, \qquad \text{padding} = 256^e
$$

## 풀이

1. $\text{padding} = (16^e)^2$이라 항상 이차잉여다. 공유 비밀 $h^k$도 이 설정에서 이차잉여다.
2. 이 소수에서 2는 이차비잉여다. 그래서 $2^{1}$(bit 0)은 비잉여, $2^{2}$(bit 1)은 잉여다.
3. 각 $c_2$의 르장드르 기호가 +1이면 1, -1이면 0이다.
4. 최하위 비트부터 조립하면 플래그가 나온다.

## 풀이 코드
```python
from urllib.request import urlopen
import ast, re
SOURCE_URL = "https://cryptohack.org/static/challenges/source_b7cb6015e70a394f3e58fdf2a61aa06f.py"
OUTPUT_URL = "https://cryptohack.org/static/challenges/output_1078aca02f2ab796a8c51773f3c332ee.txt"
source = urlopen(SOURCE_URL).read().decode()
tree = ast.parse(source)
q = next(ast.literal_eval(node.value) for node in tree.body
         if isinstance(node,ast.Assign) and len(node.targets)==1
         and isinstance(node.targets[0],ast.Name)
         and node.targets[0].id=='q')
output = urlopen(OUTPUT_URL).read().decode()
c2s = [int(x,16) for x in re.findall(r'c2=0x([0-9a-f]+)', output)]
assert pow(2,(q-1)//2,q)==q-1
bits = [1 if pow(c,(q-1)//2,q)==1 else 0 for c in c2s]
value = sum(bit<<index for index,bit in enumerate(bits))
flag = value.to_bytes((value.bit_length()+7)//8,'big')
print(flag.decode())
```

## 플래그
```text
crypto{s0m3_th1ng5_4r3_pr3served_4ft3r_encrypti0n}
```
