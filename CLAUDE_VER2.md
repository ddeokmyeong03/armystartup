좋습니다. 이번 변경으로 **메인 화면 구조 자체가 재정의**되었습니다.
핵심 변경은 아래 2가지입니다.

* 캘린더가 **월별 → 주별** 구조로 바뀜
* 메인의 핵심 기능으로 **AI 자기개발 일정 가이드 입력창 + 검색 버튼(OpenAI API 연동)** 이 추가됨

또한 OpenAI API 연동은 현재 공식 문서 기준으로 **Responses API** 중심으로 설계하는 것이 자연스럽고, 인증은 **프로젝트 API 키** 기반으로 처리하는 구조가 공식 레퍼런스에 정리되어 있습니다. ([OpenAI Platform][1])
배포 구조는 이미 확정된 대로 **Frontend=Netlify / Backend=Cloud Run / DB=Cloud SQL(MySQL)** 기준으로 유지하면 됩니다. ([OpenAI Platform][1])

아래는 **최종 수정본으로 붙여 넣을 내용**입니다.

---

# 1) `CLAUDE_FRONT.md`에 최종 반영할 내용

아래 블록을 기존 Main 화면 관련 섹션을 대체하는 용도로 붙여 넣으면 됩니다.

````md
---

## 58. Main 화면 최종 구조 정의

Main 화면은 아래 순서로 구성한다.

1. 프로필 / 알람 / 설정
2. 친구 확인하기 / 친구 추가하기
3. AI에게 자기개발 일정 가이드 받기
4. 주간 캘린더
5. 오늘의 일정

이 구조는 단순 일정 조회 화면이 아니라,
**“사용자 관리 + 친구 기능 + AI 자기개발 가이드 + 주간 일정 확인 + 일정 관리 진입”**
을 한 화면 안에서 수행하는 홈 화면이다.

---

## 59. Main 화면 최종 IA

