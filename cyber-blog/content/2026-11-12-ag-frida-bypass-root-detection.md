---
{"title":"bypass-root-detection.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/bypass-root-detection.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/bypass-root-detection.js` · 사용한 Frida 스크립트.

<pre><code>// 루트 탐지 우회: 앱이 su 파일 존재 여부를 java.io.File.exists() 로 확인한다.
// su 경로일 때만 false 를 돌려주어, 다른 파일 동작은 건드리지 않는다.
Java.perform(function () {
    var File = Java.use(&quot;java.io.File&quot;);
    File.exists.implementation = function () {
        var path = this.getAbsolutePath();
        if (path.indexOf(&quot;su&quot;) !== -1 || path.indexOf(&quot;Superuser&quot;) !== -1 ||
            path.indexOf(&quot;supersu&quot;) !== -1 || path.indexOf(&quot;xposed&quot;) !== -1) {
            console.log(&quot;[root-bypass] File.exists(&quot; + path + &quot;) → false (원래 &quot; + this.exists() + &quot;)&quot;);
            return false;
        }
        return this.exists();
    };

    // 앱의 isRooted() 자체도 직접 후킹 (이중 안전장치)
    try {
        var Act = Java.use(&quot;owasp.sat.agoat.RootDetectionActivity&quot;);
        Act.isRooted.implementation = function () {
            console.log(&quot;[root-bypass] RootDetectionActivity.isRooted() → false&quot;);
            return false;
        };
    } catch (e) {}
    console.log(&quot;[*] root detection bypass loaded&quot;);
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
