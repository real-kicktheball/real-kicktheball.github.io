---
{"title":"Proofs of Knowledge","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"Schnorr 시그마 프로토콜은 커밋-챌린지-응답 3단계로 이산로그 w를 안다는 것을 증명한다.","section":["CryptoHack","ZKPs"]}
---

## 개념

**Schnorr 프로토콜**은 $y = g^w \bmod p$에서 $w$를 안다는 것을 증명한다. 3단계로 진행돼서 **시그마 프로토콜**이라 부른다.

| 단계 | 누가 | 내용 |
|---|---|---|
| 1. 커밋 | 증명자 | 랜덤 $r$을 골라 $a = g^r$을 보낸다. |
| 2. 챌린지 | 검증자 | 랜덤 $e$를 보낸다. |
| 3. 응답 | 증명자 | $z = r + e w \bmod q$를 보낸다. |

검증자는 다음 식을 확인한다.

$$
g^z \stackrel{?}{=} a \cdot y^e \pmod p
$$

$g^z = g^{r + ew} = g^r (g^w)^e = a y^e$라서 정직한 증명자는 통과한다. $r$이 $w$를 가려주기 때문에 $z$만 봐서는 $w$를 알 수 없다.

## 문제

서버가 검증자 역할을 한다. 첨부 소스에 증인 $w$가 그대로 있다.

## 풀이

1. $r = 0$으로 골라 $a = g^0 = 1$을 보낸다.
2. 서버가 준 $e$에 대해 $z = e w \bmod q$를 보낸다.
3. $g^z = y^e = 1 \cdot y^e$라 검증을 통과한다.

$r = 0$은 실제로는 쓰면 안 된다. $z$에서 바로 $w$가 드러나기 때문이다. 여기서는 이미 $w$를 알아서 상관없다.

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

## 플래그
```text
crypto{sigma_protocol_complete!}
```
