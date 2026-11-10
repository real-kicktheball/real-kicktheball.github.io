---
{"title":"Encoding Challenge","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"서버가 보내는 base64/hex/rot13/bigint/utf-8 인코딩을 100번 연속 자동으로 풀어야 한다.","section":["CryptoHack","General"]}
---

## 개념

앞에서 다룬 인코딩을 한꺼번에 정리하면 다음과 같다.

| type | 형태 | 디코딩 |
|---|---|---|
| base64 | `Y3J5cHRv` | `base64.b64decode()` |
| hex | `63727970746f` | `bytes.fromhex()` |
| rot13 | `pelcgb` | 알파벳을 13칸씩 회전 |
| bigint | `0x63727970746f` | 정수 → 바이트 |
| utf-8 | `[99, 114, ...]` | `chr()` 적용 |

**ROT13**은 알파벳을 13칸 미는 치환이다. 26의 절반이라 두 번 적용하면 원래대로 돌아온다.

## 문제

`socket.cryptohack.org:13377`에 접속하면 서버가 `{"type": ..., "encoded": ...}`를 보낸다. 100단계를 연속으로 맞히면 플래그를 준다.

## 풀이

손으로 풀 수 없으니 자동화해야 한다.

1. 서버가 보낸 JSON 한 줄을 읽는다.
2. `type`에 맞는 디코딩을 해서 `{"decoded": ...}`로 회신한다.
3. 100번 반복하면 마지막 응답에 `flag`가 들어 있다.

## 풀이 코드
```python
import socket,json,base64,codecs
with socket.create_connection(('socket.cryptohack.org',13377),timeout=15) as s:
 f=s.makefile('rwb',buffering=0)
 for n in range(101):
  line=f.readline()
  if not line:raise RuntimeError(f'closed at {n}')
  obj=json.loads(line)
  if 'flag' in obj:
   print(obj['flag']);break
  if 'error' in obj:raise RuntimeError(obj)
  typ=obj['type'];v=obj['encoded']
  if typ=='base64':ans=base64.b64decode(v).decode()
  elif typ=='hex':ans=bytes.fromhex(v).decode()
  elif typ=='rot13':ans=codecs.decode(v,'rot_13')
  elif typ=='bigint':ans=bytes.fromhex(v[2:]).decode()
  elif typ=='utf-8':ans=''.join(map(chr,v))
  else:raise RuntimeError(obj)
  f.write((json.dumps({'decoded':ans})+'\n').encode())
```

## 플래그
```text
crypto{3nc0d3_d3c0d3_3nc0d3}
```
