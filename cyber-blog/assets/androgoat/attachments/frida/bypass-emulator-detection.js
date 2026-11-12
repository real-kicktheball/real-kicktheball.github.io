// 에뮬레이터 탐지 우회: 앱이 읽는 android.os.Build 정적 필드를 실제 단말(Pixel 7) 값으로 바꾼다.
Java.perform(function () {
    var Build = Java.use("android.os.Build");
    var spoof = {
        FINGERPRINT: "google/panther/panther:13/TQ3A.230805.001/10316531:user/release-keys",
        DEVICE: "panther", MODEL: "Pixel 7", BRAND: "google", PRODUCT: "panther",
        MANUFACTURER: "Google", HARDWARE: "panther", BOARD: "panther", HOST: "abfarm",
        TAGS: "release-keys", TYPE: "user"
    };
    for (var k in spoof) {
        try { Build[k].value = spoof[k]; } catch (e) {}
    }
    console.log("[*] Build 필드를 Pixel 7 값으로 변경");
    console.log("    MODEL=" + Build.MODEL.value + "  FINGERPRINT=" + Build.FINGERPRINT.value);

    // 이중 안전장치: 앱의 isEmulator() 직접 후킹
    try {
        var Act = Java.use("owasp.sat.agoat.EmulatorDetectionActivity");
        Act.isEmulator.implementation = function () {
            console.log("[emu-bypass] isEmulator() → false");
            return false;
        };
    } catch (e) {}
    console.log("[*] emulator detection bypass loaded");
});
