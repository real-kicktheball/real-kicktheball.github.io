---
{"title":"ByteCaesar","date":"2026-11-11","category":"ctf","tags":["ByteCaesar","드림핵","암호학"],"summary":"크립토","section":["DreamHack"]}
---


# [ 보안 문제풀이 ] 드림핵 - Crypto ByteCaesar

이번 문제는 암호학 문제이다.

카이사르에 대해 아는 사람이 많겠지만 간단히 설명을 하면 a -> d로 b -> e 등 3을 뒤로 밀면서 치환하는 암호를 말한다.

이번 문제 이름이 ByteCaesar인건 아마 바이트 단위로 밀지 않을까 싶다.

![image01](/assets/uploads/tistory-16-01.png)

문제를 다운로드하니 이런 귀여운 파일들이 있다.

![image02](/assets/uploads/tistory-16-02.png)

우리가 여기서 확인할 건 prob.py이다.

```python
import random

class Caesar:
    def __init__(self, key):
        assert isinstance(key, int) and 1 <= key <= 255
        self._key = key

    def encrypt(self, msg):
        msg_enc = b""
        for b in msg:
            msg_enc = msg_enc + bytes([(b + self._key) % 256])
        return msg_enc

    def decrypt(self, msg):
        msg_dec = b""
        for b in msg:
            msg_dec = msg_dec + bytes([(b - self._key) % 256])
        return msg_dec

def main():
    key = random.randint(1, 255)
    with open("secret", "rb") as f:
        secret = f.read()

    cipher = Caesar(key)
    secret_enc = cipher.encrypt(secret)
    print("I believe Caesar cipher is greatest encryption of all time.")
    print("No one can leak my secret sentence!")
    print(f"my encrypted sentence > {secret_enc.hex()}")

if __name__ == "__main__":
    main()
```

ㅋㅋ encrypt 부분을 확인하면 알 수 있지만 이건 간단히 256번 무차별 공격을 하면 찾을 수 있는 문제이다.

키 값이 작을 때 발생할 수 있는 문제이다.

정답을 구하는 방법은 256번 다 밀어보고 utf-8이나 아스키로 변환했을 때 읽을 수 있으면 그게 정답이다.

```python
# 1. 문제 출력에서 얻은 hex 값을 여기에 넣으세요
enc_hex = "061a17d2252720d2251e21291e2bd225172625d221281724d2261a17d215131e1fded2132c272417d22115171320ded2151325261b2019d213d2281b1424132026d2261322172526242bd22118d215211e212425d2131524212525d2261a17d2251d2be0d205171319271e1e25d225211324d2192413151718271e1e2bd2212817241a171316ded2261a171b24d215131e1e25d217151a211b2019d21b20d2261a17d225131e262bd2142417172c17e0d2f325d2261a17d22913281725d2191720261e2bd21e1322d21319131b202526d2261a17d2251320162bd2251a212417ded213d22517202517d22118d22624132023271b1e1b262bd22913251a1725d221281724d21f17e0d2fbd2181b2016d225211e131517d21b20d2261a1b25d21f211f172026ded213d2221713151718271ed224172624171326d21824211fd2261a17d2142725261e1b2019d22921241e16e0d2001326272417d925d214171327262bd2172028171e212225d21f17ded224171f1b20161b2019d21f17d22118d2261a17d229212016172425d2261a1326d21e1b17d214172b212016d2212724d216131b1e2bd2242127261b201725e0d2fb20d2261a1b25d2251724172017d2251726261b2019ded2fbd2171f1424131517d2261a17d21a13241f21202bd22118d2261a17d222241725172026d2132016d21e1726d21f2bd2292124241b1725d216241b1826d21329132bd2291b261ad2261a17d2261b1617e0d2f81b20131e1e2bded2fbd2181b2016d21f2b25171e18d2251e1717221b2019d2291b261ad2261a17d2181e1319ded2f6fa2de5e914161815eae4e5e7e4e516171513e8e8e515e9e5e913e815e817e4e61815e7e8e31613e61616e7e3e718e2ebe91518ea13e6ea16e6e3e913e51814e615132f" 
secret_enc = bytes.fromhex(enc_hex)

print("[-] 복호화를 시작합니다...")
print("-" * 50)

# 2. 1부터 255까지 모든 키를 대입
for key in range(1, 256):
    msg_dec = b""
    for b in secret_enc:
        msg_dec = msg_dec + bytes([(b - key) % 256])
    
    # 3. UTF-8로 디코딩 시도
    try:
        decoded_str = msg_dec.decode('utf-8')
        
        # 출력 가능한 일반적인 문자열인지 필터링 (알파벳, 숫자 등이 포함되어 있는지)
        # 보통 플래그 형식인 'FLAG', 'DH{', 'crypto' 등이 포함되어 있다면 더 찾기 쉽습니다.
        if decoded_str.isprintable():
            print( f"[+] Found Key {key:3} : {decoded_str}" )
            
    except UnicodeDecodeError:
        # UTF-8로 변환되지 않는 깨진 바이너리는 패스
        continue
```

출력은 밑과 같다.

![image03](/assets/uploads/tistory-16-03.png)