```text
Main
├─ 프로필 관리
├─ 알람
├─ 설정
├─ 친구 확인하기
├─ 친구 추가하기
├─ AI 자기개발 가이드
│  ├─ 질문 입력
│  ├─ 검색/전송
│  ├─ AI 응답 확인
│  └─ 추천 일정 반영
├─ 주간 캘린더
│  ├─ 주 이동
│  ├─ 날짜 선택
│  └─ 주간 일정 상태 확인
└─ 오늘의 일정
   └─ 일정 클릭 → 일정 상세/수정 페이지 이동
````

---

## 60. Main 화면 섹션별 역할

### 60-1. 프로필 / 알람 / 설정

역할:

* 사용자 개인 정보 확인 및 관리
* 알림 확인
* 설정 변경

인터랙션:

* 프로필 영역 클릭 → `/profile`
* 알람 아이콘 클릭 → `/notifications`
* 설정 아이콘 클릭 → `/settings`

### 60-2. 친구 기능 섹션

역할:

* 친구 목록 확인
* 친구 추가
* 받은 요청 또는 친구 관련 상태 진입

권장 UI:

* 버튼 2개 또는 action chip 2개

  * `친구 확인하기`
  * `친구 추가하기`

인터랙션:

* 친구 확인하기 → `/friends`
* 친구 추가하기 → `/friends/add` 또는 `/friends?mode=add`

### 60-3. AI 자기개발 일정 가이드 섹션

역할:

* 사용자가 자연어로 AI에게 질문
* 현재 목표/일정/선택 날짜를 바탕으로 자기개발 일정 추천 받기
* 추천 결과를 일정에 반영

권장 UI:

* 제목: `AI 자기개발 가이드`
* 한 줄 설명: `오늘 일정과 목표를 바탕으로 자기개발 계획을 추천해드릴게요.`
* 입력창 placeholder 예시:

  * `예: 오늘 훈련 끝나고 영어 공부 일정 짜줘`
  * `예: 이번 주 운동 일정 다시 추천해줘`
* 검색/전송 버튼 1개

중요:

* 이 기능은 Main의 핵심 가치이므로 별도 작은 버튼이 아니라,
  **입력창 + 버튼이 있는 독립 섹션**으로 보여야 한다.

### 60-4. 주간 캘린더 섹션

역할:

* 월별이 아니라 **주별 일정 흐름 확인**
* 현재 주의 날짜와 일정 상태를 직관적으로 표시
* 날짜 선택 시 오늘의 일정 영역과 연동

변경사항:

* 기존 월간 캘린더 제거
* 주간 단위 7일 뷰로 변경
* 이전 주 / 다음 주 이동 기능 포함

### 60-5. 오늘의 일정 섹션

역할:

* 선택 날짜 또는 오늘 날짜 기준 일정 목록 표시
* 일정 카드 클릭 시 상세/수정 페이지 이동

변동사항:

* 구조 자체는 유지
* 단, 일정 카드 클릭 시 반드시 일정 관리 페이지로 이동해야 함

---

## 61. Main 화면 컴포넌트 최종 구조

```text
MainPage
├─ MainLayout
│  ├─ TopProfileBar
│  │  ├─ ProfileSummarySection
│  │  ├─ NotificationIconButton
│  │  └─ SettingsIconButton
│  │
│  ├─ FriendActionSection
│  │  ├─ CheckFriendsButton
│  │  └─ AddFriendButton
│  │
│  ├─ AiGuideSection
│  │  ├─ SectionTitle
│  │  ├─ AiGuideInput
│  │  ├─ AiGuideSubmitButton
│  │  ├─ SuggestedPromptChips (optional)
│  │  └─ AiGuidePreviewMessage (optional)
│  │
│  ├─ WeeklyCalendarSection
│  │  ├─ WeeklyCalendarHeader
│  │  │  ├─ PrevWeekButton
│  │  │  ├─ CurrentWeekLabel
│  │  │  └─ NextWeekButton
│  │  ├─ WeeklyDateTabs
│  │  └─ WeeklyScheduleMarkers
│  │
│  └─ TodayScheduleSection
│     ├─ SelectedDateHeader
│     ├─ ScheduleCountLabel
│     ├─ SchedulePreviewCard
│     └─ EmptyState
```

---

## 62. Main 화면 인터랙션 규칙 최종본

### 프로필 영역

* 탭 시 프로필 관리 페이지로 이동

### 알람 아이콘

* 탭 시 알람 페이지로 이동

### 설정 아이콘

* 탭 시 설정 페이지로 이동

### 친구 확인하기

* 탭 시 친구 목록 페이지로 이동

### 친구 추가하기

* 탭 시 친구 추가/검색 페이지로 이동

### AI 입력창

* 사용자가 자연어 질문 입력
* 전송 버튼 클릭 시 AI 가이드 API 호출
* 응답 결과는:

  * 간단한 미리보기로 Main에 보여주거나
  * `/ai/chat` 또는 `/ai/recommendations` 화면으로 이동해 상세 확인 가능

### 주간 캘린더

* 날짜 선택 시 오늘의 일정 섹션 갱신
* 이전 주 / 다음 주 이동 가능
* 선택 날짜는 강조 표시

### 오늘의 일정 카드

* 탭 시 일정 상세 페이지로 이동
* 상세 페이지에서 수정 가능
* 수정 완료 후 Main 복귀 시 선택 날짜 유지 권장

---

## 63. 주간 캘린더 설계 원칙

기존 월간 캘린더는 제거하고 주간 뷰로 전환한다.

### 주간 캘린더 목표

* 사용자가 “이번 주” 흐름을 빠르게 파악
* 오늘/선택 날짜 중심으로 행동을 유도
* AI 추천과 연동하기 쉽게 구성

### 필수 기능

* 현재 주 표시
* 이전 주 / 다음 주 이동
* 7일 날짜 표시
* 선택 날짜 표시
* 일정 있는 날짜 마커 표시
* AI 추천 일정 마커 표시 가능

### 권장 UI

* 상단: `2026.03 둘째 주` 또는 `3월 9일 - 3월 15일`
* 하단: 일~토 7개 날짜 셀
* 선택 날짜는 진하게 강조
* 오늘은 별도 subtle highlight 사용

---

## 64. AI 자기개발 가이드 섹션 설계 원칙

이 섹션은 메인 화면의 핵심 가치 영역이다.

### 필수 요소

* 입력창 1개
* 전송 버튼 1개

### 권장 보조 요소

* 예시 질문 chip 2~3개
* 최근 질문 1개 미리보기
* 추천 결과 미리보기 1줄

### 예시 질문

* `오늘 자격증 공부 일정 짜줘`
* `이번 주 운동 루틴 추천해줘`
* `훈련 끝난 뒤 30분 독서 계획 세워줘`

### 동작 방식

1. 사용자가 질문 입력
2. 전송 버튼 클릭
3. 로딩 상태 진입
4. AI 응답 수신
5. 추천 일정 확인
6. 적용 시 실제 일정/AI 계획에 반영

---

## 65. 새 라우팅 구조 최종본

```text
/
├─ /main
├─ /profile
├─ /notifications
├─ /settings
├─ /friends
├─ /friends/add
├─ /schedules/new
├─ /schedules/:scheduleId
├─ /schedules/:scheduleId/edit
├─ /ai
├─ /ai/chat
├─ /ai/recommendations
├─ /goals
└─ /today
```

Main 화면에서 직접 이동하는 라우트:

* `/profile`
* `/notifications`
* `/settings`
* `/friends`
* `/friends/add`
* `/schedules/:scheduleId`
* `/ai`
* `/ai/chat`

---

## 66. Main 화면 Props 최종안

### ProfileSummarySection

```ts
type ProfileSummarySectionProps = {
  nickname: string;
  message?: string;
  avatarUrl?: string;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  unreadNotificationCount?: number;
};
```

### FriendActionSection

```ts
type FriendActionSectionProps = {
  onCheckFriends?: () => void;
  onAddFriend?: () => void;
  pendingRequestCount?: number;
};
```

### AiGuideSection

```ts
type AiGuideSectionProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  suggestedPrompts?: string[];
};
```

### WeeklyCalendarSection

```ts
type WeeklyCalendarSectionProps = {
  currentWeekLabel: string;
  days: Array<{
    date: string;
    dayLabel: string;
    dayNumber: number;
    isToday: boolean;
    isSelected: boolean;
    hasSchedule: boolean;
    hasAiPlan: boolean;
  }>;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onSelectDate?: (date: string) => void;
};
```

### SchedulePreviewCard

```ts
type SchedulePreviewCardProps = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category?: string;
  onClick?: () => void;
};
```

---

## 67. Main 화면 상태 정의 최종본

### State A. 기본 진입

* 프로필, 친구 기능, AI 입력창, 주간 캘린더, 오늘 일정 표시

### State B. 일정 없음

* 오늘의 일정 EmptyState 표시

### State C. AI 질문 입력 중

* 입력창 활성 상태

### State D. AI 응답 로딩 중

* 입력창 비활성 또는 버튼 loading 상태
* 로딩 indicator 표시

### State E. AI 추천 결과 도착

* 추천 결과 요약 문구 표시 가능
* 상세 페이지 이동 또는 일정 적용 유도

### State F. 친구 요청 있음

* 친구 확인하기 또는 알람 badge 표시 가능

### State G. 알림 존재

* 알람 아이콘 badge 표시 가능

### State H. 선택 날짜 변경

* 오늘의 일정 섹션 갱신

---

## 68. Main 화면 구현 체크리스트 최종본

### UI

* [ ] 프로필/알람/설정 영역 구현
* [ ] 친구 확인하기 / 친구 추가하기 섹션 구현
* [ ] AI 자기개발 가이드 입력창 구현
* [ ] 전송 버튼 구현
* [ ] 주간 캘린더 구현
* [ ] 오늘의 일정 리스트 구현
* [ ] 일정 카드 클릭 상태 구현

### 기능

* [ ] 프로필 관리 이동
* [ ] 알람 이동
* [ ] 설정 이동
* [ ] 친구 목록 이동
* [ ] 친구 추가 이동
* [ ] AI 질문 제출
* [ ] 주 이동
* [ ] 날짜 선택
* [ ] 일정 상세 이동
* [ ] 일정 수정 후 Main 재조회

### 품질

* [ ] 모바일 터치 영역 점검
* [ ] AI 입력창과 버튼의 가독성 점검
* [ ] 주간 캘린더 선택 상태 시인성 점검
* [ ] 오늘의 일정과 선택 날짜 일치 여부 점검

---

## 69. Claude에게 주는 프론트 최종 구현 지시

1. Main 화면은 월간 캘린더가 아니라 주간 캘린더 기준으로 재구성한다.
2. 상단은 프로필 / 알람 / 설정으로 구성한다.
3. 그 아래에는 친구 확인하기 / 친구 추가하기 기능을 배치한다.
4. 그 아래에는 반드시 `AI 자기개발 가이드` 섹션을 둔다.
5. AI 가이드 섹션은 입력창 + 전송 버튼 구조로 구현한다.
6. AI 가이드 질문은 `/ai/chat` 또는 관련 API와 연동할 수 있게 설계한다.
7. 그 아래에는 주간 캘린더를 두고 날짜 선택이 가능해야 한다.
8. 마지막으로 오늘의 일정 섹션을 두며, 일정 카드를 클릭하면 상세/수정 페이지로 이동해야 한다.
9. Main 화면은 “일정 관리 앱”이 아니라 “AI 기반 자기개발 홈”처럼 보이도록 구조를 잡는다.

````

---

# 2) `CLAUDE.md`에 최종 반영할 내용

아래는 백엔드 개발 문서에 붙여 넣을 최종 수정본입니다.

```md
---

