---
{"title":"Legendre Symbol","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"르장드르 기호와 오일러 판정법으로 이차잉여를 빠르게 판정하고, p ≡ 3 (mod 4)일 때 제곱근을 a^((p+1)/4)로 구한다.","section":["CryptoHack","Mathematics"]}
---

## 개념

$p$가 커지면 전수조사로는 이차잉여를 판정할 수 없다. 대신 **르장드르 기호**를 쓴다.

$$
\left(\frac{a}{p}\right) =
\begin{cases}
\ \ 1 & a\text{가 이차잉여} \\
-1 & a\text{가 이차비잉여} \\
\ \ 0 & a \equiv 0
\end{cases}
$$

**오일러 판정법**을 쓰면 거듭제곱 한 번으로 이 값을 계산할 수 있다.

$$
\left(\frac{a}{p}\right) \equiv a^{(p-1)/2} \pmod p
$$

왜 그런지 보면, $a = x^2$이면 $a^{(p-1)/2} = x^{p-1} \equiv 1$이다(페르마의 소정리).

판정 다음에는 제곱근을 구해야 한다. **$p \equiv 3 \pmod 4$**이면 간단한 공식이 있다.

$$
x = a^{(p+1)/4} \bmod p
$$

검산해보면 $x^2 = a^{(p+1)/2} = a \cdot a^{(p-1)/2} = a \cdot 1 = a$이다.

## 문제

1024비트 소수 $p$와 정수 목록 `ints`가 주어진다. 이 중 이차잉여인 수 하나를 찾아 그 제곱근 중 **큰 값**을 제출한다.

## 풀이

1. 각 수에 $a^{(p-1)/2} \bmod p$를 계산해서 1이 나오는 수를 찾는다. 딱 하나만 나온다.
2. $p \bmod 4 = 3$인 것을 확인하고, $r = a^{(p+1)/4} \bmod p$로 제곱근을 구한다.
3. 두 근 $r$, $p - r$ 중 큰 값을 제출한다.

## 풀이 코드
```python
import ast, urllib.request
url = 'https://cryptohack.org/static/challenges/output_479698cde19aaa05d9e9dfca460f5443.txt'
data = urllib.request.urlopen(url).read().decode()
p = int(data.split('p = ')[1].splitlines()[0])
nums = ast.literal_eval(data.split('ints = ')[1])
residues = [a for a in nums if pow(a, (p-1)//2, p) == 1]
assert len(residues) == 1 and p % 4 == 3
a = residues[0]
r = pow(a, (p+1)//4, p)
assert r*r % p == a
flag = max(r, p-r)
print(flag)
```

## 정답
`93291799125366706806545638475797430512104976066103610269938025709952247020061090804870186195285998727680200979853848718589126765742550855954805290253592144209552123062161458584575060939481368210688629862036958857604707468372384278049741369153506182660264876115428251983455344219194133033177700490981696141526`
