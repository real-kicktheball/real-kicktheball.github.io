---
{"title":"Roll your Own","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"공격자가 이산로그 파라미터를 고를 수 있으면 g=q+1, n=q²처럼 로그가 쉬운 군을 만들 수 있다. 이항정리로 x가 그대로 드러난다.","section":["CryptoHack","Mathematics"]}
---

## 개념

$(1 + q)^x$을 $q^2$로 나누면 이항정리에서 $q^2$ 이상의 항이 모두 사라진다.

$$
(1 + q)^x = 1 + xq + \binom{x}{2}q^2 + \cdots \equiv 1 + xq \pmod{q^2}
$$

즉 $g = 1 + q$, $n = q^2$으로 잡으면 이산로그가 단순한 나눗셈이 된다. Paillier 암호가 쓰는 성질과 같다.

## 문제

서버가 소수 $q$를 주고, 다음 조건을 만족하는 $g$, $n$을 보내라고 한다.

$$
g^q \equiv 1 \pmod n
$$

그다음 서버는 $h = g^x \bmod n$을 공개하고, 비밀 $x$를 맞히면 플래그를 준다.

## 풀이

1. $g = q + 1$, $n = q^2$을 보낸다. 위 식에서 $(1+q)^q \equiv 1 + q \cdot q \equiv 1$이라 검사를 통과한다.
2. 서버가 준 $h \equiv 1 + xq \pmod{q^2}$에서 $x = (h - 1)/q$를 계산한다.
3. $x$를 보내면 플래그를 받는다.

파라미터를 상대방이 고르게 두면 안 된다는 걸 보여주는 문제다.

## 풀이 코드
```python
import json, socket
with socket.create_connection(('socket.cryptohack.org',13403),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    q=int(json.loads(io.readline().decode().split('Prime generated: ')[1]),16)
    g,n=q+1,q*q
    assert pow(g,q,n)==1
    io.write(json.dumps({'g':hex(g),'n':hex(n)}).encode()+b'\n')
    h=int(json.loads(io.readline().decode().split('Generated my public key: ')[1]),16)
    secret=(h-1)//q
    assert 0<=secret<q and pow(g,secret,n)==h
    io.write(json.dumps({'x':hex(secret)}).encode()+b'\n')
    print(json.loads(io.readline().decode().split('What is my private key: ')[1])['flag'])
```

## 플래그
`crypto{Grabbing_Flags_with_Pascal_Paillier}`