## 34. Main 화면 변경에 따른 백엔드 요구사항 최종 반영

Main 화면이 아래 구조로 확정되었다.

1. 프로필 / 알람 / 설정
2. 친구 확인하기 / 친구 추가하기
3. AI에게 자기개발 일정 가이드 받기
4. 주간 캘린더
5. 오늘의 일정

따라서 백엔드는 단순 일정 CRUD 외에 아래 흐름을 메인에서 직접 지원해야 한다.

- 프로필 조회/수정
- 알림 조회
- 친구 목록/친구 추가
- AI 질문 기반 자기개발 일정 추천
- 주간 일정 조회
- 오늘 일정 조회
- 일정 상세/수정

---

## 35. 친구 기능(Friend) 최종 범위

### 최소 MVP 범위
- 친구 목록 조회
- 친구 추가 요청
- 받은 요청 조회
- 친구 요청 수락
- 친구 요청 거절

### 권장 API
- `GET /api/v1/friends`
- `POST /api/v1/friends/requests`
- `GET /api/v1/friends/requests/received`
- `POST /api/v1/friends/requests/{requestId}/accept`
- `POST /api/v1/friends/requests/{requestId}/reject`

초기 Main 화면에서는 최소한 다음 두 진입을 지원해야 한다.
- 친구 확인하기
- 친구 추가하기

---

## 36. 프로필 / 알림 / 설정 기능 최종 범위

