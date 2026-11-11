---
{"title":"CLASS 1","date":"2026-11-11","category":"development","tags":["class 1","백준"],"summary":"solved.ac CLASS 1","section":["solved.ac"]}
---


# [ 개발 문제풀이 ] solved.ac - CLASS 1

오늘은 백준의 solved.ac (백준의 티어?) 사이트에 있는 CLASS 1을 밀어볼 것이다.

![image01](/assets/uploads/tistory-05-01.png)

전에 풀어놓은 문제가 좀 있지만 남은게 더 많다. 우선 싹 밀어버리자.

1152번 - 단어의 개수

![image02](/assets/uploads/tistory-05-02.png)

그냥 단어가 몇 개인지 새면 되는 것 같다.

```python
sentence = str(input())
n = 0
for word in sentence.split():
    n += 1

print(n)
```

2439번 - 별 찍기 - 2

![image03](/assets/uploads/tistory-05-03.png)

for문을 이용해서 풀면 된다.

```python
n = int(input())

for i in range(n+1, 1, -1):
    for j in range(i-2):
        print(" ", end="")
    for k in range(n+2-i):
        print("*", end="")
    print("")
```

2562번 - 최댓값

![image04](/assets/uploads/tistory-05-04.png)

리스트를 이용해서 풀어보았다.

```python
num_list = [0 for i in range(9)]
for i in range(9):
    num_list[i] = int(input())
print(max(num_list), num_list.index(max(num_list))+1)
```

2577번 - 숫자의 개수

![image05](/assets/uploads/tistory-05-05.png)

for문과 리스트를 이용해서 풀어보았다.

```python
n = 1
for i in range(3):
    x = int(input())
    n *= x
n_list = [int(i) for i in str(n)]
for i in range(10):
    print(n_list.count(i))
```

2675번 - 문자열 반복

![image06](/assets/uploads/tistory-05-06.png)

for문과 문자열을 잘 이용하면 된다.

```python
for i in range(int(input())):
    a, b = map(str, input().split())
    for j in str(b):
        print(j * int(a), end = "")
    print()
```

2739번 - 구구단

![image07](/assets/uploads/tistory-05-07.png)

format만 잘 맞추면 풀린다.

```python
n = int(input())
for i in range(1, 10):
    print(f'{n} * {i} = {n*i}')
```

2741번 - N  찍기

![image08](/assets/uploads/tistory-05-08.png)

사실 이런걸 왜 풀어야 하는지 아직도 잘 모르겠지만 우선 싹 밀어보자.

```python
for i in range(1, int(input())+1): print(i)
```

2753번 - 윤년

![image09](/assets/uploads/tistory-05-09.png)

이 문제를 풀면서 제일 어려운건 아마 윤년이 뭔지를 아냐 모르냐의 차이일 것 같다.

```python
n = int(input())

if (n % 400 == 0) or (n % 4 == 0 and n % 100 != 0):
    print(1)
else: print(0)
```

우선 CLASS 1은 땄는데 뭐 에센셜이니 뭐니 별이 달려 있으면 좀 더 높은 CLASS 1인 거 같은데 이건 넘 귀찮으니 나중에 하는 걸로 해야겠다.

![image10](/assets/uploads/tistory-05-10.png)

다음엔 CLASS1\*까지 미는 걸로~.~
