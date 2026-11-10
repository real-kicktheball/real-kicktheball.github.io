---
{"title":"Special Soundness","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"같은 커밋 r로 서로 다른 챌린지 두 개에 응답하면 증인 w가 추출된다. 이 성질이 건전성의 근거다.","section":["CryptoHack","ZKPs"]}
---

## 개념

"가림막 $r$"은 **한 번만** 써야 한다. 같은 $r$로 두 번 대답하면 가림막이 벗겨진다.

### 두 번 대답하면

$$
z_1 = r + e_1 w, \qquad z_2 = r + e_2 w
$$

두 식을 빼면 $r$이 사라진다.

$$
z_2 - z_1 = (e_2 - e_1) w \quad\Rightarrow\quad w = \frac{z_2 - z_1}{e_2 - e_1}
$$

### 직접 해보기 ($r = 4$, $w = 3$)

- $e_1 = 0$ → $z_1 = 4$
- $e_2 = 1$ → $z_2 = 7$
- $w = (7 - 4) \div (1 - 0) = 3$ ✔

### 이게 왜 "건전성"의 증거일까?

"아무 질문에나 대답할 수 있다면 진짜 $w$를 아는 것과 같다"는 뜻이기 때문이다. 같은 약속으로 두 질문에 다 답할 수 있으면 $w$를 계산할 수 있으니까. 그래서 **모르는 사람은 두 질문 중 하나에만 답할 수 있고**, 랜덤 질문을 받으면 틀릴 확률이 높다.

### 이 문제에서

서버가 같은 $r$로 두 번 대답해준다. $e_1 = 0$, $e_2 = 1$을 보내서 $w$(플래그)를 계산한다.

### 정리

시그마 프로토콜의 **특수 건전성(special soundness)**은 다음 성질이다. 같은 커밋 $a$에 대해 서로 다른 챌린지 $e_1 \ne e_2$의 응답을 모두 만들 수 있으면, 그 둘로 $w$를 계산할 수 있다.

$$
z_1 = r + e_1 w, \quad z_2 = r + e_2 w
\quad\Rightarrow\quad
w = \frac{z_2 - z_1}{e_2 - e_1} \bmod q
$$

즉 "아무 챌린지에나 답할 수 있다면 $w$를 아는 것과 같다"는 뜻이다. 이게 건전성의 근거다. 반대로 같은 $r$을 재사용하면 $w$가 유출된다(ECDSA nonce 재사용과 같은 원리).

## 문제

서버가 증명자 역할을 하는데, 같은 $r$로 챌린지 두 개에 응답해준다.

## 풀이

1. 챌린지로 $e_1 = 0$, $e_2 = 1$을 보낸다.
2. $w = z_2 - z_1 \bmod q$이다.
3. 정수를 바이트로 바꾸면 앞부분이 플래그다.

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

## 플래그
```text
crypto{specially_sound_sigmas}
```
