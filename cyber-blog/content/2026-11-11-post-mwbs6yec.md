---
{"title":"지금까지의 활동 정리","date":"2026-11-11","category":"writing","tags":["과거","지금까지"],"summary":"앞으로도 더 열심히","section":[],"pinned":true}
---


# 지금까지의 활동 회고

[처음 글](/posts/2026-10-26-hello-world.html)에서 나이츠프론티어 7개월 동안의 목표를 적었다. 이번에는 지금까지 한 활동을 여섯 카테고리(개발, CTF/Wargame, BugBounty, 블로그/기술문서, 논문/컨퍼런스, 공모전/자격증)로 나눠 정리했다. 막상 분류해 보니 어떤 칸은 꽉 차 있었고 어떤 칸은 비어 있었다. 이 글에서는 무엇을 해 왔는지, 무엇이 부족했는지, 그리고 그 빈칸을 어떻게 채울지 적는다.

## 1. 지금까지 한 것

### CTF/Wargame

활동 대부분이 여기에 몰려 있다.

| 대회 | 결과 |
|---|---|
| [KISA 악성코드 미니챌린지 2025](/posts/2026-11-11-kisa-2025.html) | **대상** (팀 소망유치원) |
| [AI 과학수사 챌린지 2026](/posts/2026-11-11-ai-2026.html) | 예선 2위, **본선 2위** (4,000 / 4,000점) |
| 2026 호남 정보보호 해커톤 | **광주·전남·전북·제주 정보보호센터장상** (팀 리턴플래그) |

대회 외에도 DreamHack 워게임, HackingGame, CTFtime에 올라온 해외 CTF(HITCON, K17, D-CTF 등)를 꾸준히 풀었다. AI 도움 없이 풀어 보기도 했고, AI 도움을 많이 받은 문제는 라이트업을 보며 로컬에서 똑같이 재현해 보기도 했다.

블로그에 정리한 워게임 풀이는 다음과 같다.

- **DreamHack**: [XSS Filtering Bypass Advanced](/posts/2026-11-11-xss-filtering-bypass-advanced.html) (WEB), [randzzz](/posts/2026-11-11-randomzzz.html) · [Custom Encoding](/posts/2026-11-11-custom-encoding.html) (Reversing), [likeb64](/posts/2026-11-11-likeb64.html) · [ByteCaesar](/posts/2026-11-11-bytecaesar.html) (Crypto)
- **PortSwigger**: [DOM XSS in document.write sink using source location.search](/posts/2026-11-11-portswigger-dom-xss-document-write.html)
- **CryptoHack**: [전 문제 올클리어](/posts/cryptohack-all-clear.html)

### BugBounty

