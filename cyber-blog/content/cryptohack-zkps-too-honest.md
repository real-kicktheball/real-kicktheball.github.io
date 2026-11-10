---
{"title":"Too Honest","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"서버가 0\\le e<2^{128} 범위를 검사하지 않는다. 범위 밖의 e=2^{1024}를 보내면 응답 z=r+e w에서 r<2^{768}<e이므로 정수 나눗셈 z//e가 증인 w를 정확히 드러낸다. 처음 바이트의 }까지가 플래그다.","section":["CryptoHack","ZKPs"]}
---

## 풀이 방법

서버가 $0\le e<2^{128}$ 범위를 검사하지 않는다. 범위 밖의 $e=2^{1024}$를 보내면 응답 $z=r+e w$에서 $r<2^{768}<e$이므로 정수 나눗셈 $z//e$가 증인 $w$를 정확히 드러낸다. 처음 바이트의 `}`까지가 플래그다.

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

SOURCE_URL='https://cryptohack.org/static/challenges/13429_2520b4ebce10bd8b830bc5dc3d67da2b.py'
c=constants(SOURCE_URL,'N')
s,f=connect(13429)
msg=recv(f)
e=2**1024
send(f,{'e':e})
z=recv(f)['z']
w=z//e
assert pow(2,-w,c['N'])==msg['y']
raw=w.to_bytes((w.bit_length()+7)//8,'big')
print((raw.split(b'}',1)[0]+b'}').decode())
s.close()
```

## 최종 플래그

```text
crypto{2_hon3st_to_b3_tru3}
```
