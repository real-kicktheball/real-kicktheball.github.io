// TrafficActivity.run()의 빈 onFailure 콜백을 후킹해서 숨겨진 예외를 출력
Java.perform(function () {
    var Cb = Java.use("owasp.sat.agoat.TrafficActivity$run$1");
    Cb.onFailure.implementation = function (call, e) {
        console.log("[onFailure] " + call.request().url().toString());
        console.log("  " + e.toString());
        var cause = e.getCause();
        while (cause !== null) {
            console.log("  caused by: " + cause.toString());
            cause = cause.getCause();
        }
        return this.onFailure(call, e);
    };
    Cb.onResponse.implementation = function (call, resp) {
        console.log("[onResponse] " + call.request().url().toString() + " -> HTTP " + resp.code());
        return this.onResponse(call, resp);
    };
    console.log("[*] hooked TrafficActivity$run$1.onFailure - NATIVE 버튼을 누르세요");
});