오픈소스 릴리스 도구 **GoReleaser**에서 빌드 하위 프로세스의 출력이 비밀정보 마스킹을 거치지 않고 로그와 오류 메시지에 남는 문제를 찾아 제보했다([정리글](/posts/2026-11-11-goreleaser-build-subprocess-output-secret-exposure.html)). 이 문제는 [GHSA-95mm-pj4f-x75r](https://github.com/goreleaser/goreleaser/security/advisories/GHSA-95mm-pj4f-x75r) (Moderate, CVSS 6.2)로 공개됐다. 실제로 쓰이는 소프트웨어에 처음으로 내 이름이 크레딧으로 올라간 경험이었다.

### 개발

알고리즘 문제 풀이를 기록했다.

- 백준 [11049번 - 행렬 곱셈 순서](/posts/2026-11-11-boj-11049.html)
- solved.ac [CLASS 1](/posts/2026-11-11-solvedac-class-1.html) · [CLASS 1*](/posts/2026-11-11-solvedac-class-1-star.html) · [CLASS 1**](/posts/2026-11-11-solvedac-class-1-star-star.html)

### 블로그/기술문서

보안 도구를 직접 써 보거나 만들어 보고, 환경 설정과 네트워크 공격 실습을 정리했다.

- **해킹툴 리뷰**: [seeker](/posts/2026-11-11-seeker.html), [Telespot](/posts/2026-11-11-telespot.html)
- **해킹툴 제작**: [msfvenom gui](/posts/2026-11-11-msfvenom-gui.html), [메모장을 이용한 간단한 바이러스 실습](/posts/2026-11-11-notepad-virus.html)
- **실습·환경**: [ARP, DNS spoof 실습](/posts/2026-11-11-arp-dns-spoof.html), [Kali Linux 한글패치](/posts/2026-11-11-kali-linux-korean-input.html)

### 논문/컨퍼런스, 공모전/자격증

이 두 카테고리에는 올릴 활동이 없었다.

## 2. 부족했던 점

### 활동이 CTF 한쪽에 쏠려 있다

글 수로 보면 CTF/Wargame이 압도적이다. 개발 카테고리에는 알고리즘 문제 풀이만 있고 직접 기획해서 끝까지 만든 프로젝트는 없다. 논문/컨퍼런스와 자격증은 아예 비어 있다. 문제를 푸는 일에만 시간을 쓰다 보니 직접 무언가를 만드는 경험, 남이 정리한 연구를 읽고 소화하는 경험, 내 지식을 공식적으로 증명하는 경험이 부족했다. 문제 풀이는 "주어진 취약점을 찾는" 연습이다. 반면 실제 보안 업무에서는 설계를 이해하고, 최신 연구를 따라가고, 결과를 문서로 남기는 일이 훨씬 많다.

### 많이 풀었지만 깊이 정리한 글이 없다

워게임과 대회 문제는 수백 개를 풀었다. 그런데 기술문서 카테고리의 글은 도구 사용기와 실습 기록이 대부분이고, 기법 단위로 묶어 설명한 글은 없다. 라이트업은 "이 문제를 이렇게 풀었다"에서 끝난다. "포맷 스트링 버그는 왜 생기고 어떤 상황에서 어떻게 쓰는가"처럼 여러 문제를 관통하는 내용은 머릿속에만 있다. 남에게 설명할 수 없다면 제대로 안다고 하기 어렵다.

### 꾸준함이 부족했다

[XSS Filtering Bypass Advanced](/posts/2026-11-11-xss-filtering-bypass-advanced.html) 글에서 "매일 드림핵 한 문제, 백준 한 문제"를 다짐했지만 오래가지 못했다. 문제는 풀어도 다시 정리하는 데까지 이어지지 않는 날이 많았다.

## 3. 어떻게 채울 것인가

나이츠프론티어 활동 기간 안에 끝낼 수 있도록 목표를 숫자로 정했다.

| 부족한 점 | 계획 | 목표 |
|---|---|---|
| 논문/컨퍼런스 없음 | 이미 해 본 분야와 이어지는 논문·발표부터 읽는다. 차량 네트워크(CAN/UDS) 보안, CI/CD 공급망 보안처럼 AutoHack, GoReleaser와 연결되는 주제를 고른다 | **매달 1편** 리뷰 글 작성 |
| 깊이 있는 기술문서 없음 | 풀어 둔 문제를 기법별로 묶어 정리한다. 첫 주제는 Space Alone에서 단계별로 다룬 BOF → ROP → FSB → 스택 피벗 | 기법 정리 글 **3편** |
| 개발 프로젝트 없음 | [msfvenom gui](/posts/2026-11-11-msfvenom-gui.html)처럼 반복하던 작업을 도구로 만든 경험을 넓혀, 대회 중 반복한 작업(CAN 메시지 송수신, 익스플로잇 템플릿 등)을 도구로 만들어 공개 저장소에 올린다 | 개인 프로젝트 **1개** 공개 |
| 자격증 없음 | 보안 기초 지식을 공식적으로 증명할 자격증 하나를 정해 시험 일정에 맞춰 준비한다 | **정보보안기사** 취득 |

## 마치며

지금까지는 "얼마나 많이 풀었나"를 기준으로 성장을 판단했다. 이번에 카테고리별로 나눠 보니, 많이 푼 것과 넓게 아는 것은 다르다는 점이 눈에 들어왔다. 남은 기간에는 비어 있는 칸을 하나씩 채우는 것을 목표로 한다. 다음 회고 때는 각 카테고리가 양이 아니라 깊이 있는 문서로 채워져 있도록 열심히 해 보겠다.
