---
{"title":"Privacy-Enhanced Mail?","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"PEM은 DER(ASN.1) 바이너리를 Base64로 감싼 형식이다. RSA 개인키 PEM에서 d를 꺼낸다.","section":["CryptoHack","General"]}
---

## 개념

**PEM**은 키와 인증서를 저장할 때 가장 흔히 쓰는 형식이다.

```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAzvKDt+EO+A6oE1LItSunkWJ8vN6Tgcu8Ck077joGDfG2NtxD
...
-----END RSA PRIVATE KEY-----
```

구조는 다음과 같다.

- 가운데 부분은 **DER** 바이너리를 Base64로 인코딩한 것이다.
- DER은 **ASN.1** 구조를 바이너리로 표현한 것이다.
- RSA 개인키의 ASN.1 구조에는 $n, e, d, p, q$ 등이 순서대로 들어 있다.

## 문제

RSA 개인키 PEM 파일이 주어지고, 개인 지수 $d$를 정수로 구하라는 문제다.

## 풀이

ASN.1을 직접 파싱할 필요 없이 PyCryptodome의 `RSA.import_key()`에 PEM을 넘기면 된다. 키 객체의 `.d`를 출력하면 답이다.

## 풀이 코드
```python
import requests
from Crypto.PublicKey import RSA
u='https://cryptohack.org/static/challenges/privacy_enhanced_mail_1f696c053d76a78c2c531bb013a92d4a.pem'
key=RSA.import_key(requests.get(u).content)
assert key.has_private()
print(key.d)
```

## 플래그
```text
15682700288056331364787171045819973654991149949197959929860861228180021707316851924456205543665565810892674190059831330231436970914474774562714945620519144389785158908994181951348846017432506464163564960993784254153395406799101314760033445065193429592512349952020982932218524462341002102063435489318813316464511621736943938440710470694912336237680219746204595128959161800595216366237538296447335375818871952520026993102148328897083547184286493241191505953601668858941129790966909236941127851370202421135897091086763569884760099112291072056970636380417349019579768748054760104838790424708988260443926906673795975104689
```
