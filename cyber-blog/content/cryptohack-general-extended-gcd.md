---
{"title":"Extended GCD","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"확장 유클리드 알고리즘에서 Bézout 계수 u,v를 구한다. 26513u + 32321v = 1을 만족하며 더 작은 계수가 정답이다.","section":["CryptoHack","General"]}
---

- 문제: [Extended GCD](https://cryptohack.org/challenges/general/#egcd)
- 검증: CryptoHack 계정에서 정답 처리 확인 (2026-11-10)


## 풀이 원리

확장 유클리드 알고리즘에서 Bézout 계수 `u,v`를 구한다. `26513u + 32321v = 1`을 만족하며 더 작은 계수가 정답이다.

## 최종 풀이 코드

```python
def egcd(a,b):
    if b==0:return a,1,0
    g,x,y=egcd(b,a%b)
    return g,y,x-(a//b)*y
g,u,v=egcd(26513,32321)
assert 26513*u+32321*v==g==1
print(min(u,v))
```

## 검증 방법

위 코드를 Python 3에서 실행하여 아래 결과를 확인한다. 문제 페이지의 제출 상태에서도 정답 처리됨을 확인했다.

## 최종 플래그

```text
-8404
```
