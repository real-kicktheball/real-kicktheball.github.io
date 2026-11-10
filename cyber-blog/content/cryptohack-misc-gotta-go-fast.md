---
{"title":"Gotta Go Fast","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"키를 현재 시각에서 만들면 시간 범위만 알면 키 공간이 수십 개로 줄어든다.","section":["CryptoHack","Misc"]}
---

## 개념

암호 열쇠는 **아무도 예측할 수 없는 값**으로 만들어야 한다. 그런데 이 문제는 열쇠를 **현재 시각**으로 만들었다.

$$
\text{열쇠} = \text{SHA256}(\text{현재 시각(초)})
$$

해시를 거치면 복잡해 보이지만, 원래 재료가 예측 가능하면 결과도 예측 가능하다.

### 비유

자물쇠 비밀번호를 "지금 몇 시 몇 분"으로 정한다면? 언제 잠갔는지 대충만 알아도 몇 개만 시도하면 열린다.

### 직접 해보기

내가 오후 3시 0분 10초쯤 요청했다면 열쇠는 그 근처 시각 중 하나다. 앞뒤 30초면 **61개**만 시도하면 된다.

| 시도 | 시각 | 결과 |
|---|---|---|
| 1 | 3:00:05 | 이상한 글자 |
| 2 | 3:00:06 | 이상한 글자 |
| … | … | … |
| 8 | 3:00:12 | `crypto{...}` ✔ |

### 올바른 방법

열쇠는 `secrets`, `os.urandom`처럼 **암호용 난수 생성기**로 만들어야 한다. 이건 컴퓨터 내부의 예측 불가능한 잡음을 모아서 숫자를 만든다.

### 정리

암호 키는 **예측 불가능한** 값에서 만들어야 한다. 현재 시각(Unix timestamp)은 공격자도 대략 알고 있는 값이다. 그래서 해시를 거쳐도 엔트로피가 늘지 않는다.

$$
K = \text{SHA256}(\text{timestamp})
$$

요청 시각 앞뒤 몇십 초만 시도하면 키를 찾는다. 키는 `secrets`, `os.urandom` 같은 암호학적 난수 생성기에서 뽑아야 한다.

## 문제

서버가 플래그를 OTP로 암호화해주는데, 키가 암호화 시점의 Unix 초를 SHA-256한 값이다.

## 풀이

1. 요청 직전과 직후의 시각을 기록한다.
2. 그 주변 ±30초를 모두 시도한다.
3. 복호화 결과가 `crypto{`로 시작하고 `}`로 끝나는 시각이 맞는 키다.

## 풀이 코드
```python
import socket, json, time, hashlib

with socket.create_connection(("socket.cryptohack.org",13372),timeout=10) as sock:
    stream=sock.makefile('rwb')
    stream.readline()
    before=int(time.time())
    stream.write(b'{"option":"get_flag"}\n');stream.flush()
    ct=bytes.fromhex(json.loads(stream.readline())['encrypted_flag'])
    after=int(time.time())

for sec in range(before-30,after+31):
    timestamp=sec.to_bytes((sec.bit_length()+7)//8,'big')
    key=hashlib.sha256(timestamp).digest()
    pt=bytes(c^k for c,k in zip(ct,key))
    if pt.startswith(b'crypto{') and pt.endswith(b'}'):
        print(pt.decode())
        break
```

## 플래그
```text
crypto{t00_f4st_t00_furi0u5}
```
