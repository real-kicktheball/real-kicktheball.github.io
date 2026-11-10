---
{"title":"Authenticated Handshake","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 1.3의 Finished 메시지는 핸드셰이크 전체 기록(transcript)에 대한 HMAC이다. 키 스케줄을 따라 직접 계산한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

TLS 1.3의 **Finished** 메시지는 지금까지 오간 핸드셰이크 메시지 전체가 변조되지 않았음을 증명한다.

$$
\text{finished\_key} = \text{HKDF-Expand-Label}(\text{handshake\_traffic\_secret},\ \texttt{"finished"},\ \texttt{""},\ L)
$$

$$
\text{verify\_data} = \text{HMAC}(\text{finished\_key},\ \text{Hash}(\text{transcript}))
$$

transcript는 ClientHello부터 해당 시점까지의 모든 핸드셰이크 메시지를 이은 것이다. TLS 1.3은 ServerHello 이후 핸드셰이크 메시지(EncryptedExtensions, Certificate, CertificateVerify, Finished)도 암호화한다. 그래서 transcript를 만들려면 먼저 복호화해야 한다.

## 문제

TLS 1.3(cipher suite `TLS_AES_256_GCM_SHA384`) 캡처와 keylog가 주어진다. 클라이언트 Finished의 verify_data를 계산하라는 문제다.

## 풀이

1. keylog에서 클라이언트·서버 handshake traffic secret을 읽는다.
2. 서버 secret으로 key/iv를 유도한다. 그다음 서버의 암호화된 레코드를 AES-256-GCM으로 복호화해서 핸드셰이크 메시지를 모은다.
3. 계산이 맞는지 확인하려고, 먼저 서버 Finished를 같은 방식으로 계산해 캡처의 값과 비교했다.
4. 서버 Finished까지 포함한 transcript의 SHA-384에 클라이언트 finished_key로 HMAC을 계산한다.

## 풀이 코드
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

## 정답
`b51d7b5fb12aa3d692140d8f1f80732610e99411ca0f6d928b0f60570cbc778e672457a729d7cf3b58bc174f00dc5d30`
