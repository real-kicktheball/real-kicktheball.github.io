---
{"title":"Decrypting TLS 1.2","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 1.2 캡처는 정적 RSA 키 교환을 사용한다. ClientKeyExchange의 암호화된 premaster secret을 첨부 RSA 개인키로 복호화한다. 양쪽 Hello에서 Extended Master Secret 확장이 협상되므…","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

TLS 1.2 캡처는 정적 RSA 키 교환을 사용한다. `ClientKeyExchange`의 암호화된 premaster secret을 첨부 RSA 개인키로 복호화한다. 양쪽 Hello에서 Extended Master Secret 확장이 협상되므로 `PRF(premaster, "extended master secret", SHA384(핸드셰이크 메시지))`로 master secret을 구한다. 이를 NSS keylog 형식으로 저장하고 tshark로 HTTP/2 데이터를 복호화한다.

## 최종 풀이 코드

Python 3, requests, scapy, pycryptodome, tshark가 필요하다.

```python
import requests, tempfile, subprocess, re
from pathlib import Path
with tempfile.TemporaryDirectory() as work:
 pcap=Path(work)/'tls2.pcapng'
 keyfile=Path(work)/'privkey.pem'
 keylog=Path(work)/'tls2.keylog'
 pcap.write_bytes(requests.get('https://cryptohack.org/static/challenges/tls2_f84f9216f7bd77b7a1337889393296e1.cryptohack.org.pcapng',timeout=20).content)
 keyfile.write_bytes(requests.get('https://cryptohack.org/static/challenges/privkey_aa0c8200134016bdbbb9e521b6e5f3e4.pem',timeout=20).content)
 import hmac,hashlib
 from scapy.all import rdpcap,TCP,IP
 from Crypto.PublicKey import RSA
 from Crypto.Cipher import PKCS1_v1_5
 p=str(pcap)
 packets=rdpcap(p)
 streams={'c':bytearray(),'s':bytearray()}
 nextseq={'c':None,'s':None}
 handshakes=[]
 for num,pkt in enumerate(packets,1):
  if TCP not in pkt:continue
  tcp=pkt[TCP];d='c' if tcp.dport==443 else 's' if tcp.sport==443 else None
  if not d:continue
  length=pkt[IP].len-pkt[IP].ihl*4-tcp.dataofs*4
  data=bytes(tcp.payload)[:length]
  if not data:continue
  seq=int(tcp.seq)
  if nextseq[d] is None:nextseq[d]=seq
  if seq < nextseq[d]:data=data[nextseq[d]-seq:];seq=nextseq[d]
  if seq != nextseq[d]:print('GAP',num,d,seq,nextseq[d]);break
  nextseq[d]+=len(data);streams[d]+=data
  while len(streams[d])>=5:
   typ=streams[d][0];ln=int.from_bytes(streams[d][3:5],'big')
   if len(streams[d])<5+ln:break
   body=bytes(streams[d][5:5+ln]);del streams[d][:5+ln]
   if typ==22 and (not handshakes or handshakes[-1][0]!=16):
    pos=0
    while pos<len(body):
     ht=body[pos];hl=int.from_bytes(body[pos+1:pos+4],'big');msg=body[pos:pos+4+hl]
     if len(msg)<4+hl:print('PARTIAL',num,d,ht,len(msg),hl);break
     handshakes.append((ht,msg));pos+=4+hl
 for typ,msg in handshakes:assert len(msg)==4+int.from_bytes(msg[1:4],'big')
 assert [t for t,_ in handshakes]==[1,2,11,14,16]
 cr=handshakes[0][1][6:38];sr=handshakes[1][1][6:38]
 epms=handshakes[-1][1][6:]
 key=RSA.import_key(open(keyfile,'rb').read())
 premaster=PKCS1_v1_5.new(key).decrypt(epms,None);assert len(premaster)==48
 seed=b'extended master secret'+hashlib.sha384(b''.join(m for _,m in handshakes)).digest()
 A=hmac.new(premaster,seed,hashlib.sha384).digest();out=b''
 while len(out)<48:
  out+=hmac.new(premaster,A+seed,hashlib.sha384).digest()
  A=hmac.new(premaster,A,hashlib.sha384).digest()
 master=out[:48]
 open(keylog,'w').write('CLIENT_RANDOM '+cr.hex()+' '+master.hex()+'\n')
 
 output=subprocess.check_output(['tshark','-r',str(pcap),'-o','tls.keylog_file:'+str(keylog),'-Y','http2.data.data','-T','fields','-e','http2.data.data'],stderr=subprocess.DEVNULL,text=True)
 plaintext=b''.join(bytes.fromhex(x.strip()) for x in output.splitlines() if x.strip())
 print(re.search(rb'crypto\{[^}]+\}',plaintext).group(0).decode())
```

## 검증 방법

코드를 실행해 아래 출력의 핵심 값과 비교한다. 문제 페이지에 동일한 값을 제출하면 채점 결과를 확인할 수 있다.

```text
crypto{weaknesses_of_non_ephemeral_key_exchange}
```

## 최종 답

`crypto{weaknesses_of_non_ephemeral_key_exchange}`
