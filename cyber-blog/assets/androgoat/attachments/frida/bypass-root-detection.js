// 루트 탐지 우회: 앱이 su 파일 존재 여부를 java.io.File.exists() 로 확인한다.
// su 경로일 때만 false 를 돌려주어, 다른 파일 동작은 건드리지 않는다.
Java.perform(function () {
    var File = Java.use("java.io.File");
    File.exists.implementation = function () {
        var path = this.getAbsolutePath();
        if (path.indexOf("su") !== -1 || path.indexOf("Superuser") !== -1 ||
            path.indexOf("supersu") !== -1 || path.indexOf("xposed") !== -1) {
            console.log("[root-bypass] File.exists(" + path + ") → false (원래 " + this.exists() + ")");
            return false;
        }
        return this.exists();
    };

    // 앱의 isRooted() 자체도 직접 후킹 (이중 안전장치)
    try {
        var Act = Java.use("owasp.sat.agoat.RootDetectionActivity");
        Act.isRooted.implementation = function () {
            console.log("[root-bypass] RootDetectionActivity.isRooted() → false");
            return false;
        };
    } catch (e) {}
    console.log("[*] root detection bypass loaded");
});
