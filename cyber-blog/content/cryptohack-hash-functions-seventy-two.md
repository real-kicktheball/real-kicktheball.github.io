---
{"title":"Seventy-Two","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"bcrypt는 입력을 72바이트까지만 쓴다. 앞에 다른 값을 붙여 해시하면 비밀번호의 대부분이 잘려나갈 수 있다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

**bcrypt**는 비밀번호를 안전하게 저장할 때 많이 쓰는 해시다. 일부러 느리게 만들어서 비밀번호를 하나씩 맞혀보는 공격을 어렵게 한다.

그런데 bcrypt에는 숨은 규칙이 있다.

> 입력의 **앞 72바이트만** 쓰고, 나머지는 조용히 버린다.

### 직접 해보기

아래 둘은 bcrypt에게 **똑같은 입력**이다. 앞 72글자가 같기 때문이다.

```
[70글자짜리 앞부분] + "ab" + "secret123"
[70글자짜리 앞부분] + "ab" + "아무거나"
```

### 이 문제에서

서버는 `회사이름|아이디|비밀번호`를 이어 붙여서 bcrypt에 넣는다. 그런데 `회사이름|아이디|`까지가 이미 **71글자**다. 그래서 32글자 비밀번호 중 **첫 글자 하나만** 확인된다.

첫 글자는 영문 대소문자와 숫자 62가지 중 하나다. 62번만 시도하면 로그인된다.

실제로 2024년 Okta라는 로그인 서비스에서 이 문제 때문에 비밀번호 확인이 우회되는 사고가 있었다.

### 정리

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
