// Binary Patching 목표를 Frida(동적)로 달성: 이미 떠 있는 화면의 관리자 UI를 켠다.
// 앱 코드: private val isAdmin = false → if(isAdmin){ 관리자 UI 활성화 }
Java.perform(function () {
    var Color = Java.use("android.graphics.Color");
    var R_id = Java.use("owasp.sat.agoat.R$id");
    var JString = Java.use("java.lang.String");
    var TextView = Java.use("android.widget.TextView");
    var Button = Java.use("android.widget.Button");

    Java.choose("owasp.sat.agoat.BinaryPatchingActivity", {
        onMatch: function (act) {
            Java.scheduleOnMainThread(function () {
                try {
                    var tv = Java.cast(act.findViewById(R_id.isAdminText.value), TextView);
                    var btn = Java.cast(act.findViewById(R_id.adminButton.value), Button);
                    tv.setText(Java.cast(JString.$new("You are Admin Now"), Java.use("java.lang.CharSequence")));
                    btn.setEnabled(true);
                    btn.setBackgroundColor(Color.parseColor("#000000"));
                    btn.setTextColor(Color.parseColor("#FFFFFF"));
                    console.log("[binary-patch] isAdmin=false 분기를 무시하고 관리자 UI 활성화");
                } catch (e) { console.log("err " + e); }
            });
        },
        onComplete: function () { console.log("[*] done"); }
    });
});
