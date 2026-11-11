---
{"title":"CLASS 1*","date":"2026-11-11","category":"development","tags":["class 1*","solved.ac","백준"],"summary":"solved.ac CLASS 1*","section":["solved.ac"]}
---


# [ 보안 문제풀이 ] solved.ac - CLASS 1*

오늘은 CLASS 1\*을 밀어보겠습니다. (8문제)

27866번 - 문자와 문자열

![image01](/assets/uploads/tistory-08-01.png)

말 그대로 문자와 문자열의 성질을 이용해서 풀면 됩니다.

```python
n = str(input())
nu = int(input())
print(n[nu - 1])
```

25083번 - 새싹

![image02](/assets/uploads/tistory-08-02.png)

print의 성질을 이용해서 풀면 됩니다.

```python
print("""         ,r'"7
r`-_   ,'  ,/
 \. ". L_r'
   `~\/
      |
      |""")
```

10950번 - A + B - 3

![image03](/assets/uploads/tistory-08-03.png)

for문을 이용해 loop를 만들어 주면 됩니다.

```python
for i in range(int(input())):
    a, b = map(int, input().split())
    print(a + b)
```

10869번 - 사칙연산

![image04](/assets/uploads/tistory-08-04.png)

사칙연산을 알면 풀 수 있습니다.

```python
a, b = map(int, input().split())

print(a + b)
print(a - b)
print(a * b)
print(a // b)
print(a % b)
```

10951번 - A + B - 4

![image05](/assets/uploads/tistory-08-05.png)

while문을 이용해서 풀어주면 된다.

```python
while True:
    try:
        A, B = map(int, input().split())
        print(A + B)
    except:
        break
```

살짝 문제에다 장난을 쳐놨다;;

몇 번 반복하는지도 안 알려줘서 결국은 그냥 예외 처리 해야 정답이다.

10952번 - A + B - 5

![image06](/assets/uploads/tistory-08-06.png)

전 문제보다 쉽다.

```python
while True:
    A, B = map(int, input().split())
    if A == 0 and B == 0:
        break
    print(A + B)
```

11720번 - 숫자의 합

![image07](/assets/uploads/tistory-08-07.png)

이건 풀이 방법이 여러개가 있겠지만 난 문자열로 풀었다.

```python
input()
n = 0
for i in str(input()):
    n += int(i)
print(n)
```

10818번 - 최소, 최대

![image08](/assets/uploads/tistory-08-08.png)

이 문제는 파이썬 문법을 얼마나 잘 이용하는지 테스트 하는 것 같다.

```python
input()
a = list(map(int, input().split()))
print(min(a), max(a))
```

이렇게 class 1\*도 완료다.

다음엔 class 1\*\*로 넘어가보자.

![image09](/assets/uploads/tistory-08-09.png)