### 프로필
- `GET /api/v1/profile`
- `PUT /api/v1/profile`

### 알림
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/{notificationId}/read`
- `PATCH /api/v1/notifications/read-all`

### 설정
- `GET /api/v1/preferences`
- `PUT /api/v1/preferences`

Main 화면 상단 영역에서 즉시 사용 가능해야 하므로,
프로필 요약과 읽지 않은 알림 개수는 메인 통합 응답 또는 별도 경량 응답으로 제공할 수 있다.

---

## 37. AI 질문 기반 자기개발 일정 가이드 기능 최종 정의

이 서비스의 핵심 기능은 사용자가 AI에게 자연어로 질문하고,
그 결과를 자기개발 일정에 반영하는 것이다.

### 대표 질문 예시
- 오늘 훈련 끝나고 영어 공부 일정 짜줘
- 이번 주 운동 루틴 추천해줘
- 오늘 일정에 맞게 독서 시간 만들어줘
- 전역 준비용 자격증 공부 계획 세워줘

### 최소 MVP 기능
1. 질문 입력
2. 질문 해석
3. 현재 일정/목표/선택 날짜 반영
4. 추천 일정 생성
5. 추천 결과 반환
6. 추천 일정 적용

### 권장 API
- `POST /api/v1/ai/chat`
- `POST /api/v1/ai/recommendations`
- `POST /api/v1/ai-plans/apply-batch`
- `GET /api/v1/ai-plans?date=2026-03-10`

### 구현 원칙
- 초기에는 규칙 기반 추천 + 질문 템플릿 해석으로 구현 가능
- 이후 OpenAI API와 연동 가능한 구조로 서비스 계층 분리
- AI 응답 결과는 `AiPlan` 저장 구조와 연결

---

## 38. OpenAI API 연동 원칙 추가

OpenAI API 연동은 백엔드에서 수행한다.
프론트엔드에서 직접 API 키를 호출하지 않는다.

OpenAI 공식 API 문서는 REST 기반 API와 Responses API를 제공하며, 인증은 API 키 기반으로 수행한다. :contentReference[oaicite:2]{index=2}

### 원칙
1. OpenAI API Key는 반드시 백엔드 환경변수 또는 Secret Manager에 저장한다.
2. 프론트엔드에는 절대 OpenAI API Key를 노출하지 않는다.
3. 프론트는 백엔드의 `/api/v1/ai/chat` 같은 내부 API만 호출한다.
4. 백엔드는 사용자 질문과 필요한 일정/목표 문맥을 조합해 OpenAI API를 호출한다.
5. 응답 결과는 프론트 친화적인 DTO로 변환 후 반환한다.

### 권장 구조
- `AiChatController`
- `AiChatService`
- `OpenAiClient`
- `PromptBuilder`
- `AiRecommendationMapper`

---

## 39. 주간 캘린더 조회 기능 추가

기존 월간 중심 조회 외에, Main 화면이 주간 뷰로 바뀌었으므로 주간 조회 API가 필요하다.

### 권장 API
- `GET /api/v1/calendar/weekly-summary?startDate=2026-03-09`

### 목적
- 해당 주의 7일 일정 여부 표시
- 날짜별 일정 개수
- 날짜별 AI 계획 개수
- 오늘/선택 날짜 표시용 데이터 제공

### 응답 예시
```json
{
  "success": true,
  "message": "주간 캘린더 요약을 조회했습니다.",
  "data": {
    "startDate": "2026-03-09",
    "endDate": "2026-03-15",
    "days": [
      {
        "date": "2026-03-10",
        "scheduleCount": 1,
        "aiPlanCount": 1,
        "hasSchedule": true,
        "hasAiPlan": true
      }
    ]
  }
}
````

---

## 40. Main 화면 통합 조회 API 최종안

Main 화면은 아래 데이터를 한 번에 필요로 할 가능성이 높다.

* 프로필 요약
* 읽지 않은 알림 수
* 친구 요청 수 또는 친구 기능 상태
* 주간 캘린더 요약
* 선택 날짜 오늘의 일정
* AI 가이드 활성 상태

따라서 아래 통합 응답을 고려한다.

### 권장 API

* `GET /api/v1/main/home?startDate=2026-03-09&date=2026-03-10`

### 응답 예시

```json
{
  "success": true,
  "message": "메인 홈 데이터를 조회했습니다.",
  "data": {
    "user": {
      "nickname": "김병사",
      "statusMessage": "오늘 하루도 파이팅! 💪",
      "profileImageUrl": null
    },
    "unreadNotificationCount": 2,
    "pendingFriendRequestCount": 1,
    "hasActiveGoal": true,
    "weeklyCalendarDays": [
      {
        "date": "2026-03-10",
        "scheduleCount": 1,
        "aiPlanCount": 1,
        "hasSchedule": true,
        "hasAiPlan": true
      }
    ],
    "selectedDate": "2026-03-10",
    "todaySchedules": [
      {
        "id": 1,
        "title": "훈련",
        "startTime": "08:00",
        "endTime": "17:00",
        "category": "MILITARY"
      }
    ]
  }
}
```

