---
{"title":"Introduction to Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"분리 가능 isogeny에서는 차수(degree)가 커널의 원소 수와 같다. 차수가 65537이므로 크기도 65537이다.","section":["CryptoHack","Isogenies"]}
---

## 풀이 방법

분리 가능 isogeny에서는 차수(degree)가 커널의 원소 수와 같다. 차수가 65537이므로 크기도 65537이다.

## 최종 풀이 코드

```python
degree = 65537
kernel_size = degree  # separable isogeny
print(kernel_size)
```

## 최종 정답

```text
65537
```
