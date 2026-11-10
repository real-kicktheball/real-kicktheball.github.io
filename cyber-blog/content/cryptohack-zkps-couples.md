---
{"title":"Couples","date":"2026-11-10","category":"ctf","tags":["CryptoHack","ZKPs","Cryptography"],"summary":"직접 만든 모듈러 역원 함수가 0의 역원을 오류 대신 0으로 돌려주는 엣지 케이스 때문에 페어링 검증이 무의미해진다.","section":["CryptoHack","ZKPs"]}
---

## 개념

수학적으로 "0으로 나누기"는 불가능하다. 그래서 0의 역원은 **존재하지 않는다**. 코드에서는 이럴 때 **오류를 내야** 한다.

### 이 문제의 실수

직접 만든 역원 함수가 0을 받으면 오류 대신 **0을 돌려준다**. 그러면 "역원을 구했다"는 결과가 조용히 0이 되고, 그 뒤 계산이 전부 엉망이 된다.

### 페어링 검증에서 0이 되면?

검증 식은 이런 모양이다.

$$
e(\text{서명},\ G_2) \stackrel{?}{=} e(\text{해시},\ \text{공개키})
$$

비밀값이 0이 되면 양쪽 모두 **1**(페어링 세계의 "아무것도 없음")이 된다. $1 = 1$이니까 아무 입력이나 통과한다.

### 0 만들기 ($p$로 나눈 나머지 세계)

페르마의 소정리에 따르면 $x^{p-1} = 1$이다. 그래서 다음이 성립한다.

$$
x^{p+2} = x^{p-1} \times x^3 = x^3
$$

서버는 $(x^{z+7} - x^3)$의 역원을 계산한다. $z = p - 5$를 보내면 $z + 7 = p + 2$라서 $x^{p+2} - x^3 = 0$이 된다. 0의 역원이 0으로 처리돼서 검증이 무력화된다.

교훈은 두 가지다. 0이나 경계값 같은 **엣지 케이스**를 꼭 처리할 것, 그리고 쓰지 않는 파라미터를 코드에 남기지 말 것.

### 정리

페어링 기반 검증은 보통 두 페어링 값이 같은지 비교한다.

$$
e(\sigma, G_2) \stackrel{?}{=} e(H(m), pk)
$$

만약 비밀값이 0이 되면 어떻게 될까. 양쪽 페어링이 모두 항등원 1이 되어 아무 입력이나 통과한다. 그래서 0, 무한원점 같은 **엣지 케이스**를 반드시 막아야 한다.

이 문제의 원인은 자체 구현한 역원 함수다. $0^{-1}$은 존재하지 않으니 오류를 내야 하는데, 0을 돌려준다. 그래서 "역원을 구했다"는 결과가 조용히 0이 된다.

## 문제

서버는 `set_internal_z`로 받은 $z$에 대해 $(x^{z+7} - x^3)^{-1} \bmod p$를 내부값으로 저장한다. `do_proof`는 이 값을 써서 BLS 스타일 페어링 검증을 한다.

## 풀이

1. $z = p - 5$를 보내면 지수가 $z + 7 = p + 2$가 된다.
2. 페르마의 소정리에 의해 $x^{p+2} = x^{p-1} \cdot x^3 \equiv x^3$이다. 그래서 분모가 0이다.
3. 역원 함수가 0을 돌려줘서 내부값이 0이 되고, 양쪽 페어링이 항등원이 된다.
4. 유효한 곡선 점 `(1, 2, 1)`과 해시 0으로 `do_proof`를 보내면 통과한다.

## 풀이 코드
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

## 플래그
```text
crypto{don_t_let_useless_param_and_edge_cases_in_your_code}
```
