---
{"title":"Where's the Supersingular Curve","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"첨부된 100개 Montgomery 계수 각각으로 타원곡선을 만들고 SageMath의 supersingular 판정을 적용한다. 참으로 판정되는 계수 하나를 출력한다.","section":["CryptoHack","Isogenies"]}
---

분야: Isogenies / iso_background  
문제: https://cryptohack.org/challenges/isogenies/#a_spot_super  
검증: 2026-11-10, 로컬 실행 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

첨부된 100개 Montgomery 계수 각각으로 타원곡선을 만들고 SageMath의 supersingular 판정을 적용한다. 참으로 판정되는 계수 하나를 출력한다.

## 최종 풀이 코드

다음 코드를 `sage -python`으로 실행한다. 첨부 파일을 사용하는 코드는 공식 URL에서 내려받는다.

```python
from sage.all import GF, EllipticCurve
from urllib.request import urlopen
import ast, re
URL = "https://cryptohack.org/static/challenges/curves_1e476e7d608576c05a13b269d1481602.sage"
source = urlopen(URL).read().decode()
coefficients = ast.literal_eval(re.search(r'A_coefficients = (\[.*?\])', source, re.S).group(1))
F=GF(2**127-1)
for A in coefficients:
    E=EllipticCurve(F,[0,A,0,1,0])
    if E.is_supersingular(): print(A)
```

## 검증 방법

표준 출력이 아래 정답과 같은지 확인한다. 플랫폼 제출 상태는 별도로 기록한다.

## 최종 정답

```text
170141183460469230846243588177825628225
```
