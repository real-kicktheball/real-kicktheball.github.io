---
{"title":"Special Soundness","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"서버는 같은 난수 r로 두 개의 응답 z_1=r+e_1w, z_2=r+e_2w를 만든다. e_1=0, e_2=1을 보내면 w=z_2-z_1\\bmod q다. 추출한 정수의 앞부분이 플래그다.","section":["CryptoHack","ZKPs"]}
---

## 풀이 방법

서버는 같은 난수 $r$로 두 개의 응답 $z_1=r+e_1w$, $z_2=r+e_2w$를 만든다. $e_1=0$, $e_2=1$을 보내면 $w=z_2-z_1\bmod q$다. 추출한 정수의 앞부분이 플래그다.

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

SOURCE_URL='https://cryptohack.org/static/challenges/13426_2434b3b3f4044a63115e18e476f420db.py'
c=constants(SOURCE_URL,'p','q','g')
s,f=connect(13426)
first=recv(f)
send(f,{'e':0})
z1=recv(f)['z']
second=recv(f)
assert first['a']==second['a2']
send(f,{'e':1})
z2=recv(f)['z2']
w=(z2-z1)%c['q']
assert pow(c['g'],w,c['p'])==first['y']
raw=w.to_bytes((w.bit_length()+7)//8,'big')
print((raw.split(b'}',1)[0]+b'}').decode())
s.close()
```

## 최종 플래그

```text
crypto{specially_sound_sigmas}
```
