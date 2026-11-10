---
{"title":"Export-grade","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Diffie-Hellman","Cryptography"],"summary":"협상 단계에서 지원 알고리즘 목록을 조작해 64비트 DH로 낮추면 이산로그를 바로 풀 수 있다(Logjam).","section":["CryptoHack","Diffie-Hellman"]}
---

## 개념

1990년대 미국은 **강한 암호를 외국에 수출하지 못하게** 했다. 그래서 수출용 소프트웨어에는 일부러 약하게 만든 암호(export-grade)를 넣었다. 문제는 이 약한 암호가 없어지지 않고 남아 있었다는 것이다.

### 다운그레이드 공격 비유

가게에서 "현금, 카드, 상품권 다 받아요"라고 했는데, 중간에서 누가 메뉴판을 "상품권만 받아요"로 바꿔놓는다. 손님은 어쩔 수 없이 가장 약한 방법을 쓰게 된다.

암호 협상도 똑같다.

1. Alice: "나는 DH1536, DH1024, …, DH64 다 돼"
2. Mallory가 중간에서 바꾼다: "나는 **DH64**만 돼"
3. Bob은 64비트짜리 약한 DH를 고른다.

### 64비트면 왜 약할까?

$g^a \bmod p$에서 $a$를 찾는 건 숫자가 크면 어렵다. 하지만 64비트는 컴퓨터가 몇 초면 찾는다. 실제로 2015년 **Logjam** 공격이 HTTPS 연결을 이렇게 약한 DH로 떨어뜨렸다.

### 정리

TLS 같은 프로토콜은 먼저 서로 지원하는 알고리즘을 **협상**한다. 이 목록을 중간자가 조작해서 약한 알고리즘을 쓰게 만드는 것이 **다운그레이드 공격**이다.

90년대 미국 수출 규제 때문에 512비트 이하의 "export-grade" DH가 있었다. 2015년 **Logjam** 공격은 이걸 이용해 실제 TLS 연결을 512비트 DH로 낮추고 이산로그를 풀었다.

이산로그는 $p$가 작으면 쉽다.

- Pohlig–Hellman: $p - 1$의 소인수가 작을 때
- baby-step giant-step / Pollard rho: 위수가 작을 때 $O(\sqrt{n})$

64비트 정도는 몇 초면 풀린다.

## 문제

Alice는 `DH1536`부터 `DH64`까지 지원한다고 보내고 Bob이 그중 하나를 고른다. 이 협상 메시지를 가로챌 수 있다.

## 풀이

1. Alice의 지원 목록을 `["DH64"]` 하나로 바꿔서 Bob에게 보낸다.
2. 64비트 $p$로 키 교환이 이뤄진다.
3. SymPy `discrete_log`로 $A = g^a$에서 $a$를 구한다.
4. $B^a$로 공유 비밀을 만들고 플래그를 복호화한다.

## 풀이 코드
```python
import hashlib, json, re, socket
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

def parse(line,marker):
    return json.loads(line.decode().split(marker,1)[1])
def decrypt(shared,record):
    key=hashlib.sha1(str(shared).encode()).digest()[:16]
    ct=bytes.fromhex(record.get('encrypted_flag',record.get('encrypted')))
    iv=bytes.fromhex(record['iv'])
    pt=AES.new(key,AES.MODE_CBC,iv).decrypt(ct)
    match=re.search(rb'crypto\{[^}]+\}',pt)
    assert match
    return match.group().decode()

from sympy.ntheory import discrete_log
with socket.create_connection(('socket.cryptohack.org',13379),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    parse(io.readline(),'Intercepted from Alice: ')
    io.write(json.dumps({'supported':['DH64']}).encode()+b'\n')
    choice=parse(io.readline(),'Intercepted from Bob: ')
    assert choice['chosen']=='DH64'
    io.write(json.dumps(choice).encode()+b'\n')
    alice=parse(io.readline(),'Intercepted from Alice: ')
    bob=parse(io.readline(),'Intercepted from Bob: ')
    ciphertext=parse(io.readline(),'Intercepted from Alice: ')
    p,g,A,B=(int(alice['p'],16),int(alice['g'],16),int(alice['A'],16),int(bob['B'],16))
    a=int(discrete_log(p,A,g))
    assert pow(g,a,p)==A
    print(decrypt(pow(B,a,p),ciphertext))
```

## 플래그
`crypto{d0wn6r4d35_4r3_d4n63r0u5}`
