---
{"title":"Image Point Arithmetic","date":"2026-11-10","category":"ctf","tags":["CryptoHack","Isogenies","Cryptography"],"summary":"군 준동형 성질로 \\phi(P+Q)=\\phi(P)+\\phi(Q)다. 두 상의 좌표로 유한체 위 타원곡선 덧셈 공식을 적용한다. 서로 다른 x-좌표이므로 기울기는 (y_2-y_1)/(x_2-x_1)이다.","section":["CryptoHack","Isogenies"]}
---

분야: Isogenies / iso_background  
문제: https://cryptohack.org/challenges/isogenies/#c_group_homomorphism  
검증: 2026-11-10, 로컬 실행 확인. CryptoHack 계정 정답 처리 확인

## 풀이 방법

군 준동형 성질로 $\phi(P+Q)=\phi(P)+\phi(Q)$다. 두 상의 좌표로 유한체 위 타원곡선 덧셈 공식을 적용한다. 서로 다른 $x$-좌표이므로 기울기는 $(y_2-y_1)/(x_2-x_1)$이다.

## 최종 풀이 코드

다음 코드를 `python`으로 실행한다. 첨부 파일을 사용하는 코드는 공식 URL에서 내려받는다.

```python
p=63079
x1,y1=48622,27709
x2,y2=9460,13819
slope=((y2-y1)*pow(x2-x1,-1,p))%p
x3=(slope*slope-x1-x2)%p
print(x3)
```

## 검증 방법

표준 출력이 아래 정답과 같은지 확인한다. 플랫폼 제출 상태는 별도로 기록한다.

## 최종 정답

```text
37097
```
