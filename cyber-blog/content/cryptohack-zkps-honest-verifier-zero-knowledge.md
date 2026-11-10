---
{"title":"Honest Verifier Zero Knowledge","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"증인을 몰라도 챌린지 e가 먼저 공개되면 유효한 대화 기록을 시뮬레이션할 수 있다. 임의의 z를 정하고 a=g^z y^{-e}\\bmod p로 계산해 보내면 검증식이 자동으로 성립한다.","section":["CryptoHack","ZKPs"]}
---

## 풀이 방법

증인을 몰라도 챌린지 $e$가 먼저 공개되면 유효한 대화 기록을 시뮬레이션할 수 있다. 임의의 $z$를 정하고 $a=g^z y^{-e}\bmod p$로 계산해 보내면 검증식이 자동으로 성립한다.

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

SOURCE_URL='https://cryptohack.org/static/challenges/13427_ee325da3215875e43f67b397f8d111c7.py'
c=constants(SOURCE_URL,'p','q','g')
s,f=connect(13427)
msg=recv(f)
e,y=msg['e'],msg['y']
z=123456789
a=pow(c['g'],z,c['p'])*pow(y,-e,c['p'])%c['p']
assert pow(c['g'],z,c['p'])==a*pow(y,e,c['p'])%c['p']
send(f,{'a':a,'z':z})
print(recv(f)['flag'])
s.close()
```

## 최종 플래그

```text
crypto{so_honest_very_zero_knowledge}
```
