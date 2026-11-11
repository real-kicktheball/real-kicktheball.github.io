---
{"title":"GoReleaser - Build subprocess output secret exposure","date":"2026-11-11","category":"bug-bounty","tags":["OpenSource","취약점","GoReleaser"],"summary":"오픈소스 GoReleaser 취약점 제보","section":[]}
---

# GoReleaser 빌드 하위 프로세스 출력의 CI 비밀정보 노출

## 링크

- 공개 어드바이저리: https://github.com/goreleaser/goreleaser/security/advisories/GHSA-95mm-pj4f-x75r
- 저장소: https://github.com/goreleaser/goreleaser
- GHSA: `GHSA-95mm-pj4f-x75r`
- 공개일: 2026-09-17

## 결과

- 심각도: Moderate
- CVSS 3.1: `6.2`
- 벡터: `CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N`
- 영향 버전: `>= 2.6.0, <= 2.18.1`
- 패치 버전: 공개 어드바이저리상 없음
- CVE: 발급되지 않음
- CWE: 지정되지 않음
- 크레딧: `real-kicktheball` — Reporter

## 요약

GoReleaser는 `GITHUB_TOKEN` 같은 CI 자격증명이 포함된 전체 빌드 환경을 빌더 하위 프로세스에 전달한다. 공통 빌더 실행 함수는 하위 프로세스의 stdout과 stderr를 `CombinedOutput()`으로 수집한 뒤, GoReleaser의 비밀정보 마스킹을 거치지 않고 오류 문자열 또는 INFO 로그에 포함했다.

빌드 도구가 환경변수의 비밀값이나 비밀값이 치환된 명령행을 출력하면 CI 로그, 보존된 로그, 업로드된 아티팩트 또는 오류 전파 경로를 통해 자격증명이 노출될 수 있다.

## 취약 코드

파일: `internal/builders/base/build.go`

함수: `Exec`

```go
out, err := cmd.CombinedOutput()
if err != nil {
    return fmt.Errorf("%w: %s", err, string(out))
}
if s := string(out); s != "" {
    log.WithField("output", s).Info(strings.Join(command, " "))
}
```

Go, Rust, Zig, Node, Bun, Deno, Poetry, uv 빌더는 이 실행 경로에 `ctx.Env.Strings()`를 전달한다. 반면 custom publisher, signer, shell, SBOM 실행 경로에는 `redact.Writer` 또는 `redact.String` 기반 마스킹이 적용되어 있었다.

## 최소 재현

합성 토큰을 `GITHUB_TOKEN`으로 전달하고, 하위 프로세스가 해당 값을 stderr에 출력한 뒤 실패하도록 한다.

```go
func TestSecurityBuildOutputDoesNotExposeEnvironmentSecret(t *testing.T) {
    const secret = "ghp_SECURITY_REGRESSION_SENTINEL_123456789"

    err := Exec(
        context.Background(),
        []string{
            "sh",
            "-c",
            `printf '%s' "$GITHUB_TOKEN" >&2; exit 1`,
        },
        []string{"GITHUB_TOKEN=" + secret},
        "",
    )

    if err == nil {
        t.Fatal("expected command failure")
    }
    if strings.Contains(err.Error(), secret) {
        t.Fatalf("secret exposed in returned error: %s", err)
    }
}
```

실행 명령:

```bash
go test ./internal/builders/base \
  -run TestSecurityBuildOutputDoesNotExposeEnvironmentSecret \
  -count=1
```

관찰 결과:

```text
secret exposed in returned error:
exit status 1: ghp_SECURITY_REGRESSION_SENTINEL_123456789
```

## 영향

노출 가능한 값은 다음과 같다.

- GitHub 및 GitLab CI 토큰
- 컨테이너 레지스트리 자격증명
- 서명 및 배포 관련 비밀값
- 클라우드 공급자 자격증명
- 빌드 환경에 전달된 기타 민감한 환경변수

공격 또는 사고가 성립하려면 빌더가 비밀값을 stdout이나 stderr로 출력해야 한다. 출력된 값은 반환 오류, INFO 로그, CI 로그 보존 시스템 및 로그 수집기로 전파될 수 있다.

## 제안한 수정

- `CombinedOutput()` 대신 stdout과 stderr를 분리해 수집한다.
- 두 스트림을 하위 프로세스 환경을 redaction 원본으로 사용하는 `redact.Writer`로 감싼다.
- 반환 오류에는 이미 마스킹된 출력만 포함한다.
- 성공 출력과 `strings.Join(command, " ")`에도 마스킹을 적용한다.
- 여러 번의 write에 나뉜 비밀값, 성공 명령 출력, 실패 명령 출력을 회귀 테스트한다.

## 분류 관련 메모

제보 당시 CWE-532와 Moderate 등급을 제안했지만, 공개 어드바이저리에는 CWE가 지정되지 않았고 CVE도 발급되지 않았다. GitHub Security Advisory가 공개됐다는 사실과 CVE 발급은 별개이며, 이 건은 현재 GHSA만 존재한다.

## 타임라인

- 공통 실행 함수 도입 커밋: `516d9bccf5b032833aab21f594242be5cb980dfc`
- 최초 영향 추정 버전: v2.6.0
- 확인한 최신 안정 버전: v2.18.1
- 확인한 main 커밋: `2ab310007902c215786382916e7e00477de597c4`
- 공개: 2026-09-17
