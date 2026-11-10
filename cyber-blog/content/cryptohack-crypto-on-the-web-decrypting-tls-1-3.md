---
{"title":"Decrypting TLS 1.3","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Crypto on the Web","Cryptography"],"summary":"TLS 1.3에서는 서버 개인키만으로 세션을 복호화할 수 없다. 첨부된 NSS keylog의 세션 비밀을 tshark에 주어 HTTP/2 DATA 프레임을 복호화한다.","section":["CryptoHack","Crypto on the Web"]}
---

## 풀이 원리

TLS 1.3에서는 서버 개인키만으로 세션을 복호화할 수 없다. 첨부된 NSS keylog의 세션 비밀을 tshark에 주어 HTTP/2 DATA 프레임을 복호화한다.

## 최종 풀이 코드

Python 3, requests, tshark가 필요하다.

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

## 검증 방법

코드를 실행해 아래 출력의 핵심 값과 비교한다. 문제 페이지에 동일한 값을 제출하면 채점 결과를 확인할 수 있다.

```text
crypto{export_SSLKEYLOGFILE}
```

## 최종 답

`crypto{export_SSLKEYLOGFILE}`
