---
{"title":"12_sqlite_extract_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"03_storage/12_sqlite_extract_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `03_storage/12_sqlite_extract_console.txt` · 콘솔·로그 기록.

<pre><code>﻿PS&gt; adb shell run-as owasp.sat.agoat ls -l databases/
total 56
-rw-rw---- 1 u0_a174 u0_a174 20480 2026-11-12 03:53 aGoat
-rw-rw---- 1 u0_a174 u0_a174     0 2026-11-12 03:53 aGoat-journal
-rw-rw---- 1 u0_a174 u0_a174 20480 2026-11-12 03:50 androgoat_userpins.db
-rw-rw---- 1 u0_a174 u0_a174     0 2026-11-12 03:50 androgoat_userpins.db-journal

# [1] sqlite3 로 DB 직접 조회 (root)
PS&gt; adb shell sqlite3 /data/data/owasp.sat.agoat/databases/aGoat &#x27;.tables&#x27;
android_metadata  users           
PS&gt; adb shell sqlite3 -header /data/data/owasp.sat.agoat/databases/aGoat &#x27;SELECT * FROM users;&#x27;
ID|username|password
1|bob|B0b_P4ssw0rd

# [2] run-as 로 DB 파일을 PC로 빼내기 (root 불필요)
PS&gt; adb exec-out run-as owasp.sat.agoat cat databases/aGoat &gt; aGoat.db
  → 20480 bytes, 파일 시그니처: SQLite format 3
PS&gt; (PC에서) 바이너리 안 문자열 검색
  ?Ytableusersusers
  CREATE TABLE users (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username VARCHAR, password VARCHAR)W
  %bobB0b_P4ssw0rd
  users

# [3] 앱이 쿼리 원문을 로그에도 남김 (Log.v)
PS&gt; adb logcat -d -s Query:V
11-12 03:53:49.146  8804  8804 V Query   : INSERT INTO users (username, password) VALUES(&#x27;bob&#x27;,&#x27;B0b_P4ssw0rd&#x27;)
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
