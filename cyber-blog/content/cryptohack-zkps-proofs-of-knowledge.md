---
{"title":"Proofs of Knowledge","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"Schnorr 지식 증명에서 증인 w가 첨부 소스에 그대로 있다. r=0을 선택하여 a=g^r=1을 보내고, 서버의 임의 챌린지 e에 대해 z=e w\\bmod q를 계산한다. 검증식 g^z=a y^e\\bmod p가 성립한다.","section":["CryptoHack","ZKPs"]}
---

## 풀이 방법

Schnorr 지식 증명에서 증인 $w$가 첨부 소스에 그대로 있다. $r=0$을 선택하여 $a=g^r=1$을 보내고, 서버의 임의 챌린지 $e$에 대해 $z=e w\bmod q$를 계산한다. 검증식 $g^z=a y^e\bmod p$가 성립한다.

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

SOURCE_URL='https://cryptohack.org/static/challenges/13425_eae1ef15ed9cf9c7ea84ae9e7e27ccab.py'
c=constants(SOURCE_URL,'p','q','g','w')
s,f=connect(13425)
send(f,{'a':1})
e=recv(f)['e']
z=(e*c['w'])%c['q']
assert pow(c['g'],z,c['p'])==pow(pow(c['g'],c['w'],c['p']),e,c['p'])
send(f,{'z':z})
print(recv(f)['flag'])
s.close()
```

## 검증 방법

코드 내 `assert`가 관련 수학식을 검증한다. 공식 소켓 서버의 응답 또는 복원한 증인에서 아래 플래그가 출력되는 것을 확인한다.

## 최종 플래그

```text
crypto{sigma_protocol_complete!}
```
