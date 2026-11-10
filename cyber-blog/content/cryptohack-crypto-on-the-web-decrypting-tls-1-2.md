---
{"title":"Decrypting TLS 1.2","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"RSA 키 교환을 쓰는 TLS 1.2는 서버 개인키만 있으면 지난 트래픽까지 전부 복호화된다. 전방 보안이 없다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

옛날 TLS(1.2)에는 **RSA로 열쇠를 나누는** 방식이 있었다.

1. 브라우저가 랜덤 비밀값을 만든다.
2. 그 비밀값을 서버의 **RSA 공개키로 잠가서** 보낸다.
3. 서버는 RSA 비밀키로 풀어서 같은 비밀값을 얻는다.
4. 둘 다 이 비밀값으로 대화 열쇠를 만든다.

### 문제점: 미래의 위험

누군가 지금 대화를 **녹음만** 해둔다고 하자. 나중에 서버의 RSA 비밀키가 유출되면 어떻게 될까? 녹음해둔 대화의 비밀값을 풀 수 있고, 과거 대화가 전부 드러난다.

### 비유

모든 편지를 같은 열쇠로 잠근 금고에 넣었다면, 언젠가 열쇠를 잃어버렸을 때 **과거 편지까지** 다 열린다.

그래서 요즘은 매번 새 열쇠를 만드는 방식(ECDHE)을 쓴다. 이 성질을 **전방 보안(forward secrecy)**이라 한다.

### 이 문제에서

녹음된 패킷과 서버 RSA 비밀키가 주어진다. 비밀값을 풀고, 대화 열쇠를 다시 계산해서 녹음을 해독하면 플래그가 나온다.

### 정리

TLS 1.2의 **RSA 키 교환**은 다음 순서로 동작한다.

1. 클라이언트가 premaster secret을 서버 공개키로 암호화해서 보낸다.
2. 양쪽이 PRF로 master secret을 만든다.
3. master secret에서 세션 키를 유도한다.

이 방식은 **전방 보안(forward secrecy)이 없다**. 나중에 서버 개인키가 유출되면, 저장해둔 과거 캡처를 전부 복호화할 수 있다. 그래서 TLS 1.3은 RSA 키 교환을 없애고 (EC)DHE만 쓴다.

master secret 계산은 Extended Master Secret 확장이 있으면 다음과 같다.

$$
\text{ms} = \text{PRF}(\text{premaster},\ \texttt{"extended master secret"},\ \text{Hash}(\text{handshake}))
$$

## 문제

TLS 1.2 캡처 파일과 서버의 RSA 개인키가 주어진다.

## 풀이

1. `ClientKeyExchange`의 암호화된 premaster secret을 개인키(PKCS#1 v1.5)로 복호화한다.
2. Hello에서 EMS가 협상됐으므로 핸드셰이크 메시지들의 SHA-384로 master secret을 구한다.
3. `CLIENT_RANDOM <client_random> <master_secret>` 형식의 keylog로 저장한다.
4. tshark에 keylog를 넣으면 HTTP/2 데이터가 복호화되고 플래그가 보인다.

Wireshark에 RSA 키를 직접 넣어도 되지만, 계산 과정을 이해하려고 master secret을 직접 만들었다.

## 풀이 코드
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

## 정답
`crypto{weaknesses_of_non_ephemeral_key_exchange}`
