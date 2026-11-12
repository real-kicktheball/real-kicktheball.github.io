---
{"title":"19_sdcard_other_app_control.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"03_storage/19_sdcard_other_app_control.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `03_storage/19_sdcard_other_app_control.txt` · 콘솔·로그 기록.

<pre><code>﻿# [대조] 일반 앱(Chrome, uid 10125)의 UID 로 같은 파일 접근 (리눅스 파일 권한 기준 근사 실험)
PS&gt; adb shell su 10125 id
uid=10125(u0_a125) gid=10125(u0_a125) groups=10125(u0_a125),1004(input),1007(log),1011(adb),1015(sdcard_rw),1028(sdcard_r),1078(ext_data_rw),1079(ext_obb_rw),3001(net_bt_admin),3002(net_bt),3003(inet),3006(net_bw_stats),3009(readproc),3011(uhid),3012(readtracefs) context=u:r:su:s0
PS&gt; adb shell su 10125 sh -c &#x27;ls /sdcard/Android/data/owasp.sat.agoat/files; cat /sdcard/Android/data/owasp.sat.agoat/files/users*_tmp&#x27;
ls: /sdcard/Android/data/owasp.sat.agoat/files: Permission denied
cat: /sdcard/Android/data/owasp.sat.agoat/files/users*_tmp: Permission denied

# 참고: 공용 영역(/sdcard/Download)은 MediaStore/권한으로 접근 - 2-3 인보이스 파일 위치
PS&gt; adb shell ls -l /sdcard/Download
total 8
-rw-rw---- 1 u0_a165 media_rw 72 2026-11-12 03:48 1794455294923_invoice.txt
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
