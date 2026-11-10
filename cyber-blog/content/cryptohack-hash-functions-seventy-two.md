---
{"title":"Seventy-Two","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"bcrypt는 입력 키를 72바이트까지만 사용한다. 테넌트 식별자와 k.barrymore@corp.bluerock.example 계정명을 붙이면 비밀번호 앞까지 이미 71바이트다. 32바이트 랜덤 비밀번호 중 첫 글자만 bcrypt에 반영된…","section":["CryptoHack","Hash Functions"]}
---

- 원문: https://cryptohack.org/challenges/hashes/#seventy_two
- 검증: 공식 소켓 서비스가 아래 플래그 반환

## 풀이 원리

bcrypt는 입력 키를 72바이트까지만 사용한다. 테넌트 식별자와 `k.barrymore@corp.bluerock.example` 계정명을 붙이면 비밀번호 앞까지 이미 71바이트다. 32바이트 랜덤 비밀번호 중 첫 글자만 bcrypt에 반영된다. 62개 문자 후보를 시도하면 뒤의 31바이트는 어떤 값이든 로그인된다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. `mixed_up`은 약 수백 번의 해시 질의를 하므로 실행에 수분 걸릴 수 있다.

```python
import socket, json, string, re
user = 'k.barrymore@corp.bluerock.example'
with socket.create_connection(('socket.cryptohack.org',13433),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    info=json.loads(io.readline())
    assert len(info['tenant']+'|'+user+'|') == 71
    for first in string.ascii_letters+string.digits:
        candidate=first+'A'*31
        io.write(json.dumps({'username':user,'password':candidate}).encode()+b'\n')
        reply=json.loads(io.readline())
        if 'Flag:' in reply.get('msg',''):
            print(re.search(r'crypto\{[^}]+\}',reply['msg']).group(0))
            break
    else:
        raise RuntimeError('first password character not found')
```

## 검증 방법

코드가 공식 서비스의 응답에서 아래 플래그를 출력하는지 확인한다.

```text
crypto{53v3n7y_7w0_by73_c31l1n6}
```

## 최종 플래그

`crypto{53v3n7y_7w0_by73_c31l1n6}`
