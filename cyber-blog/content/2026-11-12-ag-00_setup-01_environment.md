---
{"title":"01_environment.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"00_setup/01_environment.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `00_setup/01_environment.txt` · 콘솔·로그 기록.

<pre><code>﻿PS&gt; adb devices
List of devices attached
emulator-5554	device

PS&gt; adb shell getprop ro.build.version.release / sdk / product
13
33
sdk_gphone64_x86_64
PS&gt; adb shell whoami
root
PS&gt; frida --version
17.26.2
PS&gt; adb shell pidof frida-server
6393
PS&gt; frida-ps -U | findstr AndroGoat

2943  AndroGoat - Insecure App (Kotlin)  owasp.sat.agoat                        
PS&gt; adb shell ls -l /system/etc/security/cacerts/9a5ba575.0
-rw-r--r-- 1 root root 1391 2026-11-12 03:07 /system/etc/security/cacerts/9a5ba575.0
PS&gt; adb shell settings get global http_proxy
10.0.2.2:8080
PS&gt; adb shell dumpsys package owasp.sat.agoat (요약)
    versionCode=1 minSdk=19 targetSdk=33
    versionName=1.0
    pkgFlags=[ DEBUGGABLE HAS_CODE ALLOW_CLEAR_USER_DATA TEST_ONLY ALLOW_BACKUP ]


</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
