---
{"title":"04_static_patch_note.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"09_binary_patching/04_static_patch_note.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `09_binary_patching/04_static_patch_note.txt` · 콘솔·로그 기록.

<pre><code>﻿# BinaryPatchingActivity 의 isAdmin 분기를 DEX 바이트코드 수준에서 확인
# (실제 바이너리 패칭 = isAdmin 초기화 const/4 vX,0x0 → 0x1 로 변경하는 작업)

found class in classes4.dex
  문자열 &#x27;You are Admin Now&#x27; @ offset 71622 → if(isAdmin) 분기 안에 위치

# 정적 패칭 절차(참고): apktool d base.apk → smali 에서
#   .field private final isAdmin:Z 초기화 부분의 const/4 vX, 0x0 을 0x1 로 변경
#   → apktool b → 재서명(apksigner) → 재설치
# 이번 실습에서는 동일 효과를 Frida(동적)로 달성함
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
