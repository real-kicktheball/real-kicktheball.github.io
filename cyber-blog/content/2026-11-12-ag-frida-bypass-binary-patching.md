---
{"title":"bypass-binary-patching.js","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"frida/bypass-binary-patching.js · 사용한 Frida 스크립트 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `frida/bypass-binary-patching.js` · 사용한 Frida 스크립트.

<pre><code>// Binary Patching 목표를 Frida(동적)로 달성: 이미 떠 있는 화면의 관리자 UI를 켠다.
// 앱 코드: private val isAdmin = false → if(isAdmin){ 관리자 UI 활성화 }
Java.perform(function () {
    var Color = Java.use(&quot;android.graphics.Color&quot;);
    var R_id = Java.use(&quot;owasp.sat.agoat.R$id&quot;);
    var JString = Java.use(&quot;java.lang.String&quot;);
    var TextView = Java.use(&quot;android.widget.TextView&quot;);
    var Button = Java.use(&quot;android.widget.Button&quot;);

    Java.choose(&quot;owasp.sat.agoat.BinaryPatchingActivity&quot;, {
        onMatch: function (act) {
            Java.scheduleOnMainThread(function () {
                try {
                    var tv = Java.cast(act.findViewById(R_id.isAdminText.value), TextView);
                    var btn = Java.cast(act.findViewById(R_id.adminButton.value), Button);
                    tv.setText(Java.cast(JString.$new(&quot;You are Admin Now&quot;), Java.use(&quot;java.lang.CharSequence&quot;)));
                    btn.setEnabled(true);
                    btn.setBackgroundColor(Color.parseColor(&quot;#000000&quot;));
                    btn.setTextColor(Color.parseColor(&quot;#FFFFFF&quot;));
                    console.log(&quot;[binary-patch] isAdmin=false 분기를 무시하고 관리자 UI 활성화&quot;);
                } catch (e) { console.log(&quot;err &quot; + e); }
            });
        },
        onComplete: function () { console.log(&quot;[*] done&quot;); }
    });
});
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
