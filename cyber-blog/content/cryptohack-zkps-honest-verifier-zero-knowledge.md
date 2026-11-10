---
{"title":"Honest Verifier Zero Knowledge","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"챌린지 e를 미리 알면 w 없이도 검증을 통과하는 대화를 만들 수 있다(시뮬레이터). 이게 영지식성의 근거다.","section":["CryptoHack","ZKPs"]}
---

## 개념

**영지식성**은 이렇게 정의한다. $w$ 없이도 진짜와 구별할 수 없는 대화 기록 $(a, e, z)$를 만들어내는 **시뮬레이터**가 존재해야 한다. 그러면 검증자가 대화에서 얻는 정보는 "혼자서도 만들 수 있는 것"뿐이다.

Schnorr의 시뮬레이터는 순서를 뒤집는다. $e$와 $z$를 먼저 고르고 $a$를 역산한다.

$$
a = g^z \cdot y^{-e} \bmod p
$$

그러면 $g^z = a \cdot y^e$가 자동으로 성립한다. 검증자가 정직하게 랜덤 $e$를 고른다는 가정에서 성립해서 **정직한 검증자 영지식(HVZK)**이라 한다.

## 문제

서버가 챌린지 $e$를 **커밋을 받기 전에** 알려준다. $w$ 없이 검증을 통과해야 한다.

## 풀이

1. 서버가 준 $e$를 받는다.
2. 랜덤 $z$를 고르고 $a = g^z y^{-e} \bmod p$를 계산한다.
3. $(a, z)$를 보내면 검증식이 성립해서 플래그를 받는다.

## 풀이 코드
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

## 플래그
```text
crypto{so_honest_very_zero_knowledge}
```