---

## 41. 일정 상세/수정 흐름 최종 보강

오늘의 일정 카드 클릭은 일정 관리 페이지로 연결된다.

### 필요 API

* `GET /api/v1/schedules/{scheduleId}`
* `PUT /api/v1/schedules/{scheduleId}`
* `DELETE /api/v1/schedules/{scheduleId}`

### 중요 원칙

* 상세 조회 응답은 수정 화면에서 그대로 재사용 가능해야 한다.
* 수정 완료 후 Main 화면에서 동일 날짜 재조회가 쉬워야 한다.

---

## 42. 백엔드 패키지 구조 최종 제안

```bash
domain
├── user
├── profile
├── preference
├── schedule
├── goal
├── aiplan
├── ai
│   ├── controller
│   ├── dto
│   ├── service
│   ├── client
│   └── prompt
├── calendar
├── friend
├── notification
└── main
    ├── controller
    ├── dto
    └── service
```

---

## 43. 우선 구현 순서 최종안

1. Auth
2. Profile / Preference
3. Schedule CRUD
4. Goal CRUD
5. Weekly Calendar Query
6. Main Home Query
7. Friend
8. Notification
9. AI Chat / AI Recommendation
10. AI Plan Apply
11. OpenAI API 연동
12. Cloud Run / Cloud SQL prod 설정

---

## 44. Claude가 추가로 지켜야 할 작업 원칙 최종안

1. Main 화면이 요구하는 API를 먼저 만든다.
2. 월간이 아니라 주간 캘린더 기준으로 조회 API를 재구성한다.
3. AI 기능은 메인에서 직접 입력되므로 응답 속도와 DTO 단순성을 중요하게 본다.
4. OpenAI API 키는 반드시 백엔드에서만 관리한다.
5. 프론트는 내부 AI API만 호출하고, OpenAI 직접 호출은 금지한다.
6. 일정 상세 응답과 수정 요청 구조를 최대한 일관되게 유지한다.
7. Main 통합 응답 API는 과도하게 무겁지 않게 설계한다.

````

---

# 3) `CLAUDE_REST.md`에 최종 반영할 내용

아래는 API/DB/인프라 문서용 최종 수정본입니다.

```md
---

## 5. API 목록 개요 최종 수정

### 인증/사용자
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### 프로필/설정
- `GET /api/v1/profile`
- `PUT /api/v1/profile`
- `GET /api/v1/preferences`
- `PUT /api/v1/preferences`

### 친구
- `GET /api/v1/friends`
- `POST /api/v1/friends/requests`
- `GET /api/v1/friends/requests/received`
- `POST /api/v1/friends/requests/{requestId}/accept`
- `POST /api/v1/friends/requests/{requestId}/reject`

### 알림
- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/{notificationId}/read`
- `PATCH /api/v1/notifications/read-all`

### 일정
- `POST /api/v1/schedules`
- `GET /api/v1/schedules`
- `GET /api/v1/schedules/{scheduleId}`
- `PUT /api/v1/schedules/{scheduleId}`
- `DELETE /api/v1/schedules/{scheduleId}`

### 목표
- `POST /api/v1/goals`
- `GET /api/v1/goals`
- `GET /api/v1/goals/{goalId}`
- `PUT /api/v1/goals/{goalId}`
- `DELETE /api/v1/goals/{goalId}`

### AI 질문/추천/계획
- `POST /api/v1/ai/chat`
- `POST /api/v1/ai/recommendations`
- `GET /api/v1/ai-plans`
- `POST /api/v1/ai-plans/apply-batch`
- `PATCH /api/v1/ai-plans/{planId}/complete`
- `PATCH /api/v1/ai-plans/{planId}/miss`

### 주간 캘린더 / 메인
- `GET /api/v1/calendar/weekly-summary`
- `GET /api/v1/calendar/daily-detail`
- `GET /api/v1/main/home`
````

````md
---

## 11. AI 질문/추천 API 설계 최종본

### 11-1. AI 질문
`POST /api/v1/ai/chat`

#### 목적
사용자가 Main 화면 입력창에서 자연어 질문을 입력하면,
현재 목표/일정/선택 날짜를 바탕으로 자기개발 일정을 추천한다.

공식 OpenAI API는 REST 기반으로 제공되며, 현재 Responses API 중심 구조가 공식 레퍼런스에 안내되어 있다. 인증은 API 키 기반으로 처리한다. :contentReference[oaicite:3]{index=3}

