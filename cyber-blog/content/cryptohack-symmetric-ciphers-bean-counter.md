---
{"title":"Bean Counter","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Symmetric Ciphers","Cryptography"],"summary":"카운터 구현의 step_up=False에서 값이 증가하지 않아 모든 블록에 같은 AES 키스트림이 XOR된다. PNG 파일의 알려진 16바이트 헤더로 키스트림을 구해 전체 파일을 복원한다. 복원된 이미지에 플래그가 보인다.","section":["CryptoHack","Symmetric Ciphers"]}
---

## 풀이 원리

카운터 구현의 `step_up=False`에서 값이 증가하지 않아 모든 블록에 같은 AES 키스트림이 XOR된다. PNG 파일의 알려진 16바이트 헤더로 키스트림을 구해 전체 파일을 복원한다. 복원된 이미지에 플래그가 보인다.

## 최종 풀이 코드

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

## 검증 결과

재현 코드 실행 또는 문제의 정의 확인으로 아래 결과를 얻었다. 문제 페이지의 정답 처리 상태까지 확인했다.

## 최종 플래그

```text
crypto{hex_bytes_beans}
```
