---
{"title":"No Leaks","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"\"평문과 같은 암호문 바이트는 버린다\"는 필터가 오히려 정보를 흘린다. 한 번도 나오지 않는 바이트가 평문이다.","section":["CryptoHack","Misc"]}
---

## 개념

**OTP(일회용 패드)**는 메시지와 길이가 같은 **완전히 랜덤한 열쇠**로 XOR하는 암호다. 열쇠를 한 번만 쓰면 **이론적으로 절대 깨지지 않는다**. 암호문의 각 바이트가 0~255에 골고루 나오기 때문이다.

### 이 문제의 "안전장치"

서버는 "평문 글자가 그대로 보이면 안 되지!"라며, 암호문 글자가 평문 글자와 **같으면 그 결과를 버리고** 다시 만든다.

### 그런데 오히려 정보가 새어 나간다

평문 글자가 `c`라면 암호문에는 `c`를 **제외한 255가지**만 나온다. 그래서 암호문을 많이 모으면 이렇게 된다.

> 한 번도 안 나온 글자가 바로 평문 글자다!

### 직접 해보기 (글자가 A, B, C, D 4종류뿐이라면)

평문이 `B`일 때 모은 암호문: `A, D, C, A, C, D, A, C, D …`

`B`만 한 번도 안 나온다. 그래서 평문은 `B`다.

### 실제 역사

2차 세계대전 독일의 **에니그마** 암호기는 "글자가 자기 자신으로는 암호화되지 않는다"는 특징이 있었다. 연합군은 바로 이 특징을 이용해서 에니그마를 깼다.

### 정리

**OTP**는 키가 완전히 랜덤이면 암호문의 각 바이트가 $0 \sim 255$에 균등하게 분포한다. 그래서 정보가 전혀 새지 않는다.

그런데 서버가 "평문 바이트가 그대로 노출되면 안 된다"며 $c_i = m_i$인 경우를 걸러낸다고 하자. 이건 키 바이트가 0인 경우($c_i = m_i \oplus 0$)를 빼는 것이다. 그 결과 암호문 바이트는 **$m_i$를 제외한 255개 값**에만 나온다. 결국 "절대 나오지 않는 값"이 평문을 알려준다.

보안을 위해 추가한 검사가 분포를 비틀어 오히려 정보를 흘린 사례다. 에니그마도 "글자가 자기 자신으로 암호화되지 않는다"는 성질 때문에 깨졌다.

## 문제

서버가 매번 새 랜덤 키로 플래그를 XOR해서 준다. 단 어떤 위치든 $c_i = m_i$이면 그 응답을 버리고 다시 만든다.

## 풀이

1. 응답을 아주 많이 모은다. 시간을 줄이려고 12개 연결을 병렬로 썼다.
2. 위치마다 등장한 바이트 집합을 기록한다.
3. 255개가 다 나와서 하나만 남으면, 그 빠진 값이 플래그 바이트다.

## 풀이 코드
```python
import base64,json,socket,threading,time
seen=[set() for _ in range(20)]
lock=threading.Lock()
done=threading.Event()
count=0

def worker():
 global count
 try:
  with socket.create_connection(('socket.cryptohack.org',13370),timeout=10) as sock:
   sock.settimeout(10)
   stream=sock.makefile('rwb')
   stream.readline()
   while not done.is_set():
    stream.write(b'{"msg":"request"}\n');stream.flush()
    row=json.loads(stream.readline())
    if 'ciphertext' not in row:continue
    ct=base64.b64decode(row['ciphertext'])
    with lock:
     count+=1
     for i,c in enumerate(ct):seen[i].add(c)
     if all(len(x)==255 for x in seen):done.set()
 except Exception as exc:print('worker error',repr(exc),flush=True)

threads=[threading.Thread(target=worker,daemon=True) for _ in range(12)]
for t in threads:t.start()
start=time.monotonic()
while not done.wait(10):
 with lock:print('samples',count,'remaining_max',max(256-len(x) for x in seen),flush=True)
 if time.monotonic()-start>300:break
done.set()
for t in threads:t.join(timeout=3)
missing=[set(range(256))-x for x in seen]
assert all(len(x)==1 for x in missing),[len(x) for x in missing]
flag=bytes(next(iter(x)) for x in missing)
print('FLAG',flag.decode(),flush=True)

```

## 플래그
```text
crypto{unr4nd0m_07p}
```