#### Request
```json
{
  "question": "오늘 훈련 끝나고 영어 공부 일정 짜줘",
  "date": "2026-03-10",
  "goalId": 3
}
````

#### Response

```json
{
  "success": true,
  "message": "AI 응답을 생성했습니다.",
  "data": {
    "question": "오늘 훈련 끝나고 영어 공부 일정 짜줘",
    "answer": "훈련 이후 피로도를 고려해 30분 영어 공부를 추천합니다.",
    "recommendedPlans": [
      {
        "id": 301,
        "title": "영어 공부",
        "date": "2026-03-10",
        "startTime": "20:30",
        "endTime": "21:00",
        "status": "RECOMMENDED"
      }
    ]
  }
}
```

### 11-2. AI 추천 생성

`POST /api/v1/ai/recommendations`

#### 목적

질문 없이 버튼 클릭 기반으로 추천 생성

#### Request

```json
{
  "date": "2026-03-10",
  "goalId": 3,
  "mode": "TODAY"
}
```

### 11-3. AI 계획 목록 조회

`GET /api/v1/ai-plans?date=2026-03-10`

### 11-4. AI 계획 일괄 적용

`POST /api/v1/ai-plans/apply-batch`

#### Request

```json
{
  "planIds": [301, 302]
}
```

### 11-5. 설계 원칙

* 프론트는 직접 OpenAI API를 호출하지 않는다.
* 백엔드가 질문 문맥을 조합해 OpenAI API를 호출한다.
* OpenAI API Key는 Cloud Run 환경변수 또는 Secret Manager로 관리한다.
* 응답 결과는 내부 DTO로 변환 후 반환한다.
* 초기에는 규칙 기반 fallback 로직을 함께 둘 수 있다.

````

```md
---

## 12. 캘린더/메인 조회 API 설계 최종본

### 12-1. 주간 캘린더 요약
`GET /api/v1/calendar/weekly-summary?startDate=2026-03-09`

#### Response
```json
{
  "success": true,
  "message": "주간 캘린더 요약을 조회했습니다.",
  "data": {
    "startDate": "2026-03-09",
    "endDate": "2026-03-15",
    "days": [
      {
        "date": "2026-03-09",
        "scheduleCount": 0,
        "aiPlanCount": 0,
        "hasSchedule": false,
        "hasAiPlan": false
      },
      {
        "date": "2026-03-10",
        "scheduleCount": 1,
        "aiPlanCount": 1,
        "hasSchedule": true,
        "hasAiPlan": true
      }
    ]
  }
}
````

### 12-2. 특정 날짜 상세 조회

`GET /api/v1/calendar/daily-detail?date=2026-03-10`

#### Response

```json
{
  "success": true,
  "message": "일일 상세 정보를 조회했습니다.",
  "data": {
    "date": "2026-03-10",
    "schedules": [
      {
        "id": 1,
        "title": "훈련",
        "startTime": "08:00",
        "endTime": "17:00",
        "category": "MILITARY"
      }
    ],
    "aiPlans": [
      {
        "id": 301,
        "title": "영어 공부",
        "startTime": "20:30",
        "endTime": "21:00",
        "status": "RECOMMENDED"
      }
    ]
  }
}
```

### 12-3. 메인 홈 통합 조회

`GET /api/v1/main/home?startDate=2026-03-09&date=2026-03-10`

#### 목적

Main 화면에 필요한 핵심 정보를 한 번에 제공

#### Response

```json
{
  "success": true,
  "message": "메인 홈 데이터를 조회했습니다.",
  "data": {
    "user": {
      "nickname": "김병사",
      "statusMessage": "오늘 하루도 파이팅! 💪",
      "profileImageUrl": null
    },
    "unreadNotificationCount": 2,
    "pendingFriendRequestCount": 1,
    "hasActiveGoal": true,
    "weeklyCalendarDays": [
      {
        "date": "2026-03-10",
        "scheduleCount": 1,
        "aiPlanCount": 1,
        "hasSchedule": true,
        "hasAiPlan": true
      }
    ],
    "selectedDate": "2026-03-10",
    "todaySchedules": [
      {
        "id": 1,
        "title": "훈련",
        "startTime": "08:00",
        "endTime": "17:00",
        "category": "MILITARY"
      }
    ]
  }
}
```

````

```md
---

## 22. 구현 우선순위 최종본

### 1순위
- Auth
- Profile / Preference
- Schedule CRUD
- Goal CRUD

### 2순위
- Weekly Calendar Summary
- Daily Detail Query
- Main Home Query

### 3순위
- Friend
- Notification

### 4순위
- AI Chat
- AI Recommendation
- AI Plan Apply / Complete / Miss

### 5순위
- OpenAI API 실제 연동
- Cloud Run prod 최적화
- Cloud SQL 운영 안정화
````

---

# 4) Claude Code에 바로 넣을 최종 작업 지시문

