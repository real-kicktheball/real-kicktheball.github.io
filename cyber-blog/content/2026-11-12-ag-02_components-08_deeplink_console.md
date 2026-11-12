---
{"title":"08_deeplink_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"02_components/08_deeplink_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `02_components/08_deeplink_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# 앱 종료 후 홈 화면 상태에서, 패키지 이름도 클래스 이름도 지정하지 않고 URL만 던진다
PS&gt; adb shell su shell am start -a android.intent.action.VIEW -d androgoat://vulnapp
Starting: Intent { act=android.intent.action.VIEW dat=androgoat://vulnapp/... }
Status: ok
LaunchState: COLD
Activity: owasp.sat.agoat/.AccessControl1ViewActivity
TotalTime: 762
WaitTime: 769
Complete
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
