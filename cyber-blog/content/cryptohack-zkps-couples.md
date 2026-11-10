---
{"title":"Couples","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"set_internal_z는 입력 z에 대해 x^{z+7}-x^3\\pmod p의 역원을 내부 값으로 저장한다. z=p-5를 선택하면 지수 z+7=p+2이고, 페르마 소정리로 x^{p+2}=x^3\\pmod p다. 분모가 0인데 자체 inver…","section":["CryptoHack","ZKPs"]}
---

## 풀이 방법

`set_internal_z`는 입력 $z$에 대해 $x^{z+7}-x^3\pmod p$의 역원을 내부 값으로 저장한다. $z=p-5$를 선택하면 지수 $z+7=p+2$이고, 페르마 소정리로 $x^{p+2}=x^3\pmod p$다. 분모가 0인데 자체 `inverse` 함수가 오류 대신 0을 반환하여 내부 `z=0`이 된다. 그 결과 BLS 양쪽 페어링이 항등원이 되므로, 유효한 곡선 점 `(1,2,1)`과 임의 해시값 0으로 검사를 통과한다.

## 최종 익스플로잇

Python 3 표준 라이브러리만 사용한다. 공식 서버에 접속한다.

```python
import socket, json
p=21888242871839275222246405745257275088696311157297823662689037894645226208583
with socket.create_connection(('socket.cryptohack.org',13415),timeout=10) as sock:
    f=sock.makefile('rwb')
    f.readline()
    def ask(obj):
        f.write(json.dumps(obj).encode()+b'\n');f.flush()
        return json.loads(f.readline())
    first=ask({'option':'set_internal_z','z':hex(p-5)})
    assert first['msg']=='Internal z changed!'
    result=ask({'option':'do_proof','G':'(1,2,1)','hsh':'0'})
    print(result['msg'])
```

## 검증 방법

서버가 `Internal z changed!`를 응답하고, 이어 `do_proof`에 아래 플래그를 돌려주는지 확인한다.

## 최종 플래그

```text
crypto{don_t_let_useless_param_and_edge_cases_in_your_code}
```
