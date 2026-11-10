---
{"title":"Finding Flags","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Introduction","Cryptography"],"summary":"CryptoHack 플래그 형식 crypto{...}를 익히는 첫 문제.","section":["CryptoHack","Introduction"]}
---

## 개념

**보물찾기 쪽지**라고 생각하면 된다. CryptoHack의 문제를 풀면 마지막에 "정답 쪽지"가 나오는데, 이 쪽지에는 항상 같은 모양의 겉봉투가 씌워져 있다.

```
crypto{ 여기에 정답 }
```

이 모양을 **플래그(flag, 깃발)**라고 부른다. 깃발을 뽑아서 제출하면 문제를 푼 것이다.

이 모양을 알고 있으면 나중에 큰 도움이 된다. 암호문을 풀다가 결과가 `crypto{`로 시작하면 "아, 제대로 풀렸구나!" 하고 알 수 있기 때문이다. 반대로 이상한 글자가 나오면 아직 틀린 것이다.

| 용어 | 뜻 |
|---|---|
| 플래그 | 문제를 풀었다는 증거가 되는 정답 문자열 |
| 제출 | 찾은 플래그를 사이트에 입력하는 것 |

### 정리

CryptoHack의 정답은 대부분 `crypto{...}` 형식의 **플래그**다. 문제를 풀면 이 형식의 문자열이 나오고, 이걸 제출하면 해결 처리된다. 나중에 XOR 문제처럼 키를 모를 때는 "평문이 `crypto{`로 시작한다"는 사실 자체가 중요한 단서가 된다(known plaintext).

## 문제

문제 설명에 플래그 형식의 예시 `crypto{y0ur_f1rst_fl4g}`가 그대로 나와 있고, 이걸 제출하라고 한다.

## 풀이

설명 문장에서 `crypto{` 로 시작해 `}` 로 끝나는 부분을 정규식으로 뽑으면 된다.

## 풀이 코드
```python
import re
text = "These flags will usually be in the format crypto{y0ur_f1rst_fl4g}."
print(re.search(r"crypto\{[^}]+\}", text).group())
```

## 플래그
```text
crypto{y0ur_f1rst_fl4g}
```
