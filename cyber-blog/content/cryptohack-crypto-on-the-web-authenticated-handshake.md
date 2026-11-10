---
{"title":"Authenticated Handshake","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 1.3의 Client Finished 검증값은 HMAC(finished_key, SHA384(transcript))이다. 첨부 키로그에서 서버와 클라이언트 Handshake Traffic Secret을 읽고, 서버 기록을 AES-25…","section":["CryptoHack","Crypto on the Web"]}
---

- 원문: https://cryptohack.org/challenges/web/#authenticated-handshake
- 검증: 공식 제공 PCAP과 키 자료에서 아래 값 확인

## 풀이 원리

TLS 1.3의 Client Finished 검증값은 `HMAC(finished_key, SHA384(transcript))`이다. 첨부 키로그에서 서버와 클라이언트 Handshake Traffic Secret을 읽고, 서버 기록을 AES-256-GCM으로 복호화하여 전체 핸드셰이크 메시지를 모은다. 서버 Finished HMAC부터 대조해 파싱과 키 유도를 검증한 뒤 클라이언트 Finished 값을 계산한다.

## 최종 풀이 코드

Python 3, requests, scapy, pycryptodome가 필요하다.

```python
import requests, tempfile
from pathlib import Path
with tempfile.TemporaryDirectory() as work:
 pcap=Path(work)/'no-finished.pcapng'
 keylog=Path(work)/'keylog.txt'
 pcap.write_bytes(requests.get('https://cryptohack.org/static/challenges/no-finished-tls3_642a73844a64e902ef6c8564972e98ca.cryptohack.org.pcapng',timeout=20).content)
 keylog.write_bytes(requests.get('https://cryptohack.org/static/challenges/keylogfile_8f26cf82ed35e28b7c8151bbb764f267.txt',timeout=20).content)
 import hashlib,hmac,struct
 from math import ceil
 from scapy.all import rdpcap,TCP,IP
 from Crypto.Cipher import AES
 K=str(keylog)
 P=str(pcap)
 secrets={}
 for line in open(K):
  typ,clientrandom,value=line.split();secrets[typ]=bytes.fromhex(value)
 def expand(prk,info,length):
  out=b'';t=b''
  for i in range(1,ceil(length/48)+1):
   t=hmac.new(prk,t+info+bytes([i]),hashlib.sha384).digest();out+=t
  return out[:length]
 def label(secret,label,length):
  info=struct.pack('>H',length)+bytes([len(b'tls13 '+label)])+b'tls13 '+label+b'\x00'
  return expand(secret,info,length)
 pkts=rdpcap(P)
 def payload(n):
  pkt=pkts[n-1];tcp=pkt[TCP];l=pkt[IP].len-pkt[IP].ihl*4-tcp.dataofs*4
  return bytes(tcp.payload)[:l]
 def records(x):
  out=[]
  while x:
   h=x[:5];ln=int.from_bytes(h[3:5],'big');assert len(x)>=ln+5
   out.append((h,x[5:5+ln]));x=x[5+ln:]
  return out
 client_hello=records(payload(8))[0][1]
 rr=records(payload(10))
 server_hello=rr[0][1]
 assert rr[1][0][0]==20
 server=secrets['SERVER_HANDSHAKE_TRAFFIC_SECRET'];key=label(server,b'key',32);iv=label(server,b'iv',12)
 messages=[client_hello,server_hello]
 for i,(header,body) in enumerate(rr[2:]):
  assert header[0]==23
  nonce=bytes(a^b for a,b in zip(iv,i.to_bytes(12,'big')))
  c=AES.new(key,AES.MODE_GCM,nonce=nonce);c.update(header)
  plain=c.decrypt_and_verify(body[:-16],body[-16:])
  plain=plain.rstrip(b'\x00');assert plain[-1]==22
  msg=plain[:-1];print(i,'msg',msg[0],len(msg),int.from_bytes(msg[1:4],'big')+4)
  messages.append(msg)
 assert [m[0] for m in messages]==[1,2,8,11,15,20]
 server_finished_key=label(server,b'finished',48)
 server_check=hmac.new(server_finished_key,hashlib.sha384(b''.join(messages[:-1])).digest(),hashlib.sha384).digest()
 assert server_check==messages[-1][4:]
 client=secrets['CLIENT_HANDSHAKE_TRAFFIC_SECRET']
 client_finished_key=label(client,b'finished',48)
 finished=hmac.new(client_finished_key,hashlib.sha384(b''.join(messages)).digest(),hashlib.sha384).digest()
 print(finished.hex())

```

## 검증 방법

코드를 실행해 아래 출력의 핵심 값과 비교한다. 문제 페이지에 동일한 값을 제출하면 채점 결과를 확인할 수 있다.

```text
b51d7b5fb12aa3d692140d8f1f80732610e99411ca0f6d928b0f60570cbc778e672457a729d7cf3b58bc174f00dc5d30
```

## 최종 답

`b51d7b5fb12aa3d692140d8f1f80732610e99411ca0f6d928b0f60570cbc778e672457a729d7cf3b58bc174f00dc5d30`
