---
{"title":"11_service_foreground_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"02_components/11_service_foreground_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `02_components/11_service_foreground_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# [2] 앱이 화면에 떠 있는(포그라운드) 상태 - 메인 화면, PIN 입력 안 함
PS&gt; adb shell dumpsys activity activities | findstr topResumedActivity
topResumedActivity=ActivityRecord{412ebd4 u0 owasp.sat.agoat/.SplashActivity} t14}
PS&gt; adb shell su shell am startservice -n owasp.sat.agoat/.DownloadInvoiceService
Starting service: Intent { cmp=owasp.sat.agoat/.DownloadInvoiceService }
--- logcat (DOWNLOAD 태그)
--------- beginning of main
11-12 03:48:14.920  7754  7754 I DOWNLOAD: Service onCreate
11-12 03:48:14.923  7754  7754 I DOWNLOAD: Invoice is being downloaded
11-12 03:48:14.930  7754  7754 I DOWNLOAD: Service onDestroy
--- 다운로드 폴더
PS&gt; adb shell ls -l /sdcard/Download/
total 8
-rw-rw---- 1 u0_a165 media_rw 72 2026-11-12 03:48 1794455294923_invoice.txt
PS&gt; adb shell cat /sdcard/Download/*_invoice.txt
This is invoice for product purchased on Aug 12th.



Thanks,

AndroGoat
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
