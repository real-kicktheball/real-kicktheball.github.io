---
{"title":"Lemur XOR","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"두 PNG 파일을 파일 바이트 단위로 XOR하면 PNG 압축 구조가 깨진다. 두 그림을 RGB로 디코딩한 뒤 대응하는 채널값끼리 XOR하여 새 이미지를 만든다. 이미지에 플래그가 표시된다.","section":["CryptoHack","General"]}
---

## 풀이 원리

두 PNG 파일을 파일 바이트 단위로 XOR하면 PNG 압축 구조가 깨진다. 두 그림을 RGB로 디코딩한 뒤 대응하는 채널값끼리 XOR하여 새 이미지를 만든다. 이미지에 플래그가 표시된다.

## 최종 풀이 코드

```python
import requests, io
from PIL import Image
urls = [
 'https://cryptohack.org/static/challenges/lemur_ed66878c338e662d3473f0d98eedbd0d.png',
 'https://cryptohack.org/static/challenges/flag_7ae18c704272532658c10b5faad06d74.png',
]
a,b=[Image.open(io.BytesIO(requests.get(u).content)).convert('RGB') for u in urls]
assert a.size == b.size
out=Image.new('RGB',a.size)
out.putdata([tuple(x^y for x,y in zip(p,q)) for p,q in zip(a.get_flattened_data(),b.get_flattened_data())])
out.save('lemur_xor.png')
print('lemur_xor.png을 열어 표시된 플래그 확인')
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
crypto{X0Rly_n0t!}
```
