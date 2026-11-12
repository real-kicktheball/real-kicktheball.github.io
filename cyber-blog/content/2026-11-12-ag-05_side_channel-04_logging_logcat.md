---
{"title":"04_logging_logcat.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"05_side_channel/04_logging_logcat.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `05_side_channel/04_logging_logcat.txt` · 콘솔·로그 기록.

<pre><code>﻿# USB 디버깅이 연결된 PC에서 로그만 읽어도 비밀번호가 나온다
PS&gt; adb logcat -d --pid=11992 | findstr /i &quot;Password&quot;
11-12 04:03:19.285 11992 11992 I Info:   : Username: erin and Password: Er1n_L0gged! are verified
11-12 04:03:19.285 11992 11992 I System.out: Username: erin and Password: Er1n_L0gged! are verified

# [대조] 일반 앱 UID 로는 다른 앱 로그를 읽을 수 없음 (READ_LOGS 는 시스템 권한)
PS&gt; adb shell su 10125 logcat -d -s Info::I
(출력 줄 수: 0)
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
