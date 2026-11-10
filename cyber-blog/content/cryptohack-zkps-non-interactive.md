---
{"title":"Non-Interactive","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"Fiat–Shamir 변환은 검증자의 랜덤 챌린지를 해시값으로 대체해 대화 없는 증명(NIZK)을 만든다.","section":["CryptoHack","ZKPs"]}
---

## 개념

Schnorr 증명은 검증자가 질문을 해야 한다. 그런데 **질문 없이 혼자 증명서를 만들 수는 없을까?** 이걸 해결한 게 **Fiat–Shamir 변환**이다.

### 아이디어: 해시가 질문을 대신한다

검증자 대신 **해시 함수**가 질문을 만든다.

$$
e = \text{Hash}(a)
$$

해시는 예측할 수 없다. 그래서 증명자가 약속 $a$를 보내기 전에 질문 $e$를 미리 알 수 없다. 앞 문제처럼 순서를 거꾸로 하는 위조가 안 된다.

### 비유

선생님이 직접 문제를 내는 대신, 학생이 답안지 첫 줄을 쓴 다음 **주사위를 굴려서** 문제를 정한다. 첫 줄을 쓰기 전에는 어떤 문제가 나올지 모르니까 미리 답을 맞춰둘 수 없다.

### 결과

$(a, z)$ 두 숫자만 보내면 누구나 $e = \text{Hash}(a)$를 다시 계산해서 확인할 수 있다. 이걸 **비대화형 영지식 증명(NIZK)**이라 한다. 디지털 서명(Schnorr 서명, EdDSA)이 바로 이 방식으로 만들어진다.

### 정리

시그마 프로토콜은 검증자와 주고받아야 한다. **Fiat–Shamir 변환**은 챌린지를 커밋의 해시로 바꿔서 이 과정을 없앤다.

$$
e = H(a)
$$

증명자는 $(a, z)$만 보내면 되고, 누구나 $e$를 다시 계산해서 검증할 수 있다. 이것이 **비대화형 영지식 증명(NIZK)**이다. Schnorr 서명, EdDSA가 이 방식으로 만들어진다.

해시에는 공개 정보(문맥)도 함께 넣어야 한다. 그렇지 않으면 증명을 다른 상황에 재사용하는 공격이 가능하다.

## 문제

서버가 Fiat–Shamir 방식 Schnorr 증명 $(a, z)$를 요구한다. 챌린지는 $e = \text{SHA512}(a) \bmod 2^{511}$이다. 첨부 소스에 $w$가 있다.

## 풀이

1. 랜덤 $r$로 $a = g^r$을 만든다.
2. $e = H(a) \bmod 2^{511}$을 직접 계산한다.
3. $z = r + e w \bmod q$를 계산해서 $(a, z)$를 보낸다.

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

## 플래그
```text
crypto{shvzk_and_ss_to_nizk}
```
