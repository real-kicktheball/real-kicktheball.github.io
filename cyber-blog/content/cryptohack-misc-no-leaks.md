---
{"title":"No Leaks","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Misc","Cryptography"],"summary":"서버는 매번 새 OTP를 쓰지만 ciphertext[i] == flag[i]인 경우 응답을 버린다. XOR 암호문에서 이 조건은 OTP 바이트가 0인 경우다. 따라서 허용된 응답의 각 암호문 바이트는 256개 값 중 플래그 바이트만 제외한 …","section":["CryptoHack","Misc"]}
---

분야: Misc / otp  
문제: https://cryptohack.org/challenges/misc/#noleaks  
소스: https://cryptohack.org/static/challenges/13370_f382761c27b6c87f4222a1c417a00acd.py  
검증: 2026-11-10, 암호문 약 1800개를 병렬 수집해 20/20바이트의 누락값을 확정. CryptoHack 계정 제출 대기

## 풀이 방법

서버는 매번 새 OTP를 쓰지만 `ciphertext[i] == flag[i]`인 경우 응답을 버린다. XOR 암호문에서 이 조건은 OTP 바이트가 0인 경우다. 따라서 허용된 응답의 각 암호문 바이트는 256개 값 중 **플래그 바이트만 제외한** 나머지 255개에 걸쳐 분포한다. 같은 위치의 암호문 바이트를 많이 모아 단 한 번도 나타나지 않은 값이 플래그 바이트임을 확인한다. 12개 연결을 병렬로 사용해 수집 시간을 줄인다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. 실행하면 각 바이트 위치에서 255개 가능한 암호문 값을 모두 확인한 후 플래그를 출력한다.

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

## 검증 방법

각 위치에서 관측한 암호문 값이 정확히 255종류인지 `assert`로 확인한다. 남은 한 값씩 이어 붙인 결과가 아래 플래그인지 확인한다. [공개 참고 풀이](https://github.com/jeonyujin4209/crypto_ctf/tree/main/cryptohack/Misc/One%20Time%20Pad/No%20Leaks)와도 마지막 바이트를 교차 확인했다.

## 최종 플래그

```text
crypto{unr4nd0m_07p}
```
