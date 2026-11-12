---
{"title":"05_pin_md5_crack.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"03_storage/05_pin_md5_crack.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `03_storage/05_pin_md5_crack.txt` · 콘솔·로그 기록.

<pre><code>﻿PS&gt; adb shell run-as owasp.sat.agoat cat shared_prefs/pinDetails.xml
&lt;?xml version=&#x27;1.0&#x27; encoding=&#x27;utf-8&#x27; standalone=&#x27;yes&#x27; ?&gt;
&lt;map&gt;
    &lt;boolean name=&quot;pinSet&quot; value=&quot;true&quot; /&gt;
    &lt;string name=&quot;pin&quot;&gt;88cf91a1aef212f3c2cd12406983427d&lt;/string&gt;
&lt;/map&gt;

# 저장된 값 = MD5(PIN), 솔트 없음. 4자리 PIN 0000~9999 전수 대입
target md5 : 88cf91a1aef212f3c2cd12406983427d
cracked PIN: 7391   (시도 7392회, 0.74초)
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
