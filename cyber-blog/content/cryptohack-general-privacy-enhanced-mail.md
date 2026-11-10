---
{"title":"Privacy-Enhanced Mail?","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"PEM의 Base64/DER 구조를 RSA 파서에 넘기고 개인 지수 d를 추출한다.","section":["CryptoHack","General"]}
---

- 문제: [Privacy-Enhanced Mail?](https://cryptohack.org/challenges/general/#pem1)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)
- [privacy_enhanced_mail.pem](https://cryptohack.org/static/challenges/privacy_enhanced_mail_1f696c053d76a78c2c531bb013a92d4a.pem)

## 풀이 원리

PEM의 Base64/DER 구조를 RSA 파서에 넘기고 개인 지수 `d`를 추출한다.

## 최종 풀이 코드

```python
import requests
from Crypto.PublicKey import RSA
u='https://cryptohack.org/static/challenges/privacy_enhanced_mail_1f696c053d76a78c2c531bb013a92d4a.pem'
key=RSA.import_key(requests.get(u).content)
assert key.has_private()
print(key.d)
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
15682700288056331364787171045819973654991149949197959929860861228180021707316851924456205543665565810892674190059831330231436970914474774562714945620519144389785158908994181951348846017432506464163564960993784254153395406799101314760033445065193429592512349952020982932218524462341002102063435489318813316464511621736943938440710470694912336237680219746204595128959161800595216366237538296447335375818871952520026993102148328897083547184286493241191505953601668858941129790966909236941127851370202421135897091086763569884760099112291072056970636380417349019579768748054760104838790424708988260443926906673795975104689
```
