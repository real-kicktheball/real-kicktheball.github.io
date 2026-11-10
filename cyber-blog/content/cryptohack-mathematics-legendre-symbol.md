---
{"title":"Legendre Symbol","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"오일러 판정식으로 이차잉여를 찾는다. p ≡ 3 (mod 4)이므로 a^((p+1)/4)가 제곱근이다. 큰 근을 고른다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

오일러 판정식으로 이차잉여를 찾는다. p ≡ 3 (mod 4)이므로 a^((p+1)/4)가 제곱근이다. 큰 근을 고른다.

## 최종 풀이 코드

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

## 최종 답

`93291799125366706806545638475797430512104976066103610269938025709952247020061090804870186195285998727680200979853848718589126765742550855954805290253592144209552123062161458584575060939481368210688629862036958857604707468372384278049741369153506182660264876115428251983455344219194133033177700490981696141526`
