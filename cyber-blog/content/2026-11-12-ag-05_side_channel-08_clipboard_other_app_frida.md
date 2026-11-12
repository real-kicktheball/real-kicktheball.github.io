---
{"title":"08_clipboard_other_app_frida.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"05_side_channel/08_clipboard_other_app_frida.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `05_side_channel/08_clipboard_other_app_frida.txt` · 콘솔·로그 기록.

<pre><code>﻿# Chrome 프로세스를 &#x27;다른 앱&#x27;으로 가정하고, 그 안에서 ClipboardManager.getPrimaryClip() 호출

## [1] Chrome 이 백그라운드 (AndroGoat 가 화면에 있음)
[com.android.chrome] getPrimaryClip() = null (접근 거부)

logcat:
  11-12 04:04:31.673   542  2136 E ClipboardService: Denying clipboard access to com.android.chrome, application is not in focus nor is it a system service for user 0
## [2] Chrome 이 포그라운드 (사용자가 Chrome 으로 전환)
[com.android.chrome] label=host clipboard  text=1376

logcat:
  11-12 04:04:41.961   542  2139 I ClipboardService: Chrome pasted from your clipboard
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
