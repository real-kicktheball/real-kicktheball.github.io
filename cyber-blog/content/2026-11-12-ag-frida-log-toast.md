---
{"title":"log-toast.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/log-toast.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/log-toast.js` · 사용한 Frida 스크립트.

<pre><code>// Toast.makeText 로 띄우려는 문자열을 가로채서 출력 (화면에 안 보여도 앱이 무엇을 노출하려 했는지 확인)
Java.perform(function () {
    var Toast = Java.use(&quot;android.widget.Toast&quot;);
    Toast.makeText.overload(&quot;android.content.Context&quot;, &quot;java.lang.CharSequence&quot;, &quot;int&quot;).implementation = function (ctx, text, dur) {
        console.log(&quot;[Toast.makeText] &quot; + text);
        return this.makeText(ctx, text, dur);
    };
    var R = Java.use(&quot;owasp.sat.agoat.ShowDataReceiver&quot;);
    R.onReceive.implementation = function (ctx, intent) {
        console.log(&quot;[ShowDataReceiver.onReceive] intent=&quot; + intent.toString());
        return this.onReceive(ctx, intent);
    };
    console.log(&quot;[*] toast/receiver hook loaded&quot;);
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
