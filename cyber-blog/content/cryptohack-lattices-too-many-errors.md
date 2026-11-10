---
{"title":"Too Many Errors","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Lattices","Cryptography"],"summary":"LWE 오라클에 오류 주입(fault)이 섞이면 한 좌표만 바뀐 표본 쌍에서 비밀값을 바로 계산할 수 있다.","section":["CryptoHack","Lattices"]}
---

## 개념

**결함 주입 공격**은 계산 중에 **일부러 오류를 일으켜서** 비밀을 알아내는 방법이다. 예를 들어 전압을 순간적으로 흔들면 칩이 계산을 틀린다.

### 핵심: 한 곳만 다른 두 결과를 비교하기

LWE 표본은 이렇게 만든다.

$$
b = a_1 s_1 + a_2 s_2 + \cdots + a_n s_n + e
$$

$s_i$가 비밀이다. 그런데 **$a_i$ 하나만 바뀐** 두 표본이 있다면 차이를 계산할 수 있다.

$$
b' - b = (a'_i - a_i) \times s_i
$$

다른 항은 다 같아서 사라지고, 오차 $e$도 같아서 사라진다.

### 직접 해보기

- 원래: $a = (2, 5, 3)$, 비밀 $s = (4, 1, 6)$, 오차 $e = 1$
  - $b = 8 + 5 + 18 + 1 = 32$
- 두 번째 칸만 바뀜: $a' = (2, 9, 3)$
  - $b' = 8 + 9 + 18 + 1 = 36$
- $s_2 = (36 - 32) \div (9 - 5) = 4 \div 4 = 1$ ✔

### 이 문제에서

서버를 리셋하면 같은 $a$와 같은 오차가 다시 나온다. 그런데 가끔 한 칸이 랜덤으로 바뀐다(결함). 한 칸만 바뀐 표본을 모아서 위 방법으로 비밀(플래그)을 한 글자씩 계산한다.

### 정리

**결함 주입 공격(fault attack)**은 계산 중에 오류를 일으켜서 나온 잘못된 출력과 정상 출력을 비교하는 공격이다.

LWE 표본 $b = \langle a, S \rangle + e \pmod q$에서 같은 $e$를 쓰고 $a$의 $i$번째 좌표만 바뀐 표본 두 개를 얻었다고 하자. 그러면 차이에서 다른 항이 모두 사라진다.

$$
b' - b = (a'_i - a_i) \cdot S_i \pmod q
\quad\Rightarrow\quad
S_i = \frac{b' - b}{a'_i - a_i} \bmod q
$$

## 문제

서버의 비밀 $S$는 플래그 바이트들이다($q = 127$). `reset`하면 PRNG가 같은 시드로 돌아가서 같은 $(a, e)$가 나온다. 그런데 표본을 만들 때 가끔 한 좌표가 랜덤으로 바뀐다.

## 풀이

1. `reset` 후 표본을 여러 번 받아 가장 많이 나온 $a$를 정상 표본 $(a_0, b_0)$로 정한다.
2. 계속 표본을 받으면서 $a$가 정확히 한 좌표만 다른 것을 찾는다.
3. 그 좌표 $i$에서 $S_i = \Delta b / \Delta a_i \bmod 127$을 계산한다.
4. 모든 좌표를 채우면 플래그가 된다.

## 풀이 코드
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

## 플래그
```text
crypto{f4ult_4ttack5_0n_lw3}
```
