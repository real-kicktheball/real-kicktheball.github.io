---
{"title":"Too Honest","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"챌린지 범위를 검사하지 않으면 엄청 큰 e를 보내 z = r + ew에서 w를 정수 나눗셈으로 꺼낼 수 있다.","section":["CryptoHack","ZKPs"]}
---

## 개념

Schnorr 응답 $z = r + e w$에서 $r$은 $w$를 가리는 역할을 한다. 이건 $e w$가 $r$보다 크지 않을 때만 의미가 있다. 정상적으로는 $\bmod q$로 줄이고 $e$를 작은 범위로 제한한다.

만약 $\bmod q$를 하지 않고, $e$의 범위도 검사하지 않는다고 하자. $e$가 $r$보다 훨씬 크면 다음이 된다.

$$
z = r + e w, \quad 0 \le r < e \ \Rightarrow\ w = \lfloor z / e \rfloor, \quad r = z \bmod e
$$

몫과 나머지가 정확히 $w$와 $r$로 분리된다. 입력 범위 검사가 프로토콜 안전성의 일부라는 걸 보여준다.

## 문제

서버(증명자)가 챌린지가 $0 \le e < 2^{128}$인지 확인하지 않는다. 응답은 정수 그대로 준다.

## 풀이

1. $e = 2^{1024}$를 보낸다. 서버의 $r$은 $2^{768}$보다 작아서 $r < e$이다.
2. 응답 $z$를 $e$로 정수 나눗셈하면 $w$가 나온다.
3. 바이트로 바꾸면 `}`까지가 플래그다.

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

## 플래그
```text
crypto{2_hon3st_to_b3_tru3}
```
