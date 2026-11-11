---
{"title":"Custom Encoding","date":"2026-11-11","category":"ctf","tags":["custom encoding","dreamhack","reversing"],"summary":"리버싱","section":["DreamHack"]}
---


# [ 보안 문제풀이 ] 드림핵 - Custom Encoding (Reversing)

Reversing CTF를 하길래 밤일(?)을 마친 상황에서도 한 문제 풀어봤다. (젤 쉬운거)

![image01](/assets/uploads/tistory-13-01.png)

우선 checksec 명령어로 파일을 분석해보았는데, PIE와 CANARY가 비활성화된 64-Bit ELF 파일이다.

PIE(Position Independent Executable) : 주소를 매번 실행 할때마다 무작위로 배치하는 기술

Stack Canary : 스택 오버플로우를 감지하기 위해 삽입되는 특정 보안 값 (함d수 ㅢ로컬 변수 영역과 반환 주소 사이에 임의의 값을 삽입)

따라서 뭐 동적분석도 어려울게 없어보인다,

![image02](/assets/uploads/tistory-13-02.png)

바로 ghidra로 분석해보았다.

주요 함수는 3가지로 보인다.

```cpp
void FUN_001011a5(long param_1,long param_2,int param_3)

{
  int local_14;
  int local_10;
  int local_c;
  
  local_c = 0;
  do {
    if (param_3 <= local_c) {
      *(undefined1 *)(param_2 + param_3) = 0;
      return;
    }
    local_10 = -1;
    for (local_14 = 0; local_14 < 0x3e; local_14 = local_ 14 + 1) {
      if (*(char *)(param_1 + local_c) ==
          "qwertyuiopasdfghjklzxcvbnm0123456789QWER TYUIOPASDFGHJKLZXCVBNM"[local_14]) {
        local_10 = local_14;
        break;
      }
    }
    if (local_10 == -1) {
      *(char *)(local_c + param_2) = *(char *)(param_1 + local_c);
    }
    else {
      *(char *)(local_c + param_2) =
           "qwertyuiopasdfghjklzxcvbnm0123456789QWE RTYUIOPASDFGHJKLZXCVBNM"
           [(local_c + 3 + local_10) % 0x3e];
    }
    local_c = local_c + 1;
  } while( true );
}
```

```cpp
undefined8 FUN_00101288(void)

{
  int iVar1;
  char *pcVar2;
  undefined8 uVar3;
  size_t sVar4;
  size_t sVar5;
  char local_348 [256];
  char local_248 [32];
  char local_228 [256];
  char local_128 [256];
  FILE *local_28;
  int local_1c;
  
  setvbuf(stdin,(char *)0x0,2,0);
  setvbuf(stdout,(char *)0x0,2,0);
  setvbuf(stderr,(char *)0x0,2,0);
  builtin_strncpy(local_248,"d9xJaU5YpMiK9t71WlG", 0x14);
  printf("Enter the secret key: ");
  pcVar2 = fgets(local_128,0x100,stdin);
  if (pcVar2 == (char *)0x0) {
    puts("Input error!");
    uVar3 = 1;
  }
  else {
    sVar4 = strlen(local_128);
    local_1c = (int)sVar4;
    if ((0 < local_1c) && (local_128[local_1c + -1] == '\ n')) {
      local_128[local_1c + -1] = '\0';
      local_1c = local_1c + -1;
    }
    sVar5 = (size_t)local_1c;
    sVar4 = strlen(local_248);
    if (sVar5 == sVar4) {
      FUN_001011a5(local_128,local_228,local_1c);
      iVar1 = strcmp(local_228,local_248);
      if (iVar1 == 0) {
        puts("Correct! Here is your flag:");
        local_28 = fopen("flag","r");
        if (local_28 == (FILE *)0x0) {
          puts("Flag file not found!");
        }
        else {
          pcVar2 = fgets(local_348,0x100,local_28);
          if (pcVar2 != (char *)0x0) {
            printf("%s",local_348);
          }
          fclose(local_28);
        }
      }
      else {
        puts("Wrong key!");
      }
      uVar3 = 0;
    }
    else {
      puts("Wrong key length!");
      uVar3 = 1;
    }
  }
  return uVar3;
}
```

