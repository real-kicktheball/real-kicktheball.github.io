---
{"title":"Too Many Errors","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"reset을 호출하면 PRNG가 동일 시드로 돌아가므로 기본 벡터 a와 기본 오차 e가 반복된다. 각 표본을 만든 후 별도의 난수 재시드가 한 좌표에만 가끔 오류를 주입한다. 다수결로 기본 (a,b)를 찾고, 한 좌표만 바뀐 표본에서 \\\\D…","section":["CryptoHack","Lattices"]}
---

## 풀이 방법

`reset`을 호출하면 PRNG가 동일 시드로 돌아가므로 기본 벡터 $a$와 기본 오차 $e$가 반복된다. 각 표본을 만든 후 별도의 난수 재시드가 한 좌표에만 가끔 오류를 주입한다. 다수결로 기본 $(a,b)$를 찾고, 한 좌표만 바뀐 표본에서 $\\Delta b/\\Delta a_i\\pmod{127}$를 계산하면 해당 위치의 플래그 바이트가 나온다.

## 최종 익스플로잇

```python
import socket,json,collections,time
q=127
with socket.create_connection(('socket.cryptohack.org',13390),timeout=15) as sock:
 sock.settimeout(15);f=sock.makefile('rwb');f.readline()
 def ask(obj):
  f.write(json.dumps(obj).encode()+b'\n');f.flush()
  return json.loads(f.readline())
 def sample():
  ask({'option':'reset'})
  return ask({'option':'get_sample'})
 rows=[sample() for _ in range(12)]
 mode=collections.Counter(tuple(r['a']) for r in rows).most_common(1)[0][0]
 base=next(r for r in rows if tuple(r['a'])==mode)
 a0,b0=base['a'],base['b']
 recovered={}
 for n in range(1,1001):
  r=sample();diff=[i for i,(x,y) in enumerate(zip(a0,r['a'])) if x!=y]
  if len(diff)==1:
   i=diff[0];delta=(r['a'][i]-a0[i])%q
   byte=((r['b']-b0)*pow(delta,-1,q))%q
   if i in recovered:assert recovered[i]==byte
   recovered[i]=byte
  if len(recovered)==len(a0):break
 flag=bytes(recovered[i] for i in range(len(a0)))
 print(flag.decode())

```

## 최종 플래그

```text
crypto{f4ult_4ttack5_0n_lw3}
```
