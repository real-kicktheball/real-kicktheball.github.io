---
{"title":"Blinding Light","date":"2026-11-10","category":"ctf","tags":["CryptoHack","RSA","Cryptography"],"summary":"RSA는 곱셈에 대해 준동형이다. 금지된 메시지에 r^e를 곱해 서명받은 뒤 r을 나눠내면 원래 메시지의 서명이 된다.","section":["CryptoHack","RSA"]}
---

## 개념

RSA에는 **곱셈이 그대로 통과하는** 성질이 있다.

$$
(a \times b)^d = a^d \times b^d
$$

서버가 "admin=True"라는 메시지에는 서명을 안 해준다고 하자. 그러면 메시지를 **변장**시켜서 보내면 된다.

1. 랜덤 수 $r$을 고르고, 메시지에 $r^e$를 곱해서 변장시킨다: $m' = m \times r^e$
2. 서버는 이상한 숫자라서 의심 없이 서명해준다: $(m \times r^e)^d = m^d \times r$
3. 받은 서명을 $r$로 나누면 변장이 벗겨진다: $m^d$

$m^d$가 바로 "admin=True"의 진짜 서명이다.

### 직접 해보기 (작은 RSA: $N = 33$, $e = 3$, $d = 7$)

$m = 2$의 서명을 직접 요청하지 않고 얻어보자. $r = 5$로 한다.

1. $m' = 2 \times 5^3 = 250 \bmod 33 = 19$
2. 서버 서명: $19^7 \bmod 33 = 13$
3. 13을 5로 나눈다(5의 역원은 20, $5 \times 20 = 100 \equiv 1$): $13 \times 20 = 260 \bmod 33 = 29$

29는 앞에서 직접 계산한 $2$의 서명($2^7 \bmod 33 = 29$)과 같다!

### 정리

교과서 RSA는 **곱셈에 대해 준동형**이다.

$$
(m_1 m_2)^d = m_1^d \cdot m_2^d \pmod N
$$

이걸 이용한 **블라인드 서명** 기법이 있다.

1. 메시지 $m$에 랜덤 $r^e$를 곱한다: $m' = m \cdot r^e$
2. $m'$에 서명을 받는다: $S' = (m r^e)^d = m^d \cdot r$
3. $r$로 나누면 $m$의 서명이 된다: $S = S' \cdot r^{-1} = m^d$

## 문제

서버는 `admin=True`가 들어간 메시지는 서명을 거부한다. 하지만 `admin=True`에 대한 유효한 서명을 보내면 플래그를 준다.

## 풀이

1. $m$ = `admin=True`를 정수로 바꾸고, 랜덤 $r$로 $m' = m r^e \bmod N$을 만든다.
2. $m'$을 바이트로 바꿨을 때 `admin=True`가 안 보이면 서명을 요청한다.
3. 받은 서명에 $r^{-1}$을 곱해서 `admin=True`의 서명을 만든다.
4. `verify`에 보내면 플래그가 나온다.

## 풀이 코드
```python
import json, math, secrets, socket
with socket.create_connection(('socket.cryptohack.org',13376),timeout=10) as sock:
    io=sock.makefile('rwb',buffering=0)
    io.readline()
    def ask(payload):
        io.write(json.dumps(payload).encode()+b'\n')
        return json.loads(io.readline())
    pub=ask({'option':'get_pubkey'})
    N,e=int(pub['N'],16),int(pub['e'],16)
    admin=b'admin=True'
    m=int.from_bytes(admin,'big')
    while True:
        r=secrets.randbelow(N-2)+2
        if math.gcd(r,N)!=1: continue
        blinded=m*pow(r,e,N)%N
        request=blinded.to_bytes((blinded.bit_length()+7)//8,'big')
        if admin not in request: break
    signed=int(ask({'option':'sign','msg':request.hex()})['signature'],16)
    signature=signed*pow(r,-1,N)%N
    assert pow(signature,e,N)==m
    print(ask({'option':'verify','msg':admin.hex(),'signature':hex(signature)})['response'])
```

## 플래그
`crypto{m4ll34b1l17y_c4n_b3_d4n63r0u5}`
