---
{"title":"16_ime_inputtype.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"05_side_channel/16_ime_inputtype.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `05_side_channel/16_ime_inputtype.txt` · 콘솔·로그 기록.

<pre><code>﻿# 키보드(Gboard)가 받은 입력칸 정보 (EditorInfo.inputType)
# Keyboard Cache 화면 - username / password 칸을 차례로 터치
11-12 04:05:14.840  inputType=0x20001(Normal) fieldId=2131296799
11-12 04:05:18.712  inputType=0x20001(Normal) fieldId=2131296645

# [비교] Insecure Logging 화면의 password 칸 (android:inputType=&quot;textPassword&quot;)
inputType=0x81(Password)  → Gboard: PasswordIme.onActivate() (학습/추천 안 함)
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
