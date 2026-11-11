---
{"title":"Kali Linux 한글패치 (ibus, fcitx)","date":"2026-11-11","category":"writing","tags":["fcitx","ibus","kali","한글"],"summary":"Kali 한글 입력","section":[]}
---


# [ 운영체제 ] Kali Linux 한글패치 (ibus, fcitx)

칼리리눅스를 설치할 때 한글 패치를 하지 않으면 한글이 깨져서 나온다.

![image01](/assets/uploads/tistory-09-01.png)

패치하기 전의 사진을 못 구해서 대충 인터넷에 돌아다니는 사진을 가지고 왔다.

한글을 설치 단계에서 깔았음에도 깨지는 이유는 칼리리눅스에 내장된 폰트가 한글을 포함하지 않기 때문이다.

따라서 한국어 자체를 설치해도 표현할 방법이 없다.

그래서 사용자가 별개로 폰트를 설치하고 Input을 처리해주는 툴을 설치해서 관리해야 한다.

보통은 fcitx를 많이 사용하는데 문제가 발생해서 ibus로 대체했다.

![image02](/assets/uploads/tistory-09-02.png)

그 문제는 im-config가 fcitx를 인식하지 못해서 입력기로 설정하지 못했다.

따라서 다른 입력기(ibus)를 설정해서 한글을 원활히 사용하게 했다.

우선, 한글을 읽는 것조차 안되기 때문에 폰트를 다운로드 해야한다.

```bash
sudo apt update
sudo apt install ibus ibus-hangul
sudo apt install fonts-nanum*
```

아마 나눔 폰트를 다운로드 하면 한글을 읽는 것은 가능해질 것이다.

입력 처리를 위해서 터미널에 im-config를 입력해서 입력기 설정에 들어간 뒤 기본 입력기로 ibus를 설정해준다.

```bash
reboot
```

여기까지 완료되면 입력기 설정도 완료된다. (입력기 설정은 재시작 이후에 적용)

그리고 영어도 입력할 일이 많기 때문에 영어도 패턴(?)에 추가해줘야 한다.

![image03](/assets/uploads/tistory-09-03.png)

ibus config에 들어가게 되면 추가 버튼을 통해 다른 언어를 추가하는 것도 가능하다.
