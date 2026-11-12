// Toast.makeText 로 띄우려는 문자열을 가로채서 출력 (화면에 안 보여도 앱이 무엇을 노출하려 했는지 확인)
Java.perform(function () {
    var Toast = Java.use("android.widget.Toast");
    Toast.makeText.overload("android.content.Context", "java.lang.CharSequence", "int").implementation = function (ctx, text, dur) {
        console.log("[Toast.makeText] " + text);
        return this.makeText(ctx, text, dur);
    };
    var R = Java.use("owasp.sat.agoat.ShowDataReceiver");
    R.onReceive.implementation = function (ctx, intent) {
        console.log("[ShowDataReceiver.onReceive] intent=" + intent.toString());
        return this.onReceive(ctx, intent);
    };
    console.log("[*] toast/receiver hook loaded");
});
