---
{"title":"Collider","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Hash Functions","Cryptography"],"summary":"MD5는 충돌이 실제로 만들어지는 깨진 해시다. 공개된 충돌 쌍으로 MD5를 키로 쓰는 저장소를 속인다.","section":["CryptoHack","Hash Functions"]}
---

## 개념

**MD5**는 옛날에 많이 쓰던 해시 함수다. 그런데 2004년 중국의 왕샤오윈(Wang Xiaoyun) 교수 팀이 **서로 다른 두 파일인데 MD5 지문이 똑같은 쌍**을 만드는 방법을 발견했다. 지금은 보통 컴퓨터로도 몇 초면 만든다.

### 비유

지문 인식 문인데 **서로 다른 두 사람의 지문이 똑같이** 인식된다면? 한 사람이 등록하고 다른 사람이 들어갈 수 있다.

### 왜 위험할까?

MD5 지문으로 "이 파일은 그 파일과 같다"고 판단하는 시스템이 있다고 하자.

1. 착한 파일을 보여주고 승인받는다.
2. 같은 MD5를 가진 나쁜 파일로 바꿔치기한다.
3. 지문이 같으니 시스템은 눈치채지 못한다.

실제로 2008년 연구자들이 MD5 충돌로 **가짜 인증기관 인증서**를 만들어 보이기도 했다.

### 이 문제에서

서버는 MD5 지문을 이름표로 문서를 저장한다. 인터넷에 공개된 **MD5 충돌 파일 쌍**을 차례로 보내면, 서버가 "같은 지문인데 내용이 다르네?" 하면서 플래그를 준다.

### 정리

**MD5**는 2004년 Wang 등이 실제 충돌을 만들면서 깨졌다. 지금은 일반 PC로 몇 초 만에 같은 MD5를 가진 서로 다른 두 파일을 만들 수 있다(`fastcoll` 등).

- **identical-prefix 충돌**: 같은 접두사 뒤에 서로 다른 블록을 붙여 해시를 맞춘다.
- **chosen-prefix 충돌**: 서로 다른 접두사로도 충돌을 만든다. 2008년 가짜 CA 인증서를 만드는 데 쓰였다.

MD5를 무결성이나 식별자로 쓰면 이 충돌 때문에 문제가 생긴다.

## 문제

서버가 문서를 MD5 해시를 키로 저장한다. 같은 해시인데 내용이 다른 문서가 들어오면 오류 메시지에 플래그가 들어 있다.

## 풀이

1. 공개된 MD5 충돌 쌍(corkami `fastcoll1.bin`, `fastcoll2.bin`)을 가져온다.
2. 두 파일의 내용이 다르고 MD5는 같은지 확인한다.
3. 두 문서를 차례로 등록한다.
4. 두 번째에서 충돌이 감지되면서 플래그가 나온다.

## 풀이 코드
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

## 플래그
`crypto{m0re_th4n_ju5t_p1g30nh0le_pr1nc1ple}`