```text
메인 화면 구조가 최종 수정되었습니다.

최종 Main 화면 순서:
1. 프로필 / 알람 / 설정
2. 친구 확인하기 / 친구 추가하기
3. AI에게 자기개발 일정 가이드 받기
4. 주간 캘린더
5. 오늘의 일정

중요 변경사항:
- 기존 월간 캘린더는 제거하고 주간 캘린더로 변경합니다.
- AI 기능은 메인에 반드시 직접 보여야 합니다.
- AI 기능은 입력창 + 검색(전송) 버튼 형태로 구현합니다.
- AI 기능은 OpenAI API 연동을 고려하되, 프론트는 직접 OpenAI를 호출하지 않고 백엔드의 AI API만 호출합니다.
- 오늘의 일정 카드는 클릭 시 일정 상세/수정 페이지로 이동해야 합니다.

작업 요청:
1. CLAUDE_FRONT.md 기준으로 Main 화면 구조를 최종 수정해주세요.
2. CLAUDE.md 기준으로 백엔드 요구사항을 주간 캘린더 + AI 입력형 메인 구조에 맞게 수정해주세요.
3. CLAUDE_REST.md 기준으로 monthly-summary를 weekly-summary 중심으로 수정해주세요.
4. AI 질문 API(`/api/v1/ai/chat`)와 메인 통합 조회 API(`/api/v1/main/home`)를 우선 고려해주세요.
5. OpenAI API 키는 백엔드에서만 관리하도록 문서와 구조를 반영해주세요.
6. 먼저 변경 계획과 수정 파일 목록을 짧게 제시한 뒤 작업해주세요.
```


[1]: https://platform.openai.com/docs/api-reference/?utm_source=chatgpt.com "API Reference - OpenAI API"

---

## 70. Main 화면 와이어프레임 텍스트 설계

Main 화면은 아래 순서로 배치한다.

```text
┌──────────────────────────────┐
│ [프로필]             [알람][설정] │
├──────────────────────────────┤
│ [친구 확인하기] [친구 추가하기]   │
├──────────────────────────────┤
│ AI 자기개발 가이드               │
│ ┌──────────────────────────┐ │
│ │ 오늘 훈련 끝나고 영어 공부... │ │
│ └──────────────────────────┘ │
│                     [전송]     │
│ [오늘 추천] [이번 주 추천]       │
├──────────────────────────────┤
│ <    3월 9일 - 3월 15일    >   │
│ [월] [화] [수] [목] [금] [토] [일] │
│ [ 9] [10] [11] [12] [13] [14] [15]│
│  ·    ●    ●         ●         ·  │
├──────────────────────────────┤
│ 오늘의 일정                     │
│ ┌──────────────────────────┐ │
│ │ 08:00 - 17:00 훈련        │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ 20:30 - 21:00 영어 공부   │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

---

## 71. Main 화면 섹션별 와이어프레임 설명

### 71-1. 상단 프로필/알람/설정 영역

```text
[프로필 요약]                [알람] [설정]
```

구성 요소:

* 프로필 이미지
* 닉네임
* 짧은 상태 문구
* 우측 알람 아이콘
* 우측 설정 아이콘

동작:

* 프로필 클릭 → 프로필 관리 페이지
* 알람 클릭 → 알림 목록 페이지
* 설정 클릭 → 설정 페이지

설계 원칙:

* 메인 최상단 고정 정보
* 지나치게 큰 카드보다 가벼운 상단 바 느낌
* 프로필은 클릭 가능 영역이 충분히 넓어야 함

---

### 71-2. 친구 기능 영역

```text
[친구 확인하기]   [친구 추가하기]
```

구성 요소:

* 버튼 2개 또는 pill 버튼 2개

동작:

* 친구 확인하기 → 친구 목록
* 친구 추가하기 → 친구 검색 / 친구 요청

설계 원칙:

* 버튼 2개는 동일한 위계
* 너무 크지 않지만 확실히 눌릴 수 있어야 함
* 친구 요청 개수가 있으면 badge 표시 가능

---

### 71-3. AI 자기개발 가이드 영역

```text
AI 자기개발 가이드
┌──────────────────────────┐
│ 오늘 훈련 끝나고 영어 공부... │
└──────────────────────────┘
                    [전송]

[오늘 추천] [이번 주 추천]
```

구성 요소:

* 섹션 제목
* 질문 입력창
* 전송 버튼
* 선택형 quick action 버튼 1~2개

핵심 역할:

* 메인 화면에서 직접 AI에게 질문
* 자기개발 일정 추천의 핵심 진입점

설계 원칙:

* 메인에서 가장 중요한 기능 중 하나이므로 충분히 눈에 띄어야 함
* 검색창처럼 보이되, 일반 검색이 아니라 “가이드 요청”으로 인식되어야 함
* placeholder 문구가 매우 중요함

권장 placeholder:

* `오늘 일정에 맞게 공부 계획 짜줘`
* `이번 주 운동 루틴 추천해줘`
* `훈련 끝난 뒤 가능한 자기개발 일정 추천해줘`

---

### 71-4. 주간 캘린더 영역

```text
<   3월 9일 - 3월 15일   >
[월] [화] [수] [목] [금] [토] [일]
[ 9] [10] [11] [12] [13] [14] [15]
  ·    ●    ●         ●         ·
