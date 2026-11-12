---
{"title":"15_gboard_training_cache.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"05_side_channel/15_gboard_training_cache.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `05_side_channel/15_gboard_training_cache.txt` · 콘솔·로그 기록.

<pre><code>﻿# 키보드 앱(Gboard) 데이터에서 입력한 비밀번호 단어 검색 (root)
PS&gt; adb shell grep -rl zebrasecret /data/data/com.google.android.inputmethod.latin
/data/data/com.google.android.inputmethod.latin/databases/trainingcachev3.db

PS&gt; adb shell sqlite3 /data/data/com.google.android.inputmethod.latin/databases/trainingcachev3.db &#x27;.tables&#x27;
ac_threshold                     main_lm                        
android_metadata                 menes_baseline                 
auto_correction_stats            session                        
counts                           spell_checker                  
expression_training_data         trimmed_input_action_collection
input_action_collection          unified_params                 
kc_threshold                     user_spatial_stats             
keyboard_layout                  user_typo_stats                

PS&gt; adb shell strings / grep (해당 DB 안의 문자열)
zebrasecret77&quot;
zebrasecret@
zebrasecret%+C
zebrasecret7@
zebrasecret7%

PS&gt; adb shell ls -l /data/data/com.google.android.inputmethod.latin/databases/trainingcachev3.db
-rw-rw---- 1 u0_a136 u0_a136 413696 2026-11-12 04:06 /data/data/com.google.android.inputmethod.latin/databases/trainingcachev3.db
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
