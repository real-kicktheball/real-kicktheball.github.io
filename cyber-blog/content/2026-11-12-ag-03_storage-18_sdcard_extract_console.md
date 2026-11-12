---
{"title":"18_sdcard_extract_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"03_storage/18_sdcard_extract_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `03_storage/18_sdcard_extract_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# 앱 로그가 저장 경로까지 알려 줌
PS&gt; adb logcat -d -s Info:I System.out:I
11-12 03:55:14.430  9453  9453 I System.out: userinfo /storage/emulated/0/Android/data/owasp.sat.agoat/files/users3034063995996941852_tmp
11-12 03:55:14.434  9453  9453 I Info    : Data saved to/storage/emulated/0/Android/data/owasp.sat.agoat/files/users3034063995996941852_tmp

# [1] adb 일반 권한(shell)에서 외부 저장소 읽기 - root/run-as 불필요
PS&gt; adb shell su shell ls -l /sdcard/Android/data/owasp.sat.agoat/files
total 8
-rw-rw---- 1 u0_a174 ext_data_rw 105 2026-11-12 03:55 users3034063995996941852_tmp
PS&gt; adb shell su shell sh -c &#x27;cat /sdcard/Android/data/owasp.sat.agoat/files/users*_tmp&#x27;
This data is stored in SdCard on Thu Nov 12 03:55:14 GMT 2026: 
 Username - dave Password -D4ve_Ext3rnal
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
