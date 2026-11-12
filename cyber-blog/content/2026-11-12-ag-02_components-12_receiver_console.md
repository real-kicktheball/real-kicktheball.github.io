---
{"title":"12_receiver_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"02_components/12_receiver_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `02_components/12_receiver_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# 앱이 백그라운드(홈 화면)인 상태, 일반 권한(uid 2000)으로 리시버를 명시적으로 호출
PS&gt; adb shell su shell am broadcast -n owasp.sat.agoat/.ShowDataReceiver
Broadcasting: Intent { flg=0x400000 cmp=owasp.sat.agoat/.ShowDataReceiver }
Broadcast completed: result=0
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
