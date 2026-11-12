---
{"title":"07_sp2_tamper_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"03_storage/07_sp2_tamper_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `03_storage/07_sp2_tamper_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# 정상 플레이: SCORE 버튼 1회 = +1점, 10000점 초과해야 승리
PS&gt; adb shell run-as owasp.sat.agoat cat shared_prefs/score.xml
&lt;?xml version=&#x27;1.0&#x27; encoding=&#x27;utf-8&#x27; standalone=&#x27;yes&#x27; ?&gt;
&lt;map&gt;
    &lt;int name=&quot;score&quot; value=&quot;3&quot; /&gt;
    &lt;int name=&quot;level&quot; value=&quot;1&quot; /&gt;
&lt;/map&gt;

# 앱 종료(메모리 캐시 제거) 후 run-as 로 파일 직접 수정
PS&gt; adb shell am force-stop owasp.sat.agoat
PS&gt; adb shell run-as owasp.sat.agoat sed -i &#x27;s/name=\&quot;score\&quot; value=\&quot;[0-9]*\&quot;/name=\&quot;score\&quot; value=\&quot;10000\&quot;/&#x27; shared_prefs/score.xml
PS&gt; adb shell run-as owasp.sat.agoat cat shared_prefs/score.xml
&lt;?xml version=&#x27;1.0&#x27; encoding=&#x27;utf-8&#x27; standalone=&#x27;yes&#x27; ?&gt;
&lt;map&gt;
    &lt;int name=&quot;score&quot; value=&quot;10000&quot; /&gt;
    &lt;int name=&quot;level&quot; value=&quot;1&quot; /&gt;
&lt;/map&gt;
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
