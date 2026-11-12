---
{"title":"bypass-okhttp3-pinning.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/bypass-okhttp3-pinning.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/bypass-okhttp3-pinning.js` · 사용한 Frida 스크립트.

<pre><code>// OkHttp3 CertificatePinner 우회 (AndroGoat, okhttp 4.9.3)
// 스택 트레이스에서 확인한 실제 검증 지점: okhttp3.CertificatePinner.check$okhttp(CertificatePinner.kt:200)
Java.perform(function () {
    var CP = Java.use(&quot;okhttp3.CertificatePinner&quot;);

    // okhttp 4.x 내부 검증 함수 (실제 네트워크 경로)
    CP[&quot;check$okhttp&quot;].implementation = function (hostname, certsFn) {
        console.log(&quot;[bypass] CertificatePinner.check$okhttp(&quot; + hostname + &quot;) → skip&quot;);
        // 아무것도 하지 않고 반환 = 핀 불일치 예외를 던지지 않음
    };

    // 공개 API check(String, List) 오버로드도 함께 무력화
    CP.check.overloads.forEach(function (ov) {
        ov.implementation = function (hostname) {
            console.log(&quot;[bypass] CertificatePinner.check(&quot; + hostname + &quot;) → skip&quot;);
        };
    });

    console.log(&quot;[*] OkHttp3 CertificatePinner bypass loaded&quot;);
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
