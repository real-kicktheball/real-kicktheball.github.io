---
{"title":"01_apk_dex_strings.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"06_hardcode/01_apk_dex_strings.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `06_hardcode/01_apk_dex_strings.txt` · 콘솔·로그 기록.

<pre><code>﻿# APK 추출 및 압축 해제 후 DEX 문자열 검색 (디컴파일 없이, grep 수준)
PS&gt; adb pull &lt;base.apk&gt;  →  6,964,065 bytes
dex files: classes.dex, classes2.dex, classes3.dex, classes4.dex, classes5.dex

[AWS Access Key ID (CloudServices)]
   AKIA[0-9A-Z]{16}  →  AKIAX56QK…Q7G7ABC   (classes4.dex)
[OpenAI API Key (AIChat)]
   sk-[a-z0-9]{40}  →  sk-abcdef…abcdef12   (classes4.dex)
[Promo Code (HardCode)]
   NEW2019  →  NEW2019   (classes4.dex)
[AWS Region]
   ap-south-2  →  ap-south-2   (classes4.dex)

# AWS Secret Key는 40자 영숫자라 패턴이 넓으므로, 알려진 접두어로 확인
[AWS Secret Access Key]  →  OviCwsFN…+lOABCw  (classes4.dex)
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
