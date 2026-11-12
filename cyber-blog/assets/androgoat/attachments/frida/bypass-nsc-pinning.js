// Network Security Config(<pin-set>) 피닝 우회 (Android 13)
// OS가 핀을 검사하는 곳: android.security.net.config.NetworkSecurityTrustManager.checkPins(List)
// + 결과 확인용: AndroGoat의 빈 onFailure / onResponse 콜백 로깅
Java.perform(function () {
    var NSTM = Java.use("android.security.net.config.NetworkSecurityTrustManager");
    NSTM.checkPins.implementation = function (chain) {
        console.log("[bypass] NetworkSecurityTrustManager.checkPins(" + chain.size() + " certs) → skip");
        // 반환만 하고 핀 불일치 예외를 던지지 않음
    };

    var Cb = Java.use("owasp.sat.agoat.TrafficActivity$run$1");
    Cb.onFailure.implementation = function (call, e) {
        console.log("[onFailure] " + call.request().url().toString() + "  " + e.toString());
        return this.onFailure(call, e);
    };
    Cb.onResponse.implementation = function (call, resp) {
        console.log("[onResponse] " + call.request().url().toString() + " -> HTTP " + resp.code());
        return this.onResponse(call, resp);
    };
    console.log("[*] NSC pinning bypass loaded");
});
