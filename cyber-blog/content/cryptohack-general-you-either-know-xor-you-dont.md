---
{"title":"You either know, XOR you don't","date":"2026-11-10","category":"ctf","tags":["CryptoHack","General","Cryptography"],"summary":"알려진 플래그 접두사 crypto{와 암호문의 XOR로 키 앞 7바이트 myXORke를 얻는다. 반복 패턴에서 여덟 번째 바이트 y를 확인해 반복키 myXORkey로 복호화한다.","section":["CryptoHack","General"]}
---

## 풀이 원리

알려진 플래그 접두사 `crypto{`와 암호문의 XOR로 키 앞 7바이트 `myXORke`를 얻는다. 반복 패턴에서 여덟 번째 바이트 `y`를 확인해 반복키 `myXORkey`로 복호화한다.

## 최종 풀이 코드

```python
ct=bytes.fromhex('0e0b213f26041e480b26217f27342e175d0e070a3c5b103e2526217f27342e175d0e077e263451150104')
known=b'crypto{'
print('known key prefix:', bytes(a^b for a,b in zip(ct,known)))
key=b'myXORkey'
pt=bytes(x^key[i%len(key)] for i,x in enumerate(ct))
assert pt.startswith(b'crypto{') and pt.endswith(b'}')
print(pt.decode())
```

## 최종 플래그

```text
crypto{1f_y0u_Kn0w_En0uGH_y0u_Kn0w_1t_4ll}
```
