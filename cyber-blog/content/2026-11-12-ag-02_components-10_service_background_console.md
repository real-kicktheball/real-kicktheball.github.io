---
{"title":"10_service_background_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"02_components/10_service_background_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `02_components/10_service_background_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# [1] 앱이 꺼져 있는(백그라운드) 상태
PS&gt; adb shell su shell am startservice -n owasp.sat.agoat/.DownloadInvoiceService
Starting service: Intent { cmp=owasp.sat.agoat/.DownloadInvoiceService }
Error: app is in background uid null
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
