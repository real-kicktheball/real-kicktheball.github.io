---
{"title":"Encoding Challenge","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"서버가 100번 보내는 JSON 인코딩을 type에 맞춰 해제하고 decoded 값으로 회신한다. 최종 응답에 플래그가 들어 있다.","section":["CryptoHack","General"]}
---

## 풀이 원리

서버가 100번 보내는 JSON 인코딩을 `type`에 맞춰 해제하고 `decoded` 값으로 회신한다. 최종 응답에 플래그가 들어 있다.

## 최종 풀이 코드

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

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{3nc0d3_d3c0d3_3nc0d3}
```
