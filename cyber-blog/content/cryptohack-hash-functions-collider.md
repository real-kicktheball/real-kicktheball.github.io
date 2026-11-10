---
{"title":"Collider","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"문서 저장소의 키가 MD5 해시다. 사전의 기존 문서에 대한 두 번째 원상을 찾을 필요는 없다. 먼저 공격자가 고른 MD5 충돌 쌍의 첫 문서를 등록하고, 같은 연결에서 다른 문서를 등록한다. 두 문서의 바이트열은 다르지만 MD5가 같아 충…","section":["CryptoHack","Hash Functions"]}
---

- 원문: https://cryptohack.org/challenges/hashes/#collider
- 검증: 공식 소켓 서비스가 아래 플래그를 반환; CryptoHack 채점 Success!
- MD5 충돌 테스트 벡터: https://github.com/corkami/collisions/tree/master/examples

## 풀이 원리

문서 저장소의 키가 MD5 해시다. 사전의 기존 문서에 대한 두 번째 원상을 찾을 필요는 없다. 먼저 공격자가 고른 MD5 충돌 쌍의 첫 문서를 등록하고, 같은 연결에서 다른 문서를 등록한다. 두 문서의 바이트열은 다르지만 MD5가 같아 충돌 처리 경로에서 플래그가 나온다. 충돌 쌍은 corkami의 공개 테스트 벡터를 사용했다.

## 최종 익스플로잇

Python 3에서 실행한다. `collider`는 `requests`, `md0`는 `pycryptodome`이 필요하다.

```python
import requests, hashlib, json, socket, re
base = 'https://raw.githubusercontent.com/corkami/collisions/master/examples/'
a = requests.get(base+'fastcoll1.bin', timeout=20).content
b = requests.get(base+'fastcoll2.bin', timeout=20).content
assert a != b and hashlib.md5(a).digest() == hashlib.md5(b).digest()
with socket.create_connection(('socket.cryptohack.org',13389),timeout=10) as sock:
    io = sock.makefile('rwb',buffering=0)
    io.readline()
    for doc in (a,b):
        io.write(json.dumps({'document':doc.hex()}).encode()+b'\n')
        reply = json.loads(io.readline())
print(re.search(r'crypto\{[^}]+\}',reply['error']).group(0))
```

## 검증 방법

코드를 실행해 플래그가 출력되는지 확인한다. `collider`는 두 문서가 다른데도 MD5가 동일함을 `assert`하고, `md0`는 공식 서비스의 `get_flag` 응답을 확인한다.

```text
crypto{m0re_th4n_ju5t_p1g30nh0le_pr1nc1ple}
```

## 최종 플래그

`crypto{m0re_th4n_ju5t_p1g30nh0le_pr1nc1ple}`
