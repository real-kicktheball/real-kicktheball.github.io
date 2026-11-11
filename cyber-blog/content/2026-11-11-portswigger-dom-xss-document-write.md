---
{"title":"DOM XSS in document.write sink using source location.search","date":"2026-11-11","category":"ctf","tags":["postswigger"],"summary":"DOM XSS","section":["PortSwigger"]}
---


# [ 보안 문제풀이 ] PostSwigger - DOM XSS in document.write sink using source location.search

이번에 괜찮은 보안문제 사이트를 발견해서 풀어보려고 한다.

[https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink)

 [Web Application Security, Testing, & Scanning - PortSwigger

PortSwigger offers tools for web application security, testing, & scanning. Choose from a range of security tools, & identify the very latest vulnerabilities.

portswigger.net](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink)

![image01](/assets/uploads/tistory-12-01.png)

ACCESS THE LAB 버튼을 누르면 개인 링크로 이동한다.

간단히 해석을 해보면, 웹 페이지의 검색어 추적 기능에서 발생하는 DOM 기반 교차 사이트 스크립팅 (DOM-based XSS) 취약점을 다루고 있습니다.

1\. 주요 취약점 설명

\- 원인 : 이 사이트는 자바스크립트의 "document.write" 함수를 사용합니다. 이 함수는 데이터를 페이지에 직접 써넣는 기능을 함.

\- 문제점 : "document.write" 함수가 호출될 때 사용하는 데이터가 "location.search"에서 옴.

\- 공격 포인트 : "location.search"는 웹사이트 URL의 쿼리 스트링 (예 : ?search=keyword) 부분을 의미하며, 사용자가 URL을 통해 직접 제어할 수 있는 영역임.

2\. 공격 메커니즘

공격자가 URL 뒤에 악의적인 스크립트를 포함시켜 접속하면, 브라우저는 이를 일반적인 검색어로 인식하지 않고 실행 가능한 자바스크립트 코드로 처리하여 실행함.

3\. 목표

\- 미션 : "alert" 함수를 호출하여 XSS 공격을 수행하기

\- 성공 시 : 브라우저 화면에 경고창이 나타나면 랩이 완료

그럼 우선 메인 페이지의 html 소스부터 확인해보자

```html
<!DOCTYPE html>
<html>
<!--LAB_HEAD_START-->
    <head>
        <link href=/resources/labheader/css/academyLabHeader.css rel=stylesheet>
        <link href=/resources/css/labsBlog.css rel=stylesheet>
        <title>DOM XSS in document.write sink using source location.search</title>
    </head>
<!--LAB_HEAD_END-->
    <body>
        <script src="/resources/labheader/js/labHeader.js"></script>
        <!--LAB_HEADER_START-->
        <div id="academyLabHeader">
            <section class='academyLabBanner'>
                <div class=container>
                    <div class=logo></div>
                        <div class=title-container>
                            <h2>DOM XSS in <code>document.write</code> sink using source <code>location.search</code></h2>
                            <a class=link-back href='https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink'>
                                Back&nbsp;to&nbsp;lab&nbsp;description&nbsp;
                                <svg version=1.1 id=Layer_1 xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x=0px y=0px viewBox='0 0 28 30' enable-background='new 0 0 28 30' xml:space=preserve title=back-arrow>
                                    <g>
                                        <polygon points='1.4,0 0,1.2 12.6,15 0,28.8 1.4,30 15.1,15'></polygon>
                                        <polygon points='14.3,0 12.9,1.2 25.6,15 12.9,28.8 14.3,30 28,15'></polygon>
                                    </g>
                                </svg>
                            </a>
                        </div>
                        <div class='widgetcontainer-lab-status is-notsolved'>
                            <span>LAB</span>
                            <p>Not solved</p>
                            <span class=lab-status-icon></span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <!--LAB_HEADER_END-->
        <div theme="blog">
            <section class="maincontainer">
                <div class="container is-page">
                    <header class="navigation-header">
                        <section class="top-links">
                            <a href=/>Home</a><p>|</p>
                        </section>
                    </header>
                    <header class="notification-header">
                    </header>
                    <section class="blog-header">
                        <img src="/resources/images/blog.svg">
                    </section>
                    <section class=search>
                        <form action=/ method=GET>
                            <input type=text placeholder='Search the blog...' name=search>
                            <button type=submit class=button>Search</button>
                        </form>
                    </section>
                    <section class="blog-list">
                        <div class="blog-post">
                        <a href="/post?postId=4"><img src="/image/blog/posts/46.jpg"></a>
                        <h2>Stag Do's</h2>
                        <p>Whenever a friend or relative announces their engagement, there is always one burning question that isn't really asked straight away out of politeness for the bride to be. While you're stood their feigning interest and enthusiasm for yet another wedding...</p>
                        <a class="button is-small" href="/post?postId=4">View post</a>
                        </div>
                        <div class="blog-post">
                        <a href="/post?postId=5"><img src="/image/blog/posts/51.jpg"></a>
                        <h2>Favours</h2>
                        <p>Favours are a tricky thing. Some people seem to ask for them all the time, some people hardly ever do and some people outright refuse to ever ask for one as they don't want to end up owing someone.</p>
                        <a class="button is-small" href="/post?postId=5">View post</a>
                        </div>
                        <div class="blog-post">
                        <a href="/post?postId=3"><img src="/image/blog/posts/44.jpg"></a>
                        <h2>If I Close My Eyes You Can't See Me</h2>
                        <p>A young man in Ohio was shocked to discover his Mom and Grandma had been witness to his inappropriate online behavior. Forgetting how everyone you have in your friendship circle is inextricably connected on social media, he didn't hold back...</p>
                        <a class="button is-small" href="/post?postId=3">View post</a>
                        </div>
                        <div class="blog-post">
                        <a href="/post?postId=2"><img src="/image/blog/posts/54.jpg"></a>
                        <h2>The First Ever Truly Eco Car Has Made It To Market</h2>
                        <p>Forget electricity, we know that's still a drain on the National Grid. Some clever little inventors in Ohio have come up with a way of getting your car moving with nothing but air. And better still, air from your own...</p>
                        <a class="button is-small" href="/post?postId=2">View post</a>
                        </div>
                        <div class="blog-post">
                        <a href="/post?postId=1"><img src="/image/blog/posts/43.jpg"></a>
                        <h2>New Year - New Friends</h2>
                        <p>It's always the same. A new year begins and those people you thought were your friends go, well, a bit weird. Your nearest and dearest, between them, have a very long list of things they want to change about themselves....</p>
                        <a class="button is-small" href="/post?postId=1">View post</a>
                        </div>
                    </section>
                </div>
            </section>
            <div class="footer-wrapper">
            </div>
        </div>
    </body>
</html>
```

딱히 언급한 취약점은 노출되어 있지 않지만, 태그를 닫고 alert 창을 띄우면 되기 때문에 제일 간단하게 해볼 수 있는건 검색창에 alert 구문을 넣는 방법이 있다.

```html
"><script>alert(1)</script>
```

이렇게 입력하게 되면 예상되는 작동하는 구문은 밑과 같다.

```html
document.write('<img src="/resources/images/tracker.gif?search=' + query + '">');
```

![image02](/assets/uploads/tistory-12-02.png)

간단하게 풀렸다.
