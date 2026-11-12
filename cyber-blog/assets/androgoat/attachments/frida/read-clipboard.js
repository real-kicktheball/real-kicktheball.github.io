// "다른 앱"(여기서는 Chrome 프로세스) 안에서 클립보드를 읽어 본다
Java.perform(function () {
    Java.scheduleOnMainThread(function () {
        var app = Java.use("android.app.ActivityThread").currentApplication();
        var cm = Java.cast(app.getSystemService("clipboard"), Java.use("android.content.ClipboardManager"));
        var clip = cm.getPrimaryClip();
        if (clip === null) {
            console.log("[" + app.getPackageName() + "] getPrimaryClip() = null (접근 거부)");
        } else {
            console.log("[" + app.getPackageName() + "] label=" + clip.getDescription().getLabel() +
                        "  text=" + clip.getItemAt(0).getText());
        }
    });
});
