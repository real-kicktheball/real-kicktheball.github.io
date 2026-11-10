---
{"title":"Adrien's Signs","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"소수 p≡3 mod 4에서는 −1이 이차 비잉여다. a의 거듭제곱은 이차잉여이고, 음수로 바꾼 값은 비잉여이므로 Legendre 판정으로 비트 1과 0을 구분한다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

소수 p≡3 mod 4에서는 −1이 이차 비잉여다. a의 거듭제곱은 이차잉여이고, 음수로 바꾼 값은 비잉여이므로 Legendre 판정으로 비트 1과 0을 구분한다.

## 최종 풀이 코드

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

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

`python3`로 코드를 재실행해 아래 결과를 얻었다. Legendre 값이 1/−1로 분리되는지 검사하고, 복원한 바이트를 UTF-8 문자열로 읽는다.

```text
crypto{p4tterns_1n_re5idu3s}
```

## 최종 플래그

`crypto{p4tterns_1n_re5idu3s}`
