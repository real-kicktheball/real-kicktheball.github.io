---
{"title":"00_src_network_security_config.xml","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"01_network/00_src_network_security_config.xml · 앱 설정 원본 (XML) — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `01_network/00_src_network_security_config.xml` · 앱 설정 원본 (XML).

<pre><code>&lt;?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?&gt;
&lt;network-security-config&gt;
    &lt;base-config cleartextTrafficPermitted=&quot;true&quot;&gt;
        &lt;trust-anchors&gt;
            &lt;certificates src=&quot;system&quot; /&gt;
            &lt;certificates src=&quot;user&quot; /&gt;
        &lt;/trust-anchors&gt;
    &lt;/base-config&gt;

  &lt;domain-config&gt;
       &lt;domain includeSubdomains=&quot;true&quot;&gt;cve.org&lt;/domain&gt;
       &lt;pin-set expiration=&quot;2050-01-01&quot;&gt;
           &lt;pin digest=&quot;SHA-256&quot;&gt;p4si93w2lTZdXU4lAa2VaonZlK406ZHmkjeAn5vXiHA=&lt;/pin&gt;
           &lt;pin digest=&quot;SHA-256&quot;&gt;DxH4tt40L+eduF6szpY6TONlxhZhBd+pJ9wbHlQ2fuw=&lt;/pin&gt;
           &lt;pin digest=&quot;SHA-256&quot;&gt;++MBgDH5WGvL9Bcn5Be30cRcL0f5O+NyoXuWtQdX1aI=&lt;/pin&gt;
       &lt;/pin-set&gt;
   &lt;/domain-config&gt;
&lt;/network-security-config&gt;


</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
