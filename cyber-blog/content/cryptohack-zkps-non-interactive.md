---
{"title":"Non-Interactive","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"Fiat–Shamir 변환에서 챌린지는 a의 SHA-512 해시로 정해진다. 첨부 소스에 있는 증인 w를 사용해 a=g^r, e=H(a)\\bmod 2^{511}, z=r+ew\\bmod q를 계산한다.","section":["CryptoHack","ZKPs"]}
---

분야: ZKPs / zkp-intro  
문제: https://cryptohack.org/challenges/zkp/#sigma-nizk  
소스: https://cryptohack.org/static/challenges/13428_1607c0c5ffb6d27cc09b7a9fd1fab436.py  
검증: 2026-11-10, 공식 소켓 서버에서 플래그 획득. CryptoHack 계정 정답 처리 확인

## 풀이 방법

Fiat–Shamir 변환에서 챌린지는 $a$의 SHA-512 해시로 정해진다. 첨부 소스에 있는 증인 $w$를 사용해 $a=g^r$, $e=H(a)\bmod 2^{511}$, $z=r+ew\bmod q$를 계산한다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. 실행 시 공식 서버와 통신하고 검증식도 검사한다.

```python
import socket, json, ast
from urllib.request import urlopen

def constants(url, *names):
    tree=ast.parse(urlopen(url).read().decode())
    out={}
    for node in tree.body:
        if (isinstance(node,ast.Assign) and len(node.targets)==1
                and isinstance(node.targets[0],ast.Name)
                and node.targets[0].id in names):
            out[node.targets[0].id]=ast.literal_eval(node.value)
    return out

def connect(port):
    sock=socket.create_connection(('socket.cryptohack.org',port),timeout=10)
    sock.settimeout(10)
    f=sock.makefile('rwb')
    f.readline()  # banner
    return sock,f

def send(f,obj):
    f.write(json.dumps(obj).encode()+b'\n')
    f.flush()

def recv(f):
    return json.loads(f.readline())

SOURCE_URL='https://cryptohack.org/static/challenges/13428_1607c0c5ffb6d27cc09b7a9fd1fab436.py'
import hashlib
c=constants(SOURCE_URL,'p','q','g','w')
s,f=connect(13428)
msg=recv(f)
r=123456789
a=pow(c['g'],r,c['p'])
e=int.from_bytes(hashlib.sha512(str(a).encode()).digest(),'big')%2**511
z=(r+e*c['w'])%c['q']
assert pow(c['g'],z,c['p'])==a*pow(msg['y'],e,c['p'])%c['p']
send(f,{'a':a,'z':z})
print(recv(f)['flag'])
s.close()
```

## 검증 방법

코드 내 `assert`가 관련 수학식을 검증한다. 공식 소켓 서버의 응답 또는 복원한 증인에서 아래 플래그가 출력되는 것을 확인한다.

## 최종 플래그

```text
crypto{shvzk_and_ss_to_nizk}
```
