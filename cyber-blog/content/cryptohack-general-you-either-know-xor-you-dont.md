---
{"title":"You either know, XOR you don't","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"반복 키 XOR에서 알려진 평문(crypto{)으로 키 일부를 복원하고 나머지를 추측한다.","section":["CryptoHack","General"]}
---

## 개념

이번엔 열쇠가 한 글자가 아니라 **여러 글자짜리 단어**다. 짧은 열쇠를 계속 반복해서 쓴다.

```
평문:  c  r  y  p  t  o  {  ...
열쇠:  K  E  Y  K  E  Y  K  ...   ← 'KEY'를 반복
```

열쇠를 모르지만 평문 앞부분은 안다. 바로 `crypto{`다. XOR은 두 번 하면 사라지니까 다음이 성립한다.

$$
\text{암호문} \oplus \text{평문} = \text{열쇠}
$$

그래서 앞 7글자를 XOR하면 **열쇠 앞 7글자**가 나온다.

### 이 문제에서

1. 앞 7글자를 XOR했더니 `myXORke`가 나왔다.
2. 영어 단어처럼 보면 `myXORkey`(8글자)일 것 같다. 이렇게 추측하는 게 중요하다.
3. 마지막 글자 `}`로도 확인하면 열쇠 글자 `y`가 나와서 추측이 맞다.
4. `myXORkey`를 반복해서 전체를 풀면 정답이다.

### 정리

**반복 키 XOR**은 짧은 키를 평문 길이만큼 반복해서 XOR한다.

$$
c_i = m_i \oplus k_{i \bmod |k|}
$$

평문의 일부를 알고 있으면(**known plaintext**) 그 위치의 키를 바로 계산할 수 있다.

$$
k_i = c_i \oplus m_i
$$

## 문제

플래그를 비밀 키로 XOR한 hex 암호문만 주어진다. 키 길이도 알려주지 않는다.

## 풀이

1. 플래그는 `crypto{`로 시작하므로 암호문 앞 7바이트와 XOR한다. 그러면 키 앞부분 `myXORke`가 나온다.
2. 단어 모양을 보면 키는 `myXORkey`(8바이트)일 가능성이 크다.
3. 확인해보면 암호문은 42바이트라서 마지막 바이트(41번째)는 $41 \bmod 8 = 1$번 키 바이트 `y`로 암호화된다. 마지막 암호문 바이트 0x04를 `}`(0x7d)와 XOR해도 $0x79$ = `y`가 나와서 길이 8이 맞다.
4. `myXORkey`를 반복해서 전체를 복호화하면 플래그가 나온다.

## 풀이 코드
```python
ct=bytes.fromhex('0e0b213f26041e480b26217f27342e175d0e070a3c5b103e2526217f27342e175d0e077e263451150104')
known=b'crypto{'
print('known key prefix:', bytes(a^b for a,b in zip(ct,known)))
key=b'myXORkey'
pt=bytes(x^key[i%len(key)] for i,x in enumerate(ct))
assert pt.startswith(b'crypto{') and pt.endswith(b'}')
print(pt.decode())
```

## 플래그
```text
crypto{1f_y0u_Kn0w_En0uGH_y0u_Kn0w_1t_4ll}
```
