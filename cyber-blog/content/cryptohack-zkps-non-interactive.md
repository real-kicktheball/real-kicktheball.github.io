---
{"title":"Non-Interactive","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"Fiat–Shamir 변환에서 챌린지는 a의 SHA-512 해시로 정해진다. 첨부 소스에 있는 증인 w를 사용해 a=g^r, e=H(a)\\bmod 2^{511}, z=r+ew\\bmod q를 계산한다.","section":["CryptoHack","ZKPs"]}
---

## 풀이 방법

Fiat–Shamir 변환에서 챌린지는 $a$의 SHA-512 해시로 정해진다. 첨부 소스에 있는 증인 $w$를 사용해 $a=g^r$, $e=H(a)\bmod 2^{511}$, $z=r+ew\bmod q$를 계산한다.

## 최종 익스플로잇

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

## 최종 플래그

```text
crypto{shvzk_and_ss_to_nizk}
```
