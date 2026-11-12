---
{"title":"bypass-emulator-detection.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/bypass-emulator-detection.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/bypass-emulator-detection.js` · 사용한 Frida 스크립트.

<pre><code>// 에뮬레이터 탐지 우회: 앱이 읽는 android.os.Build 정적 필드를 실제 단말(Pixel 7) 값으로 바꾼다.
Java.perform(function () {
    var Build = Java.use(&quot;android.os.Build&quot;);
    var spoof = {
        FINGERPRINT: &quot;google/panther/panther:13/TQ3A.230805.001/10316531:user/release-keys&quot;,
        DEVICE: &quot;panther&quot;, MODEL: &quot;Pixel 7&quot;, BRAND: &quot;google&quot;, PRODUCT: &quot;panther&quot;,
        MANUFACTURER: &quot;Google&quot;, HARDWARE: &quot;panther&quot;, BOARD: &quot;panther&quot;, HOST: &quot;abfarm&quot;,
        TAGS: &quot;release-keys&quot;, TYPE: &quot;user&quot;
    };
    for (var k in spoof) {
        try { Build[k].value = spoof[k]; } catch (e) {}
    }
    console.log(&quot;[*] Build 필드를 Pixel 7 값으로 변경&quot;);
    console.log(&quot;    MODEL=&quot; + Build.MODEL.value + &quot;  FINGERPRINT=&quot; + Build.FINGERPRINT.value);

    // 이중 안전장치: 앱의 isEmulator() 직접 후킹
    try {
        var Act = Java.use(&quot;owasp.sat.agoat.EmulatorDetectionActivity&quot;);
        Act.isEmulator.implementation = function () {
            console.log(&quot;[emu-bypass] isEmulator() → false&quot;);
            return false;
        };
    } catch (e) {}
    console.log(&quot;[*] emulator detection bypass loaded&quot;);
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
