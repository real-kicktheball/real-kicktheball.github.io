---
{"title":"Roll your Own","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"매개변수를 직접 고를 수 있다. n=q², g=q+1을 주면 이항정리에 따라 (1+q)^q ≡ 1 (mod q²)라서 검사를 통과한다. 공개값은 h=(1+q)^x ≡ 1+xq (mod q²)이므로 x=(h−1)/q가 그대로 드러난다.","section":["CryptoHack","Mathematics"]}
---

## 풀이 원리

매개변수를 직접 고를 수 있다. `n=q²`, `g=q+1`을 주면 이항정리에 따라 `(1+q)^q ≡ 1 (mod q²)`라서 검사를 통과한다. 공개값은 `h=(1+q)^x ≡ 1+xq (mod q²)`이므로 `x=(h−1)/q`가 그대로 드러난다.

## 최종 익스플로잇

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

## 검증

CryptoHack 계정에 답을 제출하고 성공을 확인했다.

선택한 매개변수가 서버 조건을 만족하는지, 복원한 비밀값으로 공개값이 다시 만들어지는지 검사했다. 서버가 플래그를 반환했다.

```text
crypto{Grabbing_Flags_with_Pascal_Paillier}
```

## 최종 플래그

`crypto{Grabbing_Flags_with_Pascal_Paillier}`
