---
{"title":"Favourite byte","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"1바이트 키 XOR은 키 후보가 256개뿐이라 전수조사로 깨진다.","section":["CryptoHack","General"]}
---

## 개념

키가 **1바이트**인 XOR 암호는 모든 평문 바이트에 같은 값을 XOR한다.

$$
c_i = m_i \oplus k \quad (k \in \{0, \dots, 255\})
$$

키 후보가 256개뿐이라 전부 시도해보면 된다(브루트포스). 맞는 키를 고르는 기준으로는 평문이 알려진 형식(`crypto{`)으로 시작하는지 보면 된다.

## 문제

hex 암호문 `73626960647f6b20...` 하나가 주어지고, 1바이트 키로 XOR되어 있다고 한다.

## 풀이

사실 키를 바로 계산할 수도 있다. 평문 첫 바이트는 `'c'`(0x63)이고 암호문 첫 바이트는 0x73이다.

$$
k = 0x73 \oplus 0x63 = 0x10
$$

코드에서는 256개를 모두 시도해서 `crypto{`로 시작하는 결과를 골랐다. 키는 0x10이고, 플래그에도 그 값이 들어 있다.

## 풀이 코드
```python
ct=bytes.fromhex('73626960647f6b206821204f21254f7d694f7624662065622127234f726927756d')
for key in range(256):
    pt=bytes(x^key for x in ct)
    if pt.startswith(b'crypto{'):
        print(pt.decode())
```

## 플래그
```text
crypto{0x10_15_my_f4v0ur173_by7e}
```
