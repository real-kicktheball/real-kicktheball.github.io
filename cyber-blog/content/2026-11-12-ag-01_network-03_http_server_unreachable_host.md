---
{"title":"03_http_server_unreachable_host.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"01_network/03_http_server_unreachable_host.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `01_network/03_http_server_unreachable_host.txt` · 콘솔·로그 기록.

<pre><code>﻿PS&gt; Resolve-DnsName demo.testfire.net
65.61.137.117
PS&gt; Test-NetConnection demo.testfire.net -Port 80
TcpTestSucceeded : False
PS&gt; Invoke-WebRequest http://demo.testfire.net
원격 서버에 연결할 수 없습니다.
(측정 시각: 2026-11-12 12:34:52)
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
