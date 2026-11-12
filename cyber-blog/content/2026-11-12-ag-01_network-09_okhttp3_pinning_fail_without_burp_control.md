---
{"title":"09_okhttp3_pinning_fail_without_burp_control.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"01_network/09_okhttp3_pinning_fail_without_burp_control.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `01_network/09_okhttp3_pinning_fail_without_burp_control.txt` · 콘솔·로그 기록.

<pre><code>﻿11-12 03:37:27.419  2943  6316 W System.err: javax.net.ssl.SSLPeerUnverifiedException: Certificate pinning failure!
11-12 03:37:27.419  2943  6316 W System.err:   Peer certificate chain:
11-12 03:37:27.419  2943  6316 W System.err:     sha256/vhFlNS4eYbJvUx/dl4Z4qUdwHLVehBVQrcf2TfmKzSA=: CN=owasp.org
11-12 03:37:27.419  2943  6316 W System.err:     sha256/LoMHBotttiDko50Gi13uXW71eIy7LAttI+rYT8wXF4w=: CN=YR1,O=Let&#x27;s Encrypt,C=US
11-12 03:37:27.420  2943  6316 W System.err:     sha256/fk6IOKit1ild5647BH06ujSIq5XbCgqlbYl6ANhhi88=: CN=Root YR,O=ISRG,C=US
11-12 03:37:27.420  2943  6316 W System.err:     sha256/C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M=: CN=ISRG Root X1,O=Internet Security Research Group,C=US
11-12 03:37:27.420  2943  6316 W System.err:   Pinned certificates for owasp.org:
11-12 03:37:27.420  2943  6316 W System.err:     sha256/5gsjyidrmWjcLRClfCk+Dd6O0nx1CyFrVUW5wVkwEx0=
11-12 03:37:27.420  2943  6316 W System.err:     sha256/kIdp6NNEd8wsugYyyIYFsi1ylMCED3hZbSR8ZFsa/A4=
11-12 03:37:27.420  2943  6316 W System.err:     sha256/mEflZT5enoR1FuXLgYYGqnVEoZvmf9c2bVBpiOjYQ0c=
11-12 03:37:27.420  2943  6316 W System.err: 	at okhttp3.CertificatePinner.check$okhttp(CertificatePinner.kt:200)
11-12 03:37:27.422  2943  6316 W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
11-12 03:37:27.422  2943  6316 W System.err: 	at okhttp3.internal.cache.CacheInterceptor.intercept(CacheInterceptor.kt:95)
11-12 03:37:27.423  2943  6316 W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
