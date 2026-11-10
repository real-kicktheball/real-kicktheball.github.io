---
{"title":"Bean Counter","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"CTR의 카운터가 증가하지 않으면 모든 블록이 같은 키스트림으로 암호화된다. PNG 헤더(알려진 평문)로 키스트림을 복원한다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 개념

**CTR 모드**는 카운터를 암호화해서 키스트림을 만든다.

$$
C_i = P_i \oplus E_K(\text{nonce} \,\|\, i)
$$

카운터가 블록마다 바뀌어야 키스트림도 바뀐다. 카운터가 고정되면 16바이트 키스트림이 반복되는 반복 키 XOR이 된다.

파일 형식에는 고정된 **매직 바이트**가 있어서 알려진 평문으로 쓸 수 있다. PNG의 첫 16바이트는 항상 같다.

```
89 50 4E 47 0D 0A 1A 0A  00 00 00 0D 49 48 44 52
```

앞 8바이트는 PNG 시그니처, 뒤 8바이트는 IHDR 청크 시작이다.

## 문제

직접 구현한 CTR 카운터 클래스가 있다. `step_up=False`로 설정돼 있어서 카운터 값이 증가하지 않는다. 플래그가 담긴 PNG 파일이 이 방식으로 암호화돼 있다.

## 풀이

1. 암호문 첫 16바이트와 PNG 헤더를 XOR해서 키스트림 16바이트를 얻는다.
2. 이 키스트림을 반복해서 전체 파일과 XOR한다.
3. 복원된 PNG를 열면 이미지에 플래그가 적혀 있다.

## 풀이 코드
```python
import requests
from pathlib import Path
u='https://aes.cryptohack.org/bean_counter/encrypt/'
c=bytes.fromhex(requests.get(u).json()['encrypted'])
header=bytes.fromhex('89504e470d0a1a0a0000000d49484452')
keystream=bytes(a^b for a,b in zip(c[:16],header))
p=bytes(x^keystream[i%16] for i,x in enumerate(c))
assert p.startswith(header)
Path('bean_flag.png').write_bytes(p)
print('bean_flag.png에서 crypto{hex_bytes_beans} 확인')
```

## 플래그
```text
crypto{hex_bytes_beans}
```
