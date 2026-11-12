---
{"title":"04_sp1_extract_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"03_storage/04_sp1_extract_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `03_storage/04_sp1_extract_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# [1] run-as (debuggable 앱이라 가능)
PS&gt; adb shell run-as owasp.sat.agoat ls -l shared_prefs/
total 16
-rw-rw---- 1 u0_a174 u0_a174 178 2026-11-12 03:46 pinDetails.xml
-rw-rw---- 1 u0_a174 u0_a174 164 2026-11-12 03:52 users.xml
PS&gt; adb shell run-as owasp.sat.agoat cat shared_prefs/users.xml
&lt;?xml version=&#x27;1.0&#x27; encoding=&#x27;utf-8&#x27; standalone=&#x27;yes&#x27; ?&gt;
&lt;map&gt;
    &lt;string name=&quot;password&quot;&gt;Alic3_S3cret!&lt;/string&gt;
    &lt;string name=&quot;username&quot;&gt;alice&lt;/string&gt;
&lt;/map&gt;

# [대조] 같은 일반 권한이지만 run-as 없이 직접 접근 -&gt; 샌드박스가 막음
PS&gt; adb shell su shell cat /data/data/owasp.sat.agoat/shared_prefs/users.xml
cat: /data/data/owasp.sat.agoat/shared_prefs/users.xml: Permission denied

# [2] root
PS&gt; adb shell cat /data/data/owasp.sat.agoat/shared_prefs/users.xml   (uid=0)
&lt;?xml version=&#x27;1.0&#x27; encoding=&#x27;utf-8&#x27; standalone=&#x27;yes&#x27; ?&gt;
&lt;map&gt;
    &lt;string name=&quot;password&quot;&gt;Alic3_S3cret!&lt;/string&gt;
    &lt;string name=&quot;username&quot;&gt;alice&lt;/string&gt;
&lt;/map&gt;
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
