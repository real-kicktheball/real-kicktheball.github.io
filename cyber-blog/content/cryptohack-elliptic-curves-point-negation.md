---
{"title":"Point Negation","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Elliptic Curves","Cryptography"],"summary":"점의 역원은 x 좌표가 같고 y 좌표가 부호 반전된 점이다. 유한체에서는 -6936 mod 9739 = 2803이다.","section":["CryptoHack","Elliptic Curves"]}
---

## 풀이 원리

점의 역원은 x 좌표가 같고 y 좌표가 부호 반전된 점이다. 유한체에서는 `-6936 mod 9739 = 2803`이다.

## 최종 풀이 코드

```python
p = 9739
x, y = 8045, 6936
q = (x, -y % p)
assert (y+q[1]) % p == 0
print(f'crypto{{{q[0]},{q[1]}}}')
```

## 최종 플래그

`crypto{8045,2803}`
