---
{"title":"Three Isogenies","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"위수 3인 점이 만드는 3-아이소제니를 계산한다. 커널은 {O, K, 2K} 세 점이다.","section":["CryptoHack","Isogenies"]}
---

## 개념

3-아이소제니의 커널은 $\{O, K, -K\}$다($2K = -K$). 위수 2일 때와 마찬가지로 Vélu 공식으로 공역을 계산한다.

$\ell$이 커지면 커널 점이 많아진다. 그래서 Vélu 공식의 비용은 대략 $O(\ell)$이다. 그래서 실제 프로토콜은 작은 소수 $\ell$의 아이소제니를 여러 번 합성한다.

## 문제

앞 문제와 같은 곡선에서 위수 3인 점 $K$가 주어진다. 공역 j-불변량을 구한다.

## 풀이

`E.isogeny(K)`로 3-아이소제니를 만들고, 차수가 3인 것을 확인한 뒤 공역 j-불변량을 출력했다.

## 풀이 코드
```python
p=2**18*3**13-1
F.<i>=GF(p**2,modulus=[1,0,1])
E=EllipticCurve(F,[1,0])
K=E(483728976,174842350631)
phi=E.isogeny(K)
assert phi.degree()==3
j=phi.codomain().j_invariant()
print(j)
```

## 플래그
```text
96392670793
```