```

구성 요소:

* 주 이동 버튼(이전 주 / 다음 주)
* 현재 주 라벨
* 7일 헤더
* 날짜 셀
* 일정 마커

핵심 역할:

* 사용자가 “이번 주”의 흐름을 빠르게 파악
* 날짜 선택
* 오늘의 일정 섹션과 연동

설계 원칙:

* 월간 달력처럼 복잡하지 않게
* 7일만 보이므로 각 셀을 충분히 크게
* 일정 마커는 최소한으로 표현
* 오늘 날짜 / 선택 날짜 구분 명확히

---

### 71-5. 오늘의 일정 영역

```text
오늘의 일정
┌──────────────────────────┐
│ 08:00 - 17:00 훈련        │
└──────────────────────────┘
┌──────────────────────────┐
│ 20:30 - 21:00 영어 공부   │
└──────────────────────────┘
```

구성 요소:

* 섹션 제목
* 일정 카드 리스트

동작:

* 일정 카드 클릭 → 일정 상세/수정 페이지
* 선택 날짜가 바뀌면 리스트 갱신

설계 원칙:

* 카드 클릭 가능성이 직관적으로 보여야 함
* 시간 정보가 잘 보여야 함
* 너무 장식적으로 만들지 않음

---

## 72. Main 화면 Low-Fidelity 와이어프레임 버전

```text
┌────────────────────────────────┐
│ ○ 닉네임                  🔔 ⚙ │
│ 오늘도 조금씩 성장하자            │
├────────────────────────────────┤
│ [친구 확인하기] [친구 추가하기]   │
├────────────────────────────────┤
│ AI 자기개발 가이드               │
│ ┌────────────────────────────┐ │
│ │ 오늘 일정에 맞게 공부 계획 짜줘 │ │
│ └────────────────────────────┘ │
│                          [전송] │
│ [오늘 추천] [이번 주 추천]       │
├────────────────────────────────┤
│      < 3월 9일 - 3월 15일 >     │
│   월    화    수    목    금    토    일 │
│   9    10    11    12    13    14    15 │
│        ●     ●           ●            │
├────────────────────────────────┤
│ 오늘의 일정                     │
│ ┌────────────────────────────┐ │
│ │ 08:00 - 17:00 훈련          │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ 20:30 - 21:00 영어 공부     │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

---

## 73. Main 화면 Mid-Fidelity 설계 가이드

### 상단

* 좌측 프로필 요약
* 우측 아이콘 2개
* 높이는 과하지 않게 compact

### 친구 기능

* 2열 버튼
* 둥근 회색 배경 또는 연한 카드형 버튼

### AI 가이드

* 입력창이 가장 눈에 잘 들어오도록
* 입력창 높이는 모바일 기준 충분히 확보
* 전송 버튼은 명확한 action button
* quick action은 보조 역할

### 주간 캘린더

* 가로폭 전체 사용
* 날짜 셀은 손가락으로 누르기 좋게
* 일정 점은 셀 아래쪽 정렬 권장

### 오늘의 일정

* 카드 간 간격 확보
* 시간과 제목이 우선 보이도록
* 카드 클릭 시 이동 affordance 필요

---

## 74. Main 화면 UX 흐름

### 흐름 A. 일반 일정 확인

1. 사용자가 메인 진입
2. 현재 주 확인
3. 날짜 선택
4. 오늘의 일정 목록 확인
5. 일정 카드 클릭
6. 일정 상세/수정 페이지 이동

### 흐름 B. AI에게 질문

1. 사용자가 메인 진입
2. AI 자기개발 가이드 입력창에 질문 입력
3. 전송 버튼 클릭
4. AI 응답 수신
5. 추천 일정 확인
6. 적용 또는 상세 AI 화면 이동

### 흐름 C. 친구 기능 사용

1. 친구 확인하기 클릭
2. 친구 목록 확인
3. 친구 추가하기 클릭
4. 친구 검색/요청 진행

---

## 75. Main 화면 문구 가이드

### 프로필 상태 문구 예시

* 오늘도 조금씩 성장하자
* 짧게라도 해보자
* 이번 주 목표를 이어가보자

### AI 입력 placeholder 예시

* 오늘 일정에 맞게 공부 계획 짜줘
* 이번 주 운동 루틴 추천해줘
* 오늘 가능한 자기개발 일정 알려줘

### 오늘의 일정 empty state 예시

* 오늘 등록된 일정이 없어요.
* 먼저 일정을 추가하거나 AI에게 추천을 받아보세요.

---

## 76. Claude에게 주는 와이어프레임 구현 지시

1. Main 화면은 위에서 아래로 5개 섹션 구조를 유지한다.
2. 월간 캘린더가 아니라 반드시 주간 캘린더를 사용한다.
3. AI 자기개발 가이드 섹션은 검색창처럼 보이되, 일반 검색이 아니라 자연어 입력 기반 가이드 요청 UI로 구현한다.
4. 오늘의 일정 카드는 반드시 클릭 가능해야 하며, 상세/수정 페이지로 이동해야 한다.
5. 친구 영역은 “친구 확인하기 / 친구 추가하기” 두 액션이 명확히 보이게 구현한다.
6. 전체적인 스타일은 기존 미니멀 톤을 유지하되, AI 섹션이 메인의 핵심 기능으로 인식되도록 한다.

```

---

원하시면 다음으로 바로 **이 와이어프레임을 기반으로 한 React 컴포넌트 구조**나 **실제 Claude Code용 프롬프트 최종본**까지 이어서 정리해드리겠습니다.
```
