---
{"title":"Seventy-Two","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"bcrypt는 입력을 72바이트까지만 쓴다. 앞에 다른 값을 붙여 해시하면 비밀번호의 대부분이 잘려나갈 수 있다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

**bcrypt**는 비밀번호 해싱용으로 널리 쓰인다. 그런데 Blowfish 키 스케줄 특성상 **입력의 앞 72바이트만** 사용하고 나머지는 조용히 버린다.

그래서 `tenant | username | password`처럼 앞에 다른 값을 붙여 bcrypt에 넣으면 문제가 생긴다. 앞부분이 길수록 비밀번호가 잘려나간다. 실제로 2024년 Okta의 인증 캐시 키가 이 문제로 비밀번호 검사를 우회당했다.

## 문제

로그인 서버가 `tenant|username|password`를 bcrypt로 검사한다. 대상 계정 `k.barrymore@corp.bluerock.example`의 비밀번호는 32자 랜덤이다.

## 풀이

1. `tenant|username|`까지 길이를 세면 이미 71바이트다.
2. 그래서 비밀번호는 **첫 글자 1바이트만** bcrypt에 들어간다.
3. 첫 글자를 영문·숫자 62개 중에서 바꿔가며 시도한다. 나머지 31자는 아무거나 넣어도 된다.
4. 맞는 첫 글자에서 로그인되고 플래그가 나온다.

## 풀이 코드
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

## 플래그
`crypto{53v3n7y_7w0_by73_c31l1n6}`
