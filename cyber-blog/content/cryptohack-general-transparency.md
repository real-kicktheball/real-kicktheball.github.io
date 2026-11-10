---
{"title":"Transparency","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"제시된 공개키에 대응하는 인증서를 Certificate Transparency 기록에서 찾아 thetransparencyflagishere.cryptohack.org를 식별한다. 해당 호스트의 본문에서 플래그를 받는다. 현재 서비스 인증서는…","section":["CryptoHack","General"]}
---

## 풀이 원리

제시된 공개키에 대응하는 인증서를 Certificate Transparency 기록에서 찾아 `thetransparencyflagishere.cryptohack.org`를 식별한다. 해당 호스트의 본문에서 플래그를 받는다. 현재 서비스 인증서는 갱신되어 첨부 키와 다르므로 과거 CT 기록이 문제의 근거다.

## 최종 풀이 코드

```python
import requests, re
u='https://thetransparencyflagishere.cryptohack.org/'
r=requests.get(u,timeout=15);r.raise_for_status()
print(re.search(r'crypto\{[^}]+\}',r.text).group())
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{thx_redpwn_for_inspiration}
```
