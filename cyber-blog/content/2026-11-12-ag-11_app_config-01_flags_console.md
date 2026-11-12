---
{"title":"01_flags_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"11_app_config/01_flags_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `11_app_config/01_flags_console.txt` · 콘솔·로그 기록.

<pre><code>﻿# AndroidManifest 전역 플래그 (dumpsys)
PS&gt; adb shell dumpsys package owasp.sat.agoat | findstr flags
flags=[ DEBUGGABLE HAS_CODE ALLOW_CLEAR_USER_DATA TEST_ONLY ALLOW_BACKUP ]
privateFlags=[ PRIVATE_FLAG_ACTIVITIES_RESIZE_MODE_RESIZEABLE_VIA_SDK_VERSION ALLOW_AUDIO_PLAYBACK_CAPTURE PRIVATE_FLAG_ALLOW_NATIVE_HEAP_POINTER_TAGGING ]

# 1) debuggable=true → run-as 로 앱 샌드박스 진입 (일반 권한에서)
PS&gt; adb shell run-as owasp.sat.agoat id
uid=10174(u0_a174) gid=10174(u0_a174) groups=10174(u0_a174),1004(input),1007(log),1011(adb),1015(sdcard_rw),1028(sdcard_r),1078(ext_data_rw),1079(ext_obb_rw),3001(net_bt_admin),3002(net_bt),3003(inet),3006(net_bw_stats),3009(readproc),3011(uhid),3012(readtracefs),50174(all_a174) context=u:r:runas_app:s0:c174,c256,c512,c768

# 2) allowBackup=true → adb backup 시도 (API 31+ 제약 확인)
PS&gt; adb backup -f agoat.ab owasp.sat.agoat
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
