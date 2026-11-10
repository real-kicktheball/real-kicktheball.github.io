---
{"title":"Merkle Trees","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"머클 트리는 잎 해시를 짝지어 올라가며 루트 하나로 전체를 대표한다. 루트를 직접 계산해 증명이 맞는지 검사한다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

**머클 트리**는 많은 데이터를 **해시 하나로 요약**하는 나무 모양 구조다.

### 직접 해보기 (데이터 4개: a, b, c, d)

```
              루트 = H( H(a+b) + H(c+d) )
               /                    \
          H(a+b)                  H(c+d)
          /    \                  /    \
         a      b                c      d
```

1. 두 개씩 짝지어 붙인 뒤 해시한다: $H(a+b)$, $H(c+d)$
2. 그 결과를 다시 짝지어 해시한다: 루트

### 좋은 점

- **데이터 하나만 바뀌어도 루트가 바뀐다.** 그래서 루트만 비교하면 전체가 그대로인지 알 수 있다.
- "$c$가 이 나무에 들어 있다"를 증명할 때 모든 데이터가 필요 없다. $d$와 $H(a+b)$만 있으면 루트를 다시 계산할 수 있다.

비트코인 블록, Git 저장소가 이 구조를 쓴다.

### 이 문제에서

각 줄에 a, b, c, d와 루트가 있다. 직접 루트를 계산해서 맞으면 1, 틀리면 0으로 적는다. 0과 1을 이어 붙여 글자로 바꾸면 플래그가 나온다.

### 정리

**머클 트리**는 데이터 조각들의 해시를 두 개씩 묶어 다시 해시하는 과정을 반복해서 **루트 해시** 하나를 만든다.

```
            root = H(H(a||b) || H(c||d))
           /                          \
      H(a||b)                      H(c||d)
      /     \                      /     \
     a       b                    c       d
```

조각 하나만 바뀌어도 루트가 바뀐다. 그래서 루트만 믿으면 전체 무결성을 확인할 수 있다. 특정 조각이 포함됐다는 증명도 형제 노드 $\log n$개만 있으면 된다. 비트코인 블록, Git, Certificate Transparency 로그가 이 구조를 쓴다.

## 문제

각 줄에 잎 해시 4개 $(a, b, c, d)$와 루트가 있다. 루트가 맞는 줄은 비트 1, 틀린 줄은 비트 0이다.

## 풀이

1. 줄마다 $\text{SHA256}(\text{SHA256}(a\|b) \,\|\, \text{SHA256}(c\|d))$를 계산해 루트와 비교한다.
2. 303개 비트를 이어 정수로 만든다.
3. 첫 비트가 0이라 303비트다. 이걸 38바이트로 바꾸면 플래그가 된다.

## 풀이 코드
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

## 플래그
`crypto{U_are_R3ady_For_S4plins_ch4lls}`
