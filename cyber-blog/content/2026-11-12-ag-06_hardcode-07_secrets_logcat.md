---
{"title":"07_secrets_logcat.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"06_hardcode/07_secrets_logcat.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `06_hardcode/07_secrets_logcat.txt` · 콘솔·로그 기록.

<pre><code>﻿# CloudServices 와 AIChat 은 키를 logcat 에도 출력 (Log.d)
PS&gt; adb logcat -d | findstr /i &quot;AWS OpenAI&quot;
11-12 04:10:26.095 13370 13370 D [Info]  : Connected to AWS account using Access key AKIAX56QK…Q7G7ABC and secret key OviCwsFN…+lOABCw
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
