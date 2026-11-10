---
{"title":"Decrypting TLS 1.3","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 1.3은 항상 (EC)DHE를 써서 서버 개인키로는 복호화할 수 없다. SSLKEYLOGFILE로 세션 비밀을 받아야 한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 개념

TLS 1.3은 키 교환을 **항상 임시 (EC)DHE**로 한다. 세션 키는 매번 버리는 임시 비밀에서 나온다. 그래서 서버 개인키를 가져도 과거 트래픽을 복호화할 수 없다(전방 보안).

디버깅할 때는 브라우저나 curl이 환경변수 `SSLKEYLOGFILE`로 세션 비밀을 파일에 남기게 할 수 있다(NSS keylog 형식).

```
CLIENT_HANDSHAKE_TRAFFIC_SECRET <client_random> <secret>
SERVER_TRAFFIC_SECRET_0 <client_random> <secret>
...
```

## 문제

TLS 1.3 캡처와 그 세션의 keylog 파일이 주어진다.

## 풀이

tshark에 `-o tls.keylog_file:keylog.txt`를 주고 `http2.data.data` 필드를 뽑는다. 그러면 복호화된 HTTP/2 데이터에서 플래그가 나온다.

## 풀이 코드
```python
import requests, subprocess, tempfile, re
from pathlib import Path
with tempfile.TemporaryDirectory() as work:
    pcap=Path(work)/'tls3.pcapng'
    keylog=Path(work)/'keylog.txt'
    pcap.write_bytes(requests.get('https://cryptohack.org/static/challenges/tls3_871583423e02a66acd81eb34ed967489.cryptohack.org.pcapng',timeout=20).content)
    keylog.write_bytes(requests.get('https://cryptohack.org/static/challenges/keylogfile_c86a7e105b820e0780e903b0d8388fa3.txt',timeout=20).content)
    output=subprocess.check_output(['tshark','-r',str(pcap),'-o','tls.keylog_file:'+str(keylog),'-Y','http2.data.data','-T','fields','-e','http2.data.data'],stderr=subprocess.DEVNULL,text=True)
    plaintext=b''.join(bytes.fromhex(x.strip()) for x in output.splitlines() if x.strip())
    print(re.search(rb'crypto\{[^}]+\}',plaintext).group(0).decode())
```

## 정답
`crypto{export_SSLKEYLOGFILE}`
