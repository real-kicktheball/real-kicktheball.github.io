---
{"title":"No Way Back Home","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Mathematics","Cryptography"],"summary":"비밀값 v가 p의 배수라서 mod n에서는 역원이 없지만, mod q에서는 정상적으로 계산된다. q에서 v를 구한 뒤 CRT로 합친다.","section":["CryptoHack","Mathematics"]}
---

## 개념

**자물쇠 두 개로 상자 보내기** 방법이 있다.

1. Alice가 상자에 자기 자물쇠 A를 걸어 Bob에게 보낸다.
2. Bob이 자기 자물쇠 B를 하나 더 걸어 돌려보낸다.
3. Alice가 자물쇠 A를 풀어서 다시 보낸다. 이제 B만 걸려 있다.
4. Bob이 B를 풀면 내용물이 나온다.

열쇠를 주고받지 않고도 안전하게 보낼 수 있다.

### 숫자 자물쇠의 문제점

이 문제에서는 자물쇠를 **곱하기**로 만들었다. 비밀값 $v$에 $k_A$, $k_B$를 곱한다. 그러면 도청자가 세 번의 전송을 다 보고 이렇게 계산할 수 있다.

$$
\frac{(v k_A) \times (v k_B)}{v k_A k_B} = v
$$

### 직접 해보기 ($v = 5$, $k_A = 3$, $k_B = 7$, 보통 숫자로)

- 1번 전송: $5 \times 3 = 15$
- 2번 전송: $15 \times 7 = 105$
- 3번 전송: $105 \div 3 = 35$

도청자 계산: $\frac{15 \times 35}{105} = \frac{525}{105} = 5$. 비밀이 그대로 나온다.

곱하기 자물쇠는 나누기로 쉽게 풀린다. 그래서 진짜 자물쇠는 거듭제곱(Diffie-Hellman)처럼 되돌리기 어려운 계산으로 만들어야 한다.

### 정리

곱셈으로 비밀을 가렸다 푸는 "세 번 주고받기" 프로토콜이다($n = pq$).

1. Alice는 $v \cdot k_A$를 보낸다.
2. Bob은 $k_B$를 곱해 $v k_A k_B$를 돌려준다.
3. Alice는 $k_A$를 지워 $v k_B$를 보낸다.

도청자는 세 값을 모두 본다. 그래서 다음 식으로 $v$를 구할 수 있다.

$$
v = \frac{(v k_A)(v k_B)}{v k_A k_B}
$$

다만 이 문제에서는 $v$가 $p$의 배수라 $\bmod n$에서 역원이 없다. 그래서 $\bmod q$와 $\bmod p$로 나눠서 생각해야 한다.

## 문제

$p$, $q$와 도청한 `vka`, `vkb`, `vkakb`, AES 암호문이 주어진다. AES 키는 $v$로 만든다.

## 풀이

1. $\bmod q$에서는 $v$가 0이 아니라 역원이 존재한다. 그래서 $v_q = vka \cdot vkb \cdot vkakb^{-1} \bmod q$로 계산된다.
2. $v$는 $p$의 배수이므로 $v \equiv 0 \pmod p$이다.
3. 두 조건을 CRT로 합쳐 $v = p \cdot (v_q \cdot p^{-1} \bmod q)$를 얻는다.
4. `SHA256(long_to_bytes(v))`를 키로 AES-ECB 복호화하면 플래그가 나온다.

## 풀이 코드
```python
import hashlib, re, requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from Crypto.Util.number import long_to_bytes
url='https://cryptohack.org/static/challenges/out_549f6bbac5f815ee3f197c2248a352cd.txt'
data=requests.get(url,timeout=20).text
p,q=map(int,re.search(r'p, q = \((\d+), (\d+)\)',data).groups())
v={k:int(x) for k,x in re.findall(r'(?m)^(vka|vkakb|vkb) = (\d+)',data)}
n=p*q
vmodq=v['vka']*v['vkb']*pow(v['vkakb'],-1,q)%q
secret=p*(vmodq*pow(p,-1,q)%q)
assert secret%p==0 and secret%q==vmodq
ct=bytes.fromhex(re.search(r"c = '([0-9a-f]+)'",data).group(1))
key=hashlib.sha256(long_to_bytes(secret)).digest()
flag=unpad(AES.new(key,AES.MODE_ECB).decrypt(ct),16).decode()
assert flag.startswith('crypto{') and flag.endswith('}')
print(flag)
```

## 플래그
`crypto{1nv3rt1bl3_k3y_3xch4ng3_pr0t0c0l}`
