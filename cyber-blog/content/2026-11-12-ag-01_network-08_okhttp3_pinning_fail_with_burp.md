---
{"title":"08_okhttp3_pinning_fail_with_burp.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"01_network/08_okhttp3_pinning_fail_with_burp.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `01_network/08_okhttp3_pinning_fail_with_burp.txt` · 콘솔·로그 기록.

<pre><code>﻿11-12 03:37:18.609  2943  6316 W System.err: javax.net.ssl.SSLPeerUnverifiedException: Certificate pinning failure!
11-12 03:37:18.609  2943  6316 W System.err:   Peer certificate chain:
11-12 03:37:18.609  2943  6316 W System.err:     sha256/+eAu61/6eXvVCu8HvvaZa3yaFwzhTzrIHu+smxfBc8Y=: CN=owasp.org,OU=PortSwigger CA,O=PortSwigger,C=PortSwigger
11-12 03:37:18.609  2943  6316 W System.err:     sha256/q9Zol+1GOClkI9FHjRM9+TZQSY26lKwQHUlIAqw7Pyo=: CN=PortSwigger CA,OU=PortSwigger CA,O=PortSwigger,L=PortSwigger,ST=PortSwigger,C=PortSwigger
11-12 03:37:18.610  2943  6316 W System.err:   Pinned certificates for owasp.org:
11-12 03:37:18.610  2943  6316 W System.err:     sha256/5gsjyidrmWjcLRClfCk+Dd6O0nx1CyFrVUW5wVkwEx0=
11-12 03:37:18.610  2943  6316 W System.err:     sha256/kIdp6NNEd8wsugYyyIYFsi1ylMCED3hZbSR8ZFsa/A4=
11-12 03:37:18.610  2943  6316 W System.err:     sha256/mEflZT5enoR1FuXLgYYGqnVEoZvmf9c2bVBpiOjYQ0c=
11-12 03:37:18.610  2943  6316 W System.err: 	at okhttp3.CertificatePinner.check$okhttp(CertificatePinner.kt:200)
11-12 03:37:18.611  2943  6316 W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
11-12 03:37:18.611  2943  6316 W System.err: 	at okhttp3.internal.cache.CacheInterceptor.intercept(CacheInterceptor.kt:95)
11-12 03:37:18.612  2943  6316 W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
11-12 03:37:18.612  2943  6316 W System.err: 	at okhttp3.internal.http.BridgeInterceptor.intercept(BridgeInterceptor.kt:83)
11-12 03:37:18.612  2943  6316 W System.err: 	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
