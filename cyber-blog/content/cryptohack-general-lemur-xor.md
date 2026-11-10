---
{"title":"Lemur XOR","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"같은 키로 XOR된 두 이미지를 서로 XOR하면 키가 사라진다. 이미지는 픽셀(RGB) 단위로 XOR해야 한다.","section":["CryptoHack","General"]}
---

## 개념

같은 키 $K$로 두 평문을 XOR했다면, 두 암호문을 서로 XOR하는 순간 키가 사라진다.

$$
C_1 \oplus C_2 = (P_1 \oplus K) \oplus (P_2 \oplus K) = P_1 \oplus P_2
$$

OTP(일회용 패드)의 키를 재사용하면 안 되는 이유가 이것이다. 이미지라면 $P_1 \oplus P_2$만으로도 두 그림의 윤곽이 겹쳐 보인다.

## 문제

같은 비밀 키로 XOR된 PNG 두 장(`lemur.png`, `flag.png`)이 주어진다.

## 풀이

PNG 파일 바이트를 그대로 XOR하면 안 된다. PNG는 압축 포맷이라 파일 바이트를 섞으면 깨진 파일이 나온다.

1. 두 이미지를 디코딩해서 RGB 픽셀값을 얻는다.
2. 같은 위치 픽셀의 R, G, B 값을 각각 XOR한다.
3. 새 이미지로 저장하면 키가 사라지고 플래그 글자가 보인다.

## 풀이 코드
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

## 플래그
```text
crypto{X0Rly_n0t!}
```
