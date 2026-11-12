---
{"title":"bypass-nsc-pinning.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/bypass-nsc-pinning.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/bypass-nsc-pinning.js` · 사용한 Frida 스크립트.

<pre><code>// Network Security Config(&lt;pin-set&gt;) 피닝 우회 (Android 13)
// OS가 핀을 검사하는 곳: android.security.net.config.NetworkSecurityTrustManager.checkPins(List)
// + 결과 확인용: AndroGoat의 빈 onFailure / onResponse 콜백 로깅
Java.perform(function () {
    var NSTM = Java.use(&quot;android.security.net.config.NetworkSecurityTrustManager&quot;);
    NSTM.checkPins.implementation = function (chain) {
        console.log(&quot;[bypass] NetworkSecurityTrustManager.checkPins(&quot; + chain.size() + &quot; certs) → skip&quot;);
        // 반환만 하고 핀 불일치 예외를 던지지 않음
    };

    var Cb = Java.use(&quot;owasp.sat.agoat.TrafficActivity$run$1&quot;);
    Cb.onFailure.implementation = function (call, e) {
        console.log(&quot;[onFailure] &quot; + call.request().url().toString() + &quot;  &quot; + e.toString());
        return this.onFailure(call, e);
    };
    Cb.onResponse.implementation = function (call, resp) {
        console.log(&quot;[onResponse] &quot; + call.request().url().toString() + &quot; -&gt; HTTP &quot; + resp.code());
        return this.onResponse(call, resp);
    };
    console.log(&quot;[*] NSC pinning bypass loaded&quot;);
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