```cpp
void FUN_001014a0(undefined4 param_1,undefined8  param_2,undefined8 param_3)

{
  long lVar1;
  
  _DT_INIT();
  lVar1 = 0;
  do {
    (*(code *)(&__DT_INIT_ARRAY)[lVar1])(param_1,p aram_2,param_3);
    lVar1 = lVar1 + 1;
  } while (lVar1 != 1);
  return;
}
```

사실 다른 건 다 필요없는데 첫 디컴파일 코드만 잘 해석하면 된다. (FUN\_001011a5)

```cpp
void FUN_001011a5(long param_1, long param_2, int param_3)
```

이 구문은 함수 정의부분이다.

param\_1은 입력 문자열 주소, param\_2는 암호화 결과가 저장될 주소, param\_3은 문자열의 길이이다.

```cpp
{
  int local_14; // 알파벳 배열을 돌 때 사용할 루프 인덱스
  int local_10; // 찾은 알파벳의 인덱스 번호를 저장할 변수
  int local_c;  // 처리 중인 문자열의 현재 위치(인덱스)
  
  local_c = 0; // 문자열 인덱스를 0으로 초기화합니다.
  do {
    if (param_3 <= local_c) { // 현재 인덱스가 문자열 길이에 도달했다면
      *(undefined1 *)(param_2 + param_3) = 0; // 결과 문자열 끝에 NULL(\0)을 넣습니다.
      return; // 함수 종료
    }
```

문자열의 모든 글자를 처리했는지 확인하고, 끝났다면 문자열을 완성하고 함수를 종료함.

```cpp
local_10 = -1; // 인덱스 찾기 전, '찾지 못함' 상태로 초기화
    for (local_14 = 0; local_14 < 0x3e; local_14 = local_14 + 1) { // 62번(0x3e) 반복
      if (*(char *)(param_1 + local_c) == 
          "qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM"[local_14]) {
        local_10 = local_14; // 일치하는 문자를 찾으면 그 위치(인덱스)를 저장
        break; // 찾았으니 내부 반복문 탈출
      }
    }
```

현재 글자가 62글자의 QWERTY 커스텀 알파벳 중 몇 번째 글자인지 찾아내는 과정임.

```cpp
if (local_10 == -1) { // 만약 알파벳 배열에서 문자를 찾지 못했다면 (특수문자 등)
      *(char *)(local_c + param_2) = *(char *)(param_1 + local_c); // 원래 글자 그대로 복사
    }
```

알파벳 리스트에 없는 문자는 변환하지 않고 진행함.

```cpp
else { // 알파벳 배열에서 문자를 찾았다면
      *(char *)(local_c + param_2) = 
           "qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM"
           [(local_c + 3 + local_10) % 0x3e]; // 새로운 문자로 치환하여 저장
    }
```

암호화 핵심 공식. (현재 문자 위치 + 3 + 원래 알파벳 인덱스) % 62를 계산해 새로운 문자를 가져옴.

결국 복호화를 하려면 (현재 문자 위치 - 3 원래 알파벳 인덱스) % 62로 복호화하면 평문을 얻을 수 있음.

따라서 파이썬 코드를 짜면 밑처럼 나옴.

```python
def solve():
    alphabet = "qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM"
    target = "d9xJaU5YpMiK9t71WlG"
    
    decrypted_key = ""
    
    for i, char in enumerate(target):
        if char in alphabet:
            new_idx = alphabet.index(char)
            # 암호화: (old + i + 3) % 62 -> 복호화: (new - i - 3) % 62
            old_idx = (new_idx - i - 3) % 62
            decrypted_key += alphabet[old_idx]
        else:
            decrypted_key += char
            
    print(f"주황색 정답 키: {decrypted_key}")

solve()
```

![image03](/assets/uploads/tistory-13-03.png)
