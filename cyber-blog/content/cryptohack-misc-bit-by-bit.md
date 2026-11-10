---
{"title":"Bit by Bit","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"소스에서 각 비트는 padding << (1 + bit)로 암호화된다. padding=256^e와 ElGamal 공유 비밀은 모두 이차 잉여이고, 이 소수에서 2는 이차 비잉여다. 따라서 bit=0이면 평문의 Legendre 기호가 -1, …","section":["CryptoHack","Misc"]}
---

분야: Misc / elgamal  
문제: https://cryptohack.org/challenges/misc/#bit  
소스: https://cryptohack.org/static/challenges/source_b7cb6015e70a394f3e58fdf2a61aa06f.py  
데이터: https://cryptohack.org/static/challenges/output_1078aca02f2ab796a8c51773f3c332ee.txt  
검증: 2026-11-10, 로컬 실행 확인. CryptoHack 계정 제출 대기

## 풀이 방법

소스에서 각 비트는 `padding << (1 + bit)`로 암호화된다. `padding=256^e`와 ElGamal 공유 비밀은 모두 이차 잉여이고, 이 소수에서 2는 이차 비잉여다. 따라서 bit=0이면 평문의 Legendre 기호가 -1, bit=1이면 +1이다. ElGamal 암호문의 두 번째 성분은 이 기호를 그대로 보존한다. 모든 `c2`의 Legendre 기호를 계산하고 원래 비트 순서인 최하위 비트부터 조립한다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. 공식 첨부 파일을 내려받아 플래그를 재구성한다.

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

## 검증 방법

`pow(2,(q-1)//2,q)==q-1`을 확인한다. 공식 출력의 399개 암호문에서 399비트를 복원했으며 최종 바이트가 아래 플래그다.

## 최종 플래그

```text
crypto{s0m3_th1ng5_4r3_pr3served_4ft3r_encrypti0n}
```
