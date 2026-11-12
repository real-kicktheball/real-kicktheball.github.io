// OkHttp3 CertificatePinner 우회 (AndroGoat, okhttp 4.9.3)
// 스택 트레이스에서 확인한 실제 검증 지점: okhttp3.CertificatePinner.check$okhttp(CertificatePinner.kt:200)
Java.perform(function () {
    var CP = Java.use("okhttp3.CertificatePinner");

    // okhttp 4.x 내부 검증 함수 (실제 네트워크 경로)
    CP["check$okhttp"].implementation = function (hostname, certsFn) {
        console.log("[bypass] CertificatePinner.check$okhttp(" + hostname + ") → skip");
        // 아무것도 하지 않고 반환 = 핀 불일치 예외를 던지지 않음
    };

    // 공개 API check(String, List) 오버로드도 함께 무력화
    CP.check.overloads.forEach(function (ov) {
        ov.implementation = function (hostname) {
            console.log("[bypass] CertificatePinner.check(" + hostname + ") → skip");
        };
    });

    console.log("[*] OkHttp3 CertificatePinner bypass loaded");
});
