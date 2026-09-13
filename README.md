<div align="center">

# 모여봐요 사자의 숲

**관심사와 생활 반경이 비슷한 동아리원들을 가볍게 잇는, 동아리 내 신뢰 기반 즉흥 모임 플랫폼**
<br />
배포 URL: [https://lionforest.netlify.app/home]

<img width="5760" height="4096" alt="Desktop - 50" src="https://github.com/user-attachments/assets/f6da861f-5359-48df-aebf-87b18fba7f27" />

</div>

## 🎙️ Introduction

### (1) 문제 인식

멋쟁이사자처럼 13기 중커톤 주제 "멋쟁이사자처럼 중앙대를 위한 서비스" 안에서, 팀이 사담방 채팅 점유율(상위 5명의 발화량이 45.41%로 소수에게 편중)과 소모임 개설 횟수(3월 10회 → 6~10월 0회) 데이터를 분석해 "**동아리원들은 관심사와 생활 패턴이 겹치고 물리적으로도 가까운데, 서로 연결될 계기가 없다**"는 문제를 도출했습니다.
<img width="5760" height="4096" alt="Desktop - 44" src="https://github.com/user-attachments/assets/689ac12a-67ee-4381-b33f-f39a9909232a" />


### (2) 솔루션

동아리라는 내부 신뢰를 바탕으로, 익명 닉네임으로 참여 부담을 낮추고 지도에서 실시간 위치·상태를 확인해 즉흥적으로 모일 수 있게 설계했습니다. 미리 약속을 잡는 대신, 그 순간 근처의 사람과 가볍게 이어지는 방식을 택했습니다.
<img width="5760" height="4096" alt="Desktop - 32" src="https://github.com/user-attachments/assets/2ffcb681-416a-4540-956e-e4e3bb8651a9" />

<br />

## ✨ Key Features

- **모임 큐레이션**: 필터링, 참여 신청, 댓글
- **사자 레이더**: 지도 기반 실시간 위치·상태 공유, 확대/축소에 따라 동적으로 조정되는 위치 반경 표시
- **모임 활동 관리**: 프로필, 참여/개설 내역, 후기

<br />

## 📸 DEMO

### (1) 모임 큐레이션
<img width="5760" height="4096" alt="Desktop - 33" src="https://github.com/user-attachments/assets/12234861-0f62-4cfb-aa42-3cec1d8f66b1" />

### (2) 사자 레이더
<img width="5760" height="4096" alt="Desktop - 43" src="https://github.com/user-attachments/assets/5584bb09-5c2f-4ed4-98e0-00858a17c92d" />

### (3) 모임 활동 관리
<img width="5760" height="4096" alt="Desktop - 35" src="https://github.com/user-attachments/assets/d0e7cf49-4e7b-4943-966f-cc673d963fda" />

<br />
<br />

## 💡 Tech Stack

| Category | Technology |
|---|---|
| Frontend | React, TypeScript |
| State Management | Recoil |
| Styling | styled-components |
| Realtime | Firebase → GPS(watchPosition) 기반 전환 |
| Map | KakaoMaps SDK |

<br />

## 📂 Directory Structure
src/
 ├── api/                  # 도메인별 API 함수
 │    ├── class/
 │    ├── meeting/
 │    ├── notification/
 │    ├── services/
 │    └── user/
 ├── assets/               # 폰트, 아이콘, 이미지, 마커, 캐릭터 리소스
 ├── components/
 │    ├── common/          # 공용 UI 컴포넌트
 │    ├── features/        # 기능 단위 컴포넌트
 │    └── layout/          # 레이아웃 컴포넌트
 ├── constants/
 ├── firebase/             # Firebase 설정
 ├── hooks/                # useMyLocation 등 커스텀 훅
 ├── pages/
 │    ├── CreateMeeting/
 │    ├── Home/
 │    ├── Landing/
 │    ├── Map/             # 지도, 사자 레이더
 │    ├── MeetingDetail/
 │    ├── Mypage/
 │    ├── NotificationPage/
 │    └── ReviewCollection/
 ├── store/                # Recoil 전역 상태
 │    └── modules/
 ├── styles/
 ├── types/
 └── utils/

<br />

## 🚀 시작하기

```bash
npm install
npm run dev
```
<br />

## 👥 팀원 소개 (TEAM 너굴즈)

| 제시현 | 배혜윤 | 윤리현 | 이은지 | 이형경 | 정건 | 이채연 | 임대철 |
|---|---|---|---|---|---|---|---|
| PM | DE | DE | FE | FE | FE | BE | BE |
