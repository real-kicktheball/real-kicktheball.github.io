---
{"title":"log-okhttp-failure.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/log-okhttp-failure.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/log-okhttp-failure.js` · 사용한 Frida 스크립트.

<pre><code>// TrafficActivity.run()의 빈 onFailure 콜백을 후킹해서 숨겨진 예외를 출력
Java.perform(function () {
    var Cb = Java.use(&quot;owasp.sat.agoat.TrafficActivity$run$1&quot;);
    Cb.onFailure.implementation = function (call, e) {
        console.log(&quot;[onFailure] &quot; + call.request().url().toString());
        console.log(&quot;  &quot; + e.toString());
        var cause = e.getCause();
        while (cause !== null) {
            console.log(&quot;  caused by: &quot; + cause.toString());
            cause = cause.getCause();
        }
        return this.onFailure(call, e);
    };
    Cb.onResponse.implementation = function (call, resp) {
        console.log(&quot;[onResponse] &quot; + call.request().url().toString() + &quot; -&gt; HTTP &quot; + resp.code());
        return this.onResponse(call, resp);
    };
    console.log(&quot;[*] hooked TrafficActivity$run$1.onFailure - NATIVE 버튼을 누르세요&quot;);
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
