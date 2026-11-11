---
{"title":"randomzzz","date":"2026-11-11","category":"ctf","tags":["randomzzz","리버싱"],"summary":"리버싱","section":["DreamHack"]}
---


# [ 보안 문제풀이 ] 드림핵 - randzzz (Reversing)

이번에 풀어볼 문제는 2랩짜리 리버싱 문제임니다.

사실 GPT 딸깍이긴 하지만 원리가 중요하니깐 같이 풀어보죠.

[https://dreamhack.io/wargame/challenges/932](https://dreamhack.io/wargame/challenges/932)

우선 ghidra로 main 함수부터 분석을 조져봤습니다.

```bash
undefined8 main(void)

{
  undefined1 uVar1;
  int iVar2;
  char local_a8 [48];
  char local_78 [32];
  undefined1 local_58 [68];
  uint local_14;
  int local_10;
  int local_c;
  
  local_14 = 0;
  puts("----Start----");
  local_14 = local_14 + 1;
  sleep(local_14);
  puts("fall asleep from now on.");
  iVar2 = rand();
  local_14 = iVar2 + local_14;
  sleep(local_14);
  rand();
  rand();
  printf("Can you guess the rand num?: ");
  __isoc99_scanf(&DAT_00102049,&local_14);
  iVar2 = rand();
  if (iVar2 % 10 == local_14) {
    local_78[0] = 'l';
    local_78[1] = '9';
    local_78[2] = 'L';
    local_78[3] = '6';
    local_78[4] = '9';
    local_78[5] = ',';
    local_78[6] = 'l';
    local_78[7] = '8';
    local_78[8] = '9';
    local_78[9] = 'L';
    local_78[10] = 'L';
    local_78[0xb] = -0x54;
    local_78[0xc] = '8';
    local_78[0xd] = '3';
    local_78[0xe] = '8';
    local_78[0xf] = '0';
    local_78[0x10] = '4';
    local_78[0x11] = -0x34;
    local_78[0x12] = -0x34;
    local_78[0x13] = 'L';
    local_78[0x14] = '5';
    local_78[0x15] = '0';
    local_78[0x16] = '3';
    local_78[0x17] = '5';
    local_78[0x18] = -0x54;
    local_78[0x19] = '7';
    local_78[0x1a] = 'l';
    local_78[0x1b] = -0x34;
    for (local_c = 0; local_c < 0x1c; local_c = local_c + 1 ) {
      uVar1 = get_flag((int)local_78[local_c],local_14);
      local_58[local_c] = uVar1;
    }
  }
  iVar2 = rand();
  if (iVar2 % 10 == local_14) {
    builtin_strncpy(local_a8,"5\x13\v3882\x1b3#\ x1b6##3\v\x13\v78\v\x1b9#3539458369+8", 0x24);
    for (local_10 = 0; local_10 < 0x24; local_10 = local_ 10 + 1) {
      uVar1 = get_flag((int)local_a8[local_10],local_14);
      local_58[local_10 + 0x1c] = uVar1;
    }
  }
  printf("DH{%s}",local_58);
  return 0;
}
```

보통 컴퓨터에서 "랜덤"이라고 하면 정말 무작위 숫자가 나오지만, 이 프로그램은 별도의 설정 (srand)가 없음으로 매번 똑같은 숫자가 나옵니다.

1\. 프로그램이 시작되면 첫 번째 랜덤 숫자를 뽑아 잠드는 시간을 결정합니다.

2\. 그 다음 숫자를 두 번 더 뽑아서 버립니다.

3\. 그 다음 우리가 입력해야 할 숫자를 결정하는 4번째, 5번째 랜덤 숫자가 나옵니다.

iVar2 = rand() 뒤에 나오는 if문이 2개 있는데, 이 조건은 우리가 입력한 숫자(local\_14)와 랜덤 숫자가 맞아야만 실행됩니다.

그럼 4번째와 5번째 숫자의 랜덤 숫자를 알아야겠죠?

표준적인 컴퓨터 환경(glibc)에서 rand 함수의 결과는 이미 정해져 있습니다.

4번째 숫자 : 1714636915

5번째 숫자 : 1957747793

이 숫자를 10으로 나누면 4번째 숫자는 5, 5번째 숫자는 3이 됩니다.

그럼 한 번의 입력으로 어떻게 10으로 나누었을 때 5이면서 3일 수 있을까?

그래서 사실 실제 실행으로는 한 번에 플래그 전체를 볼 수 없게 설계되었습니다.

그래서 우리는 각 조건이 맞았을 때 어떤 일이 일어나는지 분석하는 "정적 분석" 이 필요합니다.

이제 이 문을 통과하면 만나는 마지막 관문 get\_flag 함수를 조지러 가봅니다.

```bash
uint get_flag(uint param_1,byte param_2)

{
  ushort **ppuVar1;
  uint uVar2;
  
  ppuVar1 = __ctype_b_loc();
  if (((*ppuVar1)[(int)param_1] & 0x800) == 0) {
    uVar2 = param_1 >> (param_2 & 0x1f) | param_1 < < (8 - param_2 & 0x1f);
    if ((int)uVar2 < 0) {
      uVar2 = uVar2 + 0x68;
    }
  }
  else {
    uVar2 = (param_1 * 8) % 10;
    if ((uVar2 < 8) || (9 < uVar2)) {
      uVar2 = uVar2 + 0x32;
    }
    else {
      uVar2 = uVar2 + 0x28;
    }
  }
  return uVar2;
}
```

get\_flag함수는 입력받은 글자를 다음 두 가지 규칙으로 바꿉니다.

1\. 글자가 숫자('0' ~ '9')일 때 : 복잡한 곱셈 연산을 통해 다른 숫자로 바꿉니다.

2\. 글자가 숫자가 아닐 때 : 비트를 옆으로 밀어버리는 '비트 회전' 연산을 합니다.

1번을 상세 분석하면 (문자 \* 8) % 10 + 특정 값을 통해 다른 숫자로 바꿉니다.

2번을 상세 분석하면 우리가 입력한 숫자만큼 비트를 옆으로 밀어서 원래 글자를 찾아냅니다.

그럼 이제 어떻게 동작하는지 알았으니 입력 값 '5'와 '3'을 입력하여 결과를 계산해봅니다. (실제로 실행 X)

첫번째 if문에서 local\_78에 숫자 5를 입력한 값을 해독하면

"c8b48ac08bbe00068ffb6606e2cf"를 얻을 수 있습니다

두번째 if문에서 local\_a8에 숫자 3을 입력한 값을 해독하면

"6ba0002c0dc4dd0aba20ac8d0608860048e0"를 얻을 수 있습니다.

이제 이 두 해독문을 합치면 문제를 풀 수 있었습니다.
