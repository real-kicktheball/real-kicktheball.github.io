---
{"title":"CLASS 1**","date":"2026-11-11","category":"development","tags":["class-1**","백준"],"summary":"solved.ac CLASS 1**","section":["solved.ac"]}
---


# [ 개발 문제풀이 ] solved.ac - CLASS 1**

2884번 - 알람 시계

![image01](/assets/uploads/tistory-10-01.png)

if문으로 해결하면 된다.

```python
h, m = map(int, input().split())

if m - 45 < 0:
    if h - 1 < 0: h = 23
    else: h -= 1
    m = 60 + (m - 45)
else: m -= 45

print(h, m)
```

10998번 - AxB

![image02](/assets/uploads/tistory-10-02.png)

map()으로 입력을 나누면 된다.

```python
a, b = map(int, input().split())

print(a * b)
```

10871번 - X보다 작은 수

![image03](/assets/uploads/tistory-10-03.png)

수열을 for문으로 받고 적절히 if문을 사용해주면 된다.

```python
N, X = map(int, input().split())
list1 = []
for i in map(int, input().split()):
    if i < X:
        list1.append(i)
print(*list1)
```

9498번 - 시험 성적

![image04](/assets/uploads/tistory-10-04.png)

if문의 반복

```python
score = int(input())

if score >= 90 and score <= 100:
    print("A")
elif score >= 80 and score < 90:
    print("B")
elif score >= 70 and score < 80:
    print("C")
elif score >= 60 and score < 70:
    print("D")
else:
    print("F")
```

10172번 - 개

![image05](/assets/uploads/tistory-10-05.png)

x = r'''sentence''' 을 이용한다. (raw string)

```python
cat = r'''|\_/|
|q p|   /}
( 0 )"""\
|"^"`    |
||_/=\\__|'''

print(cat)
```

10171번 - 고양이

![image06](/assets/uploads/tistory-10-06.png)

위 10172번 문제와 같다.

```python
cat = r'''\    /\
 )  ( ')
(  /  )
 \(__)|'''

print(cat)
```

31403번 - A + B - C

![image07](/assets/uploads/tistory-10-07.png)

type을 잘 알면 풀 수 있다.

```python
a = int(input())
b = int(input()) 
c = int(input())

print(a + b - c)
print(int(str(a) + str(b)) - c)
```

10809번 - 알파벳 찾기

![image08](/assets/uploads/tistory-10-08.png)

for문과 문자열을 이용하면 풀 수 있다.

```python
import string

S = input()

alphabet = string.ascii_lowercase

result = []
for char in alphabet:
    result.append(str(S.find(char)))

print(" ".join(result))
```

10250번 - ACM 호텔

![image09](/assets/uploads/tistory-10-09.png)

이번 문제는 조금 이해하기 오래 걸렸지만 사실 어려운 문제는 아니였다.

손님에게 제일 가까운 방을 내주는 방정식만 끄집어내서 대입해주었다.

```python
T = int(input())

for _ in range(T):
    H, W, N = map(int, input().split())
    
    floor = N % H
    room = (N // H) + 1
    
    if floor == 0:
        floor = H
        room -= 1
        
    print(f"{floor}{room:02d}")
```

8958번 - OX퀴즈

![image10](/assets/uploads/tistory-10-10.png)

구현을 하는 방법만 알면 된다.

```python
for _ in range(int(input())):
    score = 1
    total = 0
    quiz = str(input())
    for i in quiz:
        if i == "O":
            total += score
            score += 1
        else:
            score = 1
    print(total)
```

3052번 - 나머지

![image11](/assets/uploads/tistory-10-11.png)

이것도 구현 문제이다.

```python
list1 = []
for _ in range(10):
    num = int(input()) % 42
    if num in list1:
        continue
    list1.append(num)

print(len(list1))
```

2920번 - 음계

![image12](/assets/uploads/tistory-10-12.png)

이 문제는 구현도 아니라 노가다다.

```python
a, b, c, d, e, g, h, i = map(int, input().split())

if a == 1 and b == 2 and c == 3 and d == 4 and e == 5 and g == 6 and h == 7 and i == 8:
    print("ascending")
elif a == 8 and b == 7 and c == 6 and d == 5 and e == 4 and g == 3 and h == 2 and i == 1:
    print("descending")
else:
    print("mixed")
```

이렇게 백준 class-1\*\*도 끝났다. 다음엔 class-2를 도전해보겠다.

AI를 사용하지 않고 하니깐 막히는 부분도 있었지만 그래도 1단계는 수월하게 풀었던 거 같다
