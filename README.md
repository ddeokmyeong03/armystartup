# Millog (밀로그) — 군 생활 맞춤형 AI 자기개발 강의 추천 서비스

> 병사의 군 일과와 자기개발 목표를 기반으로 **장병e음·국방전직교육원·K-MOOC** 강의와 공고를 AI가 추천하는 서비스

---

## 목차

1. [서비스 개요](#1-서비스-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [핵심 도메인 & 데이터 모델](#4-핵심-도메인--데이터-모델)
5. [API 전체 목록](#5-api-전체-목록)
6. [백엔드 구현 가이드 (NestJS)](#6-백엔드-구현-가이드-nestjs)
7. [프론트엔드 구현 가이드 (React)](#7-프론트엔드-구현-가이드-react)
8. [환경변수 & 설정](#8-환경변수--설정)
9. [데이터베이스 스키마 (PostgreSQL)](#9-데이터베이스-스키마-postgresql)
10. [배포 가이드 (Render)](#10-배포-가이드-render)
11. [구현 순서 로드맵](#11-구현-순서-로드맵)
12. [큐레이션 데이터셋 설계](#12-큐레이션-데이터셋-설계)

---

## 1. 서비스 개요

**Millog**는 군 생활 중인 병사가 자신의 일과(근무, 훈련, 점호 등)와 자기개발 목표를 등록하면,
AI가 **국방 자기개발 사업과 연계된 강의·공고·자격증 과정**을 맞춤 추천해주는 서비스입니다.

> **대회 어필 포인트**: 장병e음, 국방전직교육원 등 기존 국방 자기개발 사업 인프라를 AI로 연결하여
> 병사의 자기개발 사업 참여율을 높이고 국방 자기개발 사업을 활성화합니다.

### 핵심 기능

| 기능 | 설명 |
|---|---|
| 회원가입/로그인 | JWT 기반 인증 |
| 일정 관리 | 군 생활 일정 CRUD (반복 일정 포함) |
| 목표 관리 | 자기개발 목표 CRUD (자격증, 어학, IT, 체력, 재테크, 학업) |
| **피로도 기반 가용시간 계산** | 근무 유형·시간대·수면 패턴 기반 일일 피로도(0~10) 계산 → 자기개발 가용시간 자동 도출 |
| **AI 자기개발 로드맵** | 목표 기반 주차별 학습 경로 생성, 주 1회 AI 자동 업데이트 |
| **AI 강의/서비스 추천** | 목표·일정·피로도 기반으로 장병e음·국방전직교육원·K-MOOC 강의 자동 추천 |
| **AI 채팅 가이드** | Claude API 기반 자기개발 상담 및 강의 추천 설명 |
| 강의 저장/관리 | 추천받은 강의 저장, 닫기, 목록 조회 |
| 홈 대시보드 | 오늘 가용시간 요약(기본 가용 − 피로도 감소), 일과 시간표, 목표 진행 현황 |

### 추천 강의 출처

| 출처 | 설명 | 상태 |
|---|---|---|
| **장병e음** | 군 복무 중 수강 가능한 자기개발 강의 | 구현 완료 (큐레이션 5건) |
| **국방전직교육원** | 제대 후 취창업 지원 특강·직무교육 공고 | 구현 완료 (큐레이션 3건) |
| **K-MOOC** | 대학 수준 무료 공개 강의 | 구현 완료 (큐레이션 2건 + 필터 탭) |
| **Class 101 등** | 크리에이티브·실무 강의 | 향후 확장 |

### 개발 단계 현황

| 단계 | 내용 | 상태 |
|---|---|---|
| **1차 MVP** | 가용시간 계산, 자기개발 목표 기능 | 완료 |
| **2차 MVP** | Claude API 로드맵, Python 피로도 AI, 콘텐츠 추천 | **진행 중 (현재 단계)** |
| **프로토타입** | NOSQL DB, 암호화 알고리즘, QA 테스트 | 예정 (26년 5~6월) |
| **베타 출시** | 시제품 배포, QA 테스트 기반 베타 버전 | 예정 (26년 9월) |
| **정식 출시** | Android/iOS App 출시, 결제 시스템 | 예정 (26년 10월) |

---

## 2. 기술 스택

### 확정 스택

| 영역 | 기술 | 버전 |
|---|---|---|
| **Backend** | NestJS (Node.js) | 10.x |
| **Language** | TypeScript | 5.x |
| **ORM** | Prisma | 5.x |
| **Database** | PostgreSQL | 16 |
| **Auth** | JWT (passport-jwt) | - |
| **Validation** | class-validator, class-transformer | - |
| **API 문서** | Swagger (@nestjs/swagger) | - |
| **AI** | Anthropic Claude API (claude-haiku-4-5) | - |
| **피로도 AI** | Python (FastAPI + Pydantic) | millog-fatigue |
| **Frontend** | React + TypeScript | 19.x |
| **Build Tool** | Vite | 7.x |
| **CSS** | TailwindCSS | 4.x |
| **HTTP Client** | Axios | 1.x |
| **Routing** | React Router | 7.x |
| **날짜 처리** | DayJS | 1.x |
| **배포 (Backend)** | Render Web Service | - |
| **배포 (Frontend)** | Render Static Site | - |
| **배포 (DB)** | Render PostgreSQL | - |

### 기술 선정 이유

> Spring Boot(Java)는 메모리 512MB+ 필요로 Render 무료 플랜에 부적합.
> Node.js + NestJS는 ~128MB로 경량 실행, 빠른 Cold Start, TypeScript로 프론트와 언어 일관성 유지.
> PostgreSQL은 Render가 무료 DB로 기본 제공.

---

## 3. 프로젝트 구조

```
millog/
├── backend/                    # NestJS 백엔드
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── dto/
│   │   │       ├── signup.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── login-response.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       ├── user-response.dto.ts
│   │   │       └── update-user.dto.ts
│   │   ├── profiles/
│   │   │   ├── profiles.module.ts
│   │   │   ├── profiles.controller.ts
│   │   │   ├── profiles.service.ts
│   │   │   └── dto/
│   │   │       ├── profile-request.dto.ts
│   │   │       └── profile-response.dto.ts
│   │   ├── schedules/
│   │   │   ├── schedules.module.ts
│   │   │   ├── schedules.controller.ts
│   │   │   ├── schedules.service.ts
│   │   │   └── dto/
│   │   │       ├── create-schedule.dto.ts
│   │   │       ├── update-schedule.dto.ts
│   │   │       └── schedule-response.dto.ts
│   │   ├── goals/
│   │   │   ├── goals.module.ts
│   │   │   ├── goals.controller.ts
│   │   │   ├── goals.service.ts
│   │   │   └── dto/
│   │   │       ├── create-goal.dto.ts
│   │   │       ├── update-goal.dto.ts
│   │   │       └── goal-response.dto.ts
│   │   ├── courses/                    # 강의/공고 추천 모듈 (핵심 신규)
│   │   │   ├── courses.module.ts
│   │   │   ├── courses.controller.ts
│   │   │   ├── courses.service.ts
│   │   │   ├── course-recommendation.service.ts
│   │   │   └── dto/
│   │   │       ├── course-response.dto.ts
│   │   │       ├── course-recommendation-response.dto.ts
│   │   │       └── course-filter.dto.ts
│   │   ├── ai-plans/
│   │   │   ├── ai-plans.module.ts
│   │   │   ├── ai-plans.controller.ts
│   │   │   ├── ai-plans.service.ts
│   │   │   ├── recommendation/
│   │   │   │   ├── recommendation.interface.ts
│   │   │   │   └── rule-based.recommendation.ts
│   │   │   └── dto/
│   │   │       ├── recommend-request.dto.ts
│   │   │       ├── batch-apply.dto.ts
│   │   │       ├── adjust-plan.dto.ts
│   │   │       └── ai-plan-response.dto.ts
│   │   ├── calendar/
│   │   │   ├── calendar.module.ts
│   │   │   ├── calendar.controller.ts
│   │   │   ├── calendar.service.ts
│   │   │   └── dto/
│   │   │       ├── weekly-summary-response.dto.ts
│   │   │       ├── monthly-summary-response.dto.ts
│   │   │       └── daily-detail-response.dto.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.module.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── dto/
│   │   │       └── dashboard-home-response.dto.ts
│   │   ├── main-home/
│   │   │   ├── main-home.module.ts
│   │   │   ├── main-home.controller.ts
│   │   │   ├── main-home.service.ts
│   │   │   └── dto/
│   │   │       └── main-home-response.dto.ts
│   │   ├── ai-chat/
│   │   │   ├── ai-chat.module.ts
│   │   │   ├── ai-chat.controller.ts
│   │   │   ├── ai-chat.service.ts
│   │   │   └── dto/
│   │   │       ├── chat-request.dto.ts
│   │   │       └── chat-response.dto.ts
│   │   └── common/
│   │       ├── decorators/
│   │       │   └── current-user.decorator.ts
│   │       ├── filters/
│   │       │   └── http-exception.filter.ts
│   │       └── interceptors/
│   │           └── transform.interceptor.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts                     # 큐레이션 강의 시드 데이터
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
│
└── frontend/                   # React 프론트엔드
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── pages/
    │   │   ├── onboarding/     # OnboardingPage.tsx
    │   │   ├── auth/           # LoginPage.tsx, SignupPage.tsx
    │   │   ├── main/           # MainPage.tsx, useMainPageViewModel.ts
    │   │   ├── today/          # TodayPage.tsx
    │   │   ├── goals/          # GoalsPage.tsx, GoalCreatePage.tsx
    │   │   ├── ai/             # AiPage.tsx (강의 추천 탭 + 채팅 탭)
    │   │   ├── profile/        # ProfilePage.tsx
    │   │   └── schedules/      # ScheduleCreatePage.tsx
    │   ├── widgets/
    │   │   ├── weekly-calendar/    # WeeklyCalendarSection.tsx
    │   │   ├── daily-plan-panel/   # SelectedDatePanel.tsx
    │   │   ├── ai-guide/           # AiGuideSection.tsx
    │   │   └── friend/             # FriendActionSection.tsx
    │   └── shared/
    │       ├── lib/
    │       │   ├── apiClient.ts
    │       │   ├── auth.ts
    │       │   └── calendar.ts
    │       ├── model/
    │       │   ├── types.ts        # TypeScript 인터페이스 (CourseItem 포함)
    │       │   └── mock.ts
    │       └── ui/
    │           ├── BottomNavBar.tsx
    │           ├── Avatar.tsx
    │           ├── Chip.tsx
    │           ├── Tag.tsx
    │           └── EmptyState.tsx
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── .env.example
```

---

## 4. 핵심 도메인 & 데이터 모델

### 도메인 목록

| 도메인 | 설명 |
|---|---|
| `User` | 사용자 (병사) 계정 |
| `UserProfile` | 사용자 생활 패턴 초기 설정 |
| `Schedule` | 군 생활 일정 (근무, 훈련, 점호 등) |
| `Goal` | 자기개발 목표 |
| `AiPlan` | AI 일정 기반 자기개발 계획 |
| `Course` | 큐레이션 강의/공고 데이터 (장병e음, 국방전직교육원 등) |
| `CourseRecommendation` | 사용자별 AI 강의 추천 기록 |

### Enum 정의

```typescript
enum AuthProvider      { LOCAL, KAKAO, APPLE }
enum UserRole          { USER, ADMIN }
enum RepeatType        { NONE, DAILY, WEEKLY, MONTHLY }
enum ScheduleCategory  { MILITARY, SELF_DEV, PERSONAL, REST, OTHER }
enum GoalType          { STUDY, CERTIFICATE, EXERCISE, READING, CODING, OTHER }
enum AiPlanStatus      { RECOMMENDED, APPLIED, COMPLETED, MISSED, CANCELED }
enum PlanSourceType    { AI_GENERATED, MANUAL_ADJUSTED }
enum PlanIntensity     { LOW, MEDIUM, HIGH }

// 신규
enum CourseSource      { JANGBYEONGEEUM, DEFENSE_TRANSITION, K_MOOC, CERTIFICATE, OTHER }
enum CourseCategory    { LANGUAGE, IT, LEADERSHIP, EXERCISE, CERTIFICATE, OTHER }
enum RecommendationStatus { RECOMMENDED, SAVED, DISMISSED }
```

### Course (강의/공고) 주요 정보

| 필드 | 설명 |
|---|---|
| `id` | PK |
| `title` | 강의/공고명 |
| `source` | 출처 (JANGBYEONGEEUM, DEFENSE_TRANSITION, K_MOOC, CERTIFICATE, OTHER) |
| `category` | 분야 (LANGUAGE, IT, LEADERSHIP, EXERCISE, CERTIFICATE, OTHER) |
| `targetGoalType` | 매핑되는 GoalType (nullable) |
| `description` | 강의 설명 |
| `durationMinutes` | 예상 수강 시간 (분) |
| `url` | 원본 링크 (nullable) |
| `tags` | 키워드 배열 (예: ["토익", "영어", "청취"]) |
| `isActive` | 활성 여부 |

### CourseRecommendation (추천 기록) 주요 정보

| 필드 | 설명 |
|---|---|
| `id` | PK |
| `userId` | 사용자 FK |
| `courseId` | 강의 FK |
| `goalId` | 연관 목표 FK (nullable) |
| `reason` | GPT가 생성한 추천 이유 |
| `priority` | 추천 우선순위 (1~5) |
| `status` | RECOMMENDED / SAVED / DISMISSED |
| `recommendedAt` | 추천 시각 |

---

## 5. API 전체 목록

### 공통 응답 형식

```json
// 성공
{ "success": true,  "message": "요청이 성공했습니다.", "data": { ... } }
// 실패
{ "success": false, "message": "에러 메시지",          "data": null }
```

### 인증 (Auth) — 인증 불필요

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 (JWT 발급) |

#### POST /api/auth/signup
```json
// Request
{ "email": "soldier@army.mil.kr", "password": "Secure1234!", "nickname": "진덕명" }
// Response 201
{ "success": true, "message": "회원가입이 완료되었습니다.", "data": null }
```

#### POST /api/auth/login
```json
// Request
{ "email": "soldier@army.mil.kr", "password": "Secure1234!" }
// Response 200
{
  "success": true,
  "message": "로그인이 완료되었습니다.",
  "data": {
    "accessToken": "eyJhbGci...",
    "tokenType": "Bearer",
    "user": { "id": 1, "email": "soldier@army.mil.kr", "nickname": "진덕명", "role": "USER" }
  }
}
```

### 사용자 (Users) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/users/me` | 내 정보 조회 |
| PATCH | `/api/users/me` | 내 정보 수정 (nickname, phoneNumber) |

### 사용자 프로필 (Profiles) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/profiles` | 초기 설정 저장/수정 (upsert) |
| GET | `/api/profiles/me` | 내 프로필 조회 |

#### POST /api/profiles
```json
// Request
{
  "wakeUpTime": "06:30",
  "sleepTime": "23:00",
  "availableStudyMinutes": 120,
  "preferredPlanIntensity": "MEDIUM",
  "memo": "주중엔 저녁 훈련이 많아요"
}
```

### 일정 (Schedules) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/schedules` | 일정 생성 |
| GET | `/api/schedules` | 전체 일정 조회 |
| GET | `/api/schedules/:id` | 일정 상세 조회 |
| PUT | `/api/schedules/:id` | 일정 수정 |
| DELETE | `/api/schedules/:id` | 일정 삭제 |
| GET | `/api/schedules/by-date?date=YYYY-MM-DD` | 날짜별 일정 조회 |

#### POST /api/schedules
```json
// Request
{
  "title": "야간 점호",
  "scheduleDate": "2026-03-18",
  "startTime": "21:00",
  "endTime": "21:30",
  "repeatType": "DAILY",
  "category": "MILITARY",
  "memo": "생활관 점호"
}
// Response 201
{
  "success": true,
  "message": "일정이 생성되었습니다.",
  "data": {
    "id": 1, "title": "야간 점호", "scheduleDate": "2026-03-18",
    "startTime": "21:00", "endTime": "21:30",
    "repeatType": "DAILY", "category": "MILITARY", "memo": "생활관 점호",
    "createdAt": "2026-03-18T10:00:00"
  }
}
```

### 목표 (Goals) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/goals` | 목표 생성 |
| GET | `/api/goals` | 목표 전체 조회 |
| GET | `/api/goals/:id` | 목표 상세 조회 |
| PUT | `/api/goals/:id` | 목표 수정 |
| DELETE | `/api/goals/:id` | 목표 삭제 |

#### POST /api/goals
```json
// Request
{
  "title": "토익 공부",
  "type": "STUDY",
  "targetDescription": "토익 900점 목표",
  "preferredMinutesPerSession": 60,
  "preferredSessionsPerWeek": 5
}
// Response 201
{
  "success": true,
  "message": "목표가 생성되었습니다.",
  "data": {
    "id": 1, "title": "토익 공부", "type": "STUDY",
    "targetDescription": "토익 900점 목표",
    "preferredMinutesPerSession": 60, "preferredSessionsPerWeek": 5, "isActive": true
  }
}
```

### 강의/공고 추천 (Courses) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/courses` | 강의 목록 조회 (필터: source, category, goalType) |
| GET | `/api/courses/:id` | 강의 상세 조회 |
| GET | `/api/courses/recommend` | AI 추천 강의 목록 (목표·일정 기반) |
| POST | `/api/courses/recommendations/:id/save` | 추천 강의 저장 |
| POST | `/api/courses/recommendations/:id/dismiss` | 추천 강의 닫기 |
| GET | `/api/courses/saved` | 저장한 강의 목록 |

#### GET /api/courses/recommend
```json
// Response 200
{
  "success": true,
  "message": "AI가 강의를 추천했습니다.",
  "data": {
    "recommendations": [
      {
        "id": 1,
        "course": {
          "id": 10,
          "title": "장병e음 토익 집중과정",
          "source": "JANGBYEONGEEUM",
          "category": "LANGUAGE",
          "durationMinutes": 60,
          "url": "https://jangbyeonge.mil.kr/...",
          "tags": ["토익", "영어", "청취"]
        },
        "reason": "토익 900점 목표에 맞는 강의로, 저녁 점호 이후 빈 시간에 수강하기 적합합니다. 하루 60분씩 꾸준히 수강하면 목표 달성에 도움이 됩니다.",
        "priority": 1,
        "goalTitle": "토익 공부",
        "status": "RECOMMENDED"
      },
      {
        "id": 2,
        "course": {
          "id": 22,
          "title": "국방전직교육원 취업 특강",
          "source": "DEFENSE_TRANSITION",
          "category": "LEADERSHIP",
          "durationMinutes": 120,
          "url": "https://www.kdemtc.or.kr/...",
          "tags": ["취업", "자기소개서", "면접"]
        },
        "reason": "전역 후 취업 준비를 위한 실질적인 특강입니다. 주말 오전 시간에 수강을 권장합니다.",
        "priority": 2,
        "goalTitle": null,
        "status": "RECOMMENDED"
      }
    ]
  }
}
```

#### GET /api/courses?source=JANGBYEONGEEUM&category=LANGUAGE
```json
// Response 200
{
  "success": true,
  "message": "강의 목록을 조회했습니다.",
  "data": {
    "courses": [
      {
        "id": 10,
        "title": "장병e음 토익 집중과정",
        "source": "JANGBYEONGEEUM",
        "category": "LANGUAGE",
        "durationMinutes": 60,
        "tags": ["토익", "영어"]
      }
    ],
    "total": 1
  }
}
```

### AI 계획 (AI Plans) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/ai-plans/recommend` | AI 일정 기반 계획 추천 |
| GET | `/api/ai-plans` | 추천 계획 목록 |
| GET | `/api/ai-plans/:id` | 추천 계획 상세 |
| POST | `/api/ai-plans/:id/apply` | 계획 개별 적용 |
| PATCH | `/api/ai-plans/:id/adjust` | 계획 시간 조정 |
| POST | `/api/ai-plans/apply-batch` | 계획 일괄 적용 |
| PATCH | `/api/ai-plans/:id/complete` | 계획 완료 처리 |
| PATCH | `/api/ai-plans/:id/miss` | 계획 미완료 처리 |

### 캘린더 조회 (Calendar) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/calendar/weekly-summary?startDate=YYYY-MM-DD` | 주간 일정 마커 |
| GET | `/api/calendar/monthly-summary?year=2026&month=3` | 월간 일정 마커 |
| GET | `/api/calendar/daily-detail?date=YYYY-MM-DD` | 날짜별 통합 조회 |

#### GET /api/calendar/weekly-summary?startDate=2026-03-16
```json
{
  "success": true,
  "message": "주간 캘린더 요약을 조회했습니다.",
  "data": {
    "startDate": "2026-03-16",
    "endDate": "2026-03-22",
    "days": [
      { "date": "2026-03-16", "scheduleCount": 2, "aiPlanCount": 1, "hasSchedule": true, "hasAiPlan": true },
      { "date": "2026-03-17", "scheduleCount": 0, "aiPlanCount": 0, "hasSchedule": false, "hasAiPlan": false }
    ]
  }
}
```

### 대시보드 & 메인 홈 — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/dashboard/home` | 홈 대시보드 요약 |
| GET | `/api/main/home?startDate=YYYY-MM-DD&date=YYYY-MM-DD` | 주간+일별 통합 조회 |

### AI 채팅 (AI Chat) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/ai/chat` | GPT-4o-mini 강의 추천 상담 채팅 |

```json
// Request
{ "message": "토익 공부 어떤 강의가 좋을까?" }
// Response 200
{
  "success": true,
  "message": "AI 응답이 생성되었습니다.",
  "data": {
    "reply": "장병e음에서 제공하는 토익 집중과정을 추천합니다. 하루 60분 강의로 구성되어 있어 저녁 점호 이후 수강하기 적합합니다.",
    "timestamp": "2026-03-18T20:00:00"
  }
}
```

---

## 6. 백엔드 구현 가이드 (NestJS)

### 6-1. 초기 설정

```bash
npm install -g @nestjs/cli
nest new backend --package-manager npm
cd backend

# 핵심 패키지
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @prisma/client prisma
npm install class-validator class-transformer
npm install @nestjs/swagger swagger-ui-express
npm install bcryptjs openai

# 타입 패키지
npm install -D @types/passport-jwt @types/bcryptjs

# Prisma 초기화
npx prisma init --datasource-provider postgresql
```

### 6-2. main.ts 설정

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: process.env.FRONTEND_URL?.split(',') ?? ['http://localhost:5173'],
    credentials: false,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Millog API')
      .setDescription('군 생활 자기개발 강의 추천 플래너 API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, config));
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 6-3. 공통 응답 인터셉터

```typescript
// src/common/interceptors/transform.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: data?.message ?? '요청이 성공했습니다.',
        data: data?.data !== undefined ? data.data : data,
      })),
    );
  }
}
```

### 6-4. 글로벌 예외 필터

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    ctx.getResponse().status(status).json({
      success: false,
      message: typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message ?? '오류가 발생했습니다.',
      data: null,
    });
  }
}
```

### 6-5. CurrentUser 데코레이터

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
// request.user = { userId: number, email: string }  ← JWT 페이로드
```

### 6-6. JWT 인증

```typescript
// src/auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

```typescript
// src/auth/auth.service.ts — 핵심 로직 요약
async signup(dto: SignupDto) {
  const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) throw new ConflictException('이미 사용 중인 이메일입니다.');
  const hashed = await bcrypt.hash(dto.password, 10);
  await this.prisma.user.create({ data: { ...dto, password: hashed } });
}

async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (!user || !(await bcrypt.compare(dto.password, user.password)))
    throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
  const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
  return { accessToken, tokenType: 'Bearer', user: { id: user.id, email: user.email, nickname: user.nickname, role: user.role } };
}
```

### 6-7. 강의 추천 서비스 (하이브리드 알고리즘)

AI 추천은 **규칙 기반 필터링 → GPT 추천 이유 생성** 2단계 하이브리드 방식으로 동작합니다.

```typescript
// src/courses/course-recommendation.service.ts

@Injectable()
export class CourseRecommendationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAI,
  ) {}

  async recommend(userId: number): Promise<CourseRecommendationResponse[]> {
    // 1단계: 사용자 활성 목표 조회
    const goals = await this.prisma.goal.findMany({
      where: { userId, isActive: true },
    });

    // 2단계: 사용자 프로필 조회 (가용 학습 시간 등)
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });

    // 3단계: 목표 타입으로 강의 후보 필터링
    const candidateCourses = await this.prisma.course.findMany({
      where: {
        isActive: true,
        OR: [
          { targetGoalType: { in: goals.map(g => g.type) } },
          { targetGoalType: null }, // 범용 강의 포함
        ],
        durationMinutes: { lte: profile?.availableStudyMinutes ?? 120 },
      },
      take: 10, // 후보 최대 10개로 제한
    });

    if (candidateCourses.length === 0) return [];

    // 4단계: GPT에 후보 목록 + 사용자 컨텍스트 전달 → 추천 이유 생성
    const prompt = this.buildRecommendationPrompt(goals, profile, candidateCourses);
    const gptResponse = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `당신은 군 병사의 자기개발을 돕는 AI 가이드 '밀로그'입니다.
제공된 강의 목록 중에서 사용자의 목표와 일정에 맞는 강의를 선별하고,
각 강의에 대한 추천 이유를 한국어로 간결하게 작성하세요.
반드시 제공된 강의 목록에 있는 강의만 추천하고, 없는 강의를 만들어내지 마세요.
JSON 형식으로 응답하세요: [{"courseId": number, "reason": string, "priority": number}]`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });

    // 5단계: GPT 결과를 DB에 저장하고 응답 반환
    const parsed = JSON.parse(gptResponse.choices[0].message.content ?? '[]');
    return this.saveAndReturnRecommendations(userId, goals, candidateCourses, parsed);
  }

  private buildRecommendationPrompt(goals, profile, courses): string {
    return `
사용자 목표: ${goals.map(g => `${g.title}(${g.type})`).join(', ')}
하루 가용 학습 시간: ${profile?.availableStudyMinutes ?? 60}분
학습 강도 선호: ${profile?.preferredPlanIntensity ?? 'MEDIUM'}

추천 대상 강의 목록:
${courses.map(c => `- ID:${c.id} | ${c.title} | ${c.source} | ${c.durationMinutes}분 | 태그: ${c.tags.join(', ')}`).join('\n')}

위 강의 중 사용자 목표와 일정에 가장 적합한 강의 최대 3개를 선별하고 추천 이유를 작성해주세요.
    `.trim();
  }
}
```

### 6-8. Claude 채팅 서비스 (강의 추천 중심)

```typescript
// src/ai-chat/ai-chat.service.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async chat(message: string, userId: number): Promise<string> {
  // 사용자 저장 강의 목록을 컨텍스트로 주입 (선택적)
  const savedCourses = await this.prisma.courseRecommendation.findMany({
    where: { userId, status: 'SAVED' },
    include: { course: true },
    take: 5,
  });

  const savedContext = savedCourses.length > 0
    ? `사용자가 저장한 강의: ${savedCourses.map(r => r.course.title).join(', ')}`
    : '';

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    system: `당신은 군 병사의 자기개발을 돕는 AI 가이드 '밀로그'입니다.
장병e음, 국방전직교육원, K-MOOC 등 국방 자기개발 사업 강의를 중심으로 추천하세요.
${savedContext}
답변은 간결하고 실행 가능하게 한국어로 작성하세요.`,
    messages: [{ role: 'user', content: message }],
  });
  const content = response.content[0];
  return content.type === 'text' ? content.text : '응답을 생성할 수 없습니다.';
}
```

### 6-9. 큐레이션 시드 데이터 (prisma/seed.ts)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.course.createMany({
    data: [
      // 장병e음 강의
      {
        title: '장병e음 토익 집중과정',
        source: 'JANGBYEONGEEUM',
        category: 'LANGUAGE',
        targetGoalType: 'STUDY',
        description: '군 복무 중 토익 점수 향상을 위한 집중 강의. RC/LC 전 영역 커버.',
        durationMinutes: 60,
        url: 'https://www.jbemc.mil.kr',
        tags: ['토익', '영어', '청취', 'RC', 'LC'],
      },
      {
        title: '장병e음 컴퓨터활용능력 2급',
        source: 'JANGBYEONGEEUM',
        category: 'IT',
        targetGoalType: 'CERTIFICATE',
        description: '컴활 2급 자격증 취득을 위한 기초~실전 강의.',
        durationMinutes: 90,
        url: 'https://www.jbemc.mil.kr',
        tags: ['컴활', '자격증', '엑셀', '스프레드시트'],
      },
      {
        title: '장병e음 한국사능력검정시험',
        source: 'JANGBYEONGEEUM',
        category: 'CERTIFICATE',
        targetGoalType: 'CERTIFICATE',
        description: '한국사 1~2급 대비 강의. 군 가산점 취득 가능.',
        durationMinutes: 45,
        url: 'https://www.jbemc.mil.kr',
        tags: ['한국사', '자격증', '가산점'],
      },
      {
        title: '장병e음 독서 논술 특강',
        source: 'JANGBYEONGEEUM',
        category: 'LANGUAGE',
        targetGoalType: 'READING',
        description: '독해력 향상과 논술 작성 능력을 키우는 강의.',
        durationMinutes: 30,
        url: 'https://www.jbemc.mil.kr',
        tags: ['독서', '논술', '독해'],
      },
      {
        title: '장병e음 체력단련 프로그램',
        source: 'JANGBYEONGEEUM',
        category: 'EXERCISE',
        targetGoalType: 'EXERCISE',
        description: '체계적인 군 체력 향상 프로그램. 코어, 유산소 포함.',
        durationMinutes: 40,
        url: 'https://www.jbemc.mil.kr',
        tags: ['운동', '체력', '헬스', '코어'],
      },
      // 국방전직교육원 공고
      {
        title: '국방전직교육원 취업 특강 — 자기소개서·면접',
        source: 'DEFENSE_TRANSITION',
        category: 'LEADERSHIP',
        targetGoalType: null,
        description: '전역 후 민간 취업을 준비하는 병사를 위한 자기소개서 작성 및 면접 특강.',
        durationMinutes: 120,
        url: 'https://www.kdemtc.or.kr',
        tags: ['취업', '자기소개서', '면접', '전직'],
      },
      {
        title: '국방전직교육원 창업 교육 과정',
        source: 'DEFENSE_TRANSITION',
        category: 'LEADERSHIP',
        targetGoalType: null,
        description: '군 전역 후 창업을 희망하는 병사를 위한 창업 기초 교육.',
        durationMinutes: 180,
        url: 'https://www.kdemtc.or.kr',
        tags: ['창업', '스타트업', '비즈니스'],
      },
      {
        title: '국방전직교육원 IT 직무교육',
        source: 'DEFENSE_TRANSITION',
        category: 'IT',
        targetGoalType: 'CODING',
        description: '전역 후 IT 분야 취업을 위한 프로그래밍 기초 직무교육.',
        durationMinutes: 120,
        url: 'https://www.kdemtc.or.kr',
        tags: ['IT', '프로그래밍', '코딩', '취업'],
      },
      // K-MOOC 강의
      {
        title: 'K-MOOC 파이썬 프로그래밍 기초',
        source: 'K_MOOC',
        category: 'IT',
        targetGoalType: 'CODING',
        description: '대학 수준 파이썬 입문 강의. 서울대·연세대 교수진 참여.',
        durationMinutes: 60,
        url: 'https://www.kmooc.kr',
        tags: ['파이썬', '코딩', '프로그래밍', 'AI'],
      },
      {
        title: 'K-MOOC AI 기초와 윤리',
        source: 'K_MOOC',
        category: 'IT',
        targetGoalType: 'STUDY',
        description: '인공지능의 기초 개념과 사회적 영향, AI 윤리를 다루는 강의.',
        durationMinutes: 45,
        url: 'https://www.kmooc.kr',
        tags: ['AI', '인공지능', '윤리', '기초'],
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 강의 시드 데이터 입력 완료');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```json
// package.json에 seed 스크립트 추가
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```bash
# 시드 데이터 실행
npx prisma db seed
```

---

## 7. 프론트엔드 구현 가이드 (React)

### 7-1. 초기 설정

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install axios dayjs react-router-dom
npm install -D @tailwindcss/vite
```

### 7-2. 라우팅 구조 (App.tsx)

```tsx
// 비로그인: /onboarding → /login → /signup
// 로그인 후 하단 4탭: / (홈) | /roadmap (로드맵) | /recommend (추천) | /profile (내 정보)

<Routes>
  <Route element={<GuestRoute />}>
    <Route path="/onboarding" element={<OnboardingPage />} />
    <Route path="/login"      element={<LoginPage />} />
    <Route path="/signup"     element={<SignupPage />} />
  </Route>
  <Route element={<ProtectedRoute />}>
    <Route path="/"                  element={<MainPage />} />        {/* 홈: 가용시간 대시보드 */}
    <Route path="/roadmap"           element={<RoadmapPage />} />     {/* 로드맵: AI 학습 경로 */}
    <Route path="/recommend"         element={<AiPage />} />          {/* 추천: 강의 추천 + 채팅 */}
    <Route path="/profile"           element={<ProfilePage />} />     {/* 내 정보 */}
    <Route path="/goals"             element={<GoalsPage />} />
    <Route path="/goals/create"      element={<GoalCreatePage />} />
    <Route path="/schedules/create"  element={<ScheduleCreatePage />} />
    <Route path="/today"             element={<TodayPage />} />
  </Route>
  <Route path="*" element={<Navigate to="/onboarding" />} />
</Routes>
```

> **[Ver 2 변경]** 하단 네비게이션이 4탭(홈 / 로드맵 / 추천 / 내 정보)으로 재편됩니다.
> `/ai` → `/recommend`, 새 탭 `/roadmap` 추가 필요.

### 7-3. 인증 유틸 (auth.ts)

```typescript
// src/shared/lib/auth.ts
export const isLoggedIn  = () => !!localStorage.getItem('accessToken');
export const getToken    = () => localStorage.getItem('accessToken');
export const getNickname = () => localStorage.getItem('nickname') ?? '사용자';
export const logout      = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('nickname');
};
```

### 7-4. API 클라이언트 (apiClient.ts)

```typescript
// src/shared/lib/apiClient.ts
import axios from 'axios';
import { getToken, logout } from './auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) { logout(); window.location.href = '/login'; }
    return Promise.reject(error);
  },
);

export default apiClient;
```

### 7-5. TypeScript 인터페이스 (types.ts)

```typescript
// src/shared/model/types.ts
export interface ScheduleItem {
  id: number; title: string; scheduleDate: string;
  startTime: string; endTime: string;
  repeatType: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  category: 'MILITARY' | 'SELF_DEV' | 'PERSONAL' | 'REST' | 'OTHER';
  memo?: string;
}

export interface AiPlanItem {
  id: number; goalId: number; activityTitle: string;
  recommendedDate: string; startTime: string; endTime: string;
  status: 'RECOMMENDED' | 'APPLIED' | 'COMPLETED' | 'MISSED' | 'CANCELED';
  sourceType: 'AI_GENERATED' | 'MANUAL_ADJUSTED';
}

export interface GoalItem {
  id: number; title: string;
  type: 'STUDY' | 'CERTIFICATE' | 'EXERCISE' | 'READING' | 'CODING' | 'OTHER';
  targetDescription?: string;
  preferredMinutesPerSession: number;
  preferredSessionsPerWeek: number;
  isActive: boolean;
}

// 강의/공고 아이템
export interface CourseItem {
  id: number;
  title: string;
  source: 'JANGBYEONGEEUM' | 'DEFENSE_TRANSITION' | 'K_MOOC' | 'CERTIFICATE' | 'OTHER';
  category: 'LANGUAGE' | 'IT' | 'LEADERSHIP' | 'EXERCISE' | 'CERTIFICATE' | 'OTHER';
  durationMinutes: number;
  url?: string;
  description: string;
  tags: string[];
}

// AI 강의 추천 결과
export interface CourseRecommendationItem {
  id: number;
  course: CourseItem;
  reason: string;       // GPT가 생성한 추천 이유
  priority: number;     // 1~5
  goalTitle?: string;   // 연관 목표명
  status: 'RECOMMENDED' | 'SAVED' | 'DISMISSED';
}

export interface DayInfo {
  date: string;
  dayOfWeek: string;
  scheduleCount: number;
  aiPlanCount: number;
  isToday: boolean;
  isSelected: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
```

### 7-6. /recommend 페이지 구조 (AiPage.tsx)

```tsx
// /recommend 페이지 (구 /ai) — Ver 2 UI 기준
// 헤더: "목표 달성 강의 - 콘텐츠 추천"
// 필터 탭: 전체 | 장병e음 | 국방민군 | K-MOOC  ← K-MOOC 탭 신규 추가
// AI 챗봇 추천 배너: "피로도 기반으로 최적 강의 선별 중" (클릭 시 채팅 탭 이동)
// 탭 1: 강의 추천 — GET /api/courses/recommend 호출 후 카드 리스트 표시
// 탭 2: AI 채팅  — POST /api/ai/chat 채팅 인터페이스

// CourseRecommendationCard 컴포넌트:
// - 강의명, 출처 뱃지(장병e음/국방민군/K-MOOC), 별점, 수강 신청 버튼
// - [저장] 버튼 → POST /api/courses/recommendations/:id/save
// - [닫기] 버튼 → POST /api/courses/recommendations/:id/dismiss
// - [수강 신청] 버튼 → course.url 새 탭 열기
```

### 7-7. 홈 페이지 Ver 2 명세 (MainPage.tsx)

> 목업: `Main page 1.PNG`, `Main page 2.PNG` 기준

```
홈 페이지 구성 요소 (위에서 아래 순서):
1. 헤더
   - 로고 (Millog)
   - 인사말: "안녕하세요, {nickname}님"
   - 날짜: "2025년 4월 9일"
   - 알림 아이콘, 설정 아이콘

2. 오늘의 가용시간 카드
   - 원형 게이지: 최종 가용시간 표시 (예: 6.5h)
   - 우측 수치:
     - 기본 가용: 8.5h
     - 피로도 감소: -2h (빨간색)
     - 최종 가용: 6.5h (굵게)
   - 하단 탭: [일과 시간표] [피로도 반영] 토글

3. 일과 시간표 (탭 활성 시)
   - 시간대별 일정 리스트 (타임라인 형태)
   - 각 항목: 색상 점(파란=가용/빨간=근무/회색=취침) + 제목 + 시간 + 가용시간(h)
   - 예: 기상~일과 시작 06:00-09:00 (3h), 오전 일과 09:00-12:00 (3h) ...

4. 자기개발 목표 섹션
   - "자기개발 목표" 제목 + [전체보기 >] 링크
   - 카테고리 아이콘 가로 스크롤 (자격증/어학/IT·개발/체력/재테크/학업)
   - 진행 중인 목표 카드 (목표명, 달성률 진행 바, 목표 기간)
   - 예: 정보처리기사 취득 45%, 토익 800점 달성 30%

5. AI 목표 분석 완료 배너 (하단 고정)
   - "AI 목표 분석 완료" + 예상 기간 메시지
   - [확인] 버튼 → /roadmap 이동
```

### 7-8. 로드맵 페이지 명세 (RoadmapPage.tsx) — 신규

> 목업: `로드맵 page 1.PNG`, `로드맵 page 2.PNG` 기준

```
로드맵 페이지 구성 요소:
1. 헤더: "AI 맞춤 학습 경로 - 나의 로드맵"

2. 현재 목표 카드
   - 목표명 (예: "정보처리기사 취득 플랜")
   - 업데이트 횟수 뱃지 (예: "3차 업데이트")
   - 진행률 바 (예: 35%)
   - 다음 업데이트 날짜 (예: "다음 업데이트: 3일 후")
   - 통계: 총 기간(12주) / 완료 단계(1/4) / 예상 성공률(78%)

3. 단계별 학습 계획 (아코디언)
   - 완료: 초록 체크 아이콘 + 단계명 + 세부 항목 목록
   - 진행중: 보라색 "진행중" 뱃지 + 확장 표시
   - 예정: 회색 아이콘

4. 주 1회 AI 로드맵 자동 업데이트 배너
   - "학습 진도와 목표 변화를 반영해 최적화됩니다"

신규 파일: frontend/src/pages/roadmap/RoadmapPage.tsx
API: GET /api/ai-plans/roadmap → 주차별 학습 계획 반환
```

### 7-9. 내 정보 페이지 Ver 2 명세 (ProfilePage.tsx)

> 목업: `내 정보 page 1.PNG`, `내 정보 page 2.PNG` 기준

```
내 정보 페이지 구성 요소:
1. 프로필 헤더 (다크 배경)
   - 아바타 아이콘
   - 이름 + 소속 (예: "육군 제00사단·병장")
   - 전역 D-day 뱃지 (예: "전역 D-180")
   - 진행 중인 목표 수 뱃지 (예: "목표 2개 진행중")

2. 나의 활동 요약 카드
   - 학습 일수 | 완료 강의 | 목표 달성률

3. 설정 메뉴 리스트
   - 계정 설정 >
   - 알림 설정 >
   - 일과 관리 >
   - 통계 및 분석 >
   - 보안 정책 >
   - 도움말 / 문의 >

4. 보안 정책 섹션 (확장 시)
   - 데이터 암호화: "앱 내부에서 암호화 후 전송"
   - 안전한 전송: "암호화된 데이터를 내부 API로 전송하여 이중 보안 유지"
   - 자동 데이터 파기: "가입 후 1개월 이내 자동 파기"
   - 군 보안 규정 완전 준수 배너

5. 앱 버전 표시: "Millog v1.0.0 · © 2025 Millog"
```

### 7-10. 하단 네비게이션 (BottomNavBar.tsx) — Ver 2 업데이트

```tsx
// 현재: [홈] [캘린더] [AI] [프로필] (4탭 but 구조 상이)
// Ver 2: [홈 /] [로드맵 /roadmap] [추천 /recommend] [내 정보 /profile]
// 아이콘: 집 아이콘 | 지도 아이콘 | 재생 아이콘 | 사람 아이콘
// 활성 탭: 파란색 채우기, 비활성: 회색
```

### 7-7. vite.config.ts (개발 프록시)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true }
    }
  }
});
```

---

## 8. 환경변수 & 설정

### 백엔드 (.env.example)

```bash
# Render PostgreSQL (Internal URL)
DATABASE_URL="postgresql://username:password@host:5432/millog?schema=public"

# JWT
JWT_SECRET="랜덤-64바이트-Base64-키"
JWT_EXPIRATION="3600"    # 초 단위 (1시간)

# Anthropic (Claude API)
ANTHROPIC_API_KEY="sk-ant-..."

# CORS (콤마로 구분하여 여러 도메인 허용)
FRONTEND_URL="https://millog-frontend.onrender.com,http://localhost:5173"

# 서버
PORT=3000
NODE_ENV="development"
```

### 프론트엔드 (.env.example)

```bash
# 로컬 개발: 빈 값 → Vite 프록시(/api → localhost:3000) 사용
VITE_API_BASE_URL=

# Render 배포 시:
# VITE_API_BASE_URL=https://millog-api.onrender.com
```

### JWT 시크릿 키 생성

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 9. 데이터베이스 스키마 (PostgreSQL)

### Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum AuthProvider      { LOCAL KAKAO APPLE }
enum UserRole          { USER ADMIN }
enum RepeatType        { NONE DAILY WEEKLY MONTHLY }
enum ScheduleCategory  { MILITARY SELF_DEV PERSONAL REST OTHER }
enum GoalType          { STUDY CERTIFICATE EXERCISE READING CODING OTHER }
enum AiPlanStatus      { RECOMMENDED APPLIED COMPLETED MISSED CANCELED }
enum PlanSourceType    { AI_GENERATED MANUAL_ADJUSTED }
enum PlanIntensity     { LOW MEDIUM HIGH }
enum CourseSource      { JANGBYEONGEEUM DEFENSE_TRANSITION K_MOOC CERTIFICATE OTHER }
enum CourseCategory    { LANGUAGE IT LEADERSHIP EXERCISE CERTIFICATE OTHER }
enum RecommendationStatus { RECOMMENDED SAVED DISMISSED }

model User {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  password    String
  nickname    String
  phoneNumber String?
  provider    AuthProvider @default(LOCAL)
  role        UserRole     @default(USER)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  profile             UserProfile?
  schedules           Schedule[]
  goals               Goal[]
  aiPlans             AiPlan[]
  courseRecommendations CourseRecommendation[]

  @@map("users")
}

model UserProfile {
  id                     Int           @id @default(autoincrement())
  userId                 Int           @unique
  wakeUpTime             String        // "06:30"
  sleepTime              String        // "23:00"
  availableStudyMinutes  Int           @default(60)
  preferredPlanIntensity PlanIntensity @default(MEDIUM)
  memo                   String?
  createdAt              DateTime      @default(now())
  updatedAt              DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_profiles")
}

model Schedule {
  id           Int              @id @default(autoincrement())
  userId       Int
  title        String
  scheduleDate String           // "YYYY-MM-DD"
  startTime    String           // "HH:mm"
  endTime      String           // "HH:mm"
  repeatType   RepeatType       @default(NONE)
  category     ScheduleCategory @default(PERSONAL)
  memo         String?
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, scheduleDate])
  @@map("schedules")
}

model Goal {
  id                         Int      @id @default(autoincrement())
  userId                     Int
  title                      String
  type                       GoalType @default(STUDY)
  targetDescription          String?
  preferredMinutesPerSession Int      @default(60)
  preferredSessionsPerWeek   Int      @default(3)
  isActive                   Boolean  @default(true)
  createdAt                  DateTime @default(now())
  updatedAt                  DateTime @updatedAt

  user                  User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  aiPlans               AiPlan[]
  courseRecommendations CourseRecommendation[]

  @@index([userId])
  @@map("goals")
}

model AiPlan {
  id              Int            @id @default(autoincrement())
  userId          Int
  goalId          Int
  activityTitle   String
  recommendedDate String         // "YYYY-MM-DD"
  startTime       String         // "HH:mm"
  endTime         String         // "HH:mm"
  status          AiPlanStatus   @default(RECOMMENDED)
  sourceType      PlanSourceType @default(AI_GENERATED)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  goal Goal @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@index([userId, recommendedDate])
  @@map("ai_plans")
}

model Course {
  id              Int            @id @default(autoincrement())
  title           String
  source          CourseSource
  category        CourseCategory
  targetGoalType  GoalType?
  description     String?        @db.Text
  durationMinutes Int            @default(60)
  url             String?
  tags            String[]
  isActive        Boolean        @default(true)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  recommendations CourseRecommendation[]

  @@index([source, category])
  @@map("courses")
}

model CourseRecommendation {
  id            Int                  @id @default(autoincrement())
  userId        Int
  courseId      Int
  goalId        Int?
  reason        String               @db.Text
  priority      Int                  @default(1)
  status        RecommendationStatus @default(RECOMMENDED)
  recommendedAt DateTime             @default(now())

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)
  goal   Goal?   @relation(fields: [goalId], references: [id])

  @@index([userId, status])
  @@map("course_recommendations")
}
```

### 마이그레이션 명령

```bash
# 초기 마이그레이션 생성 + 적용
npx prisma migrate dev --name init

# 강의 추천 테이블 추가 마이그레이션
npx prisma migrate dev --name add-course-recommendation

# 프로덕션 마이그레이션 적용
npx prisma migrate deploy

# Prisma Client 재생성
npx prisma generate

# 시드 데이터 주입
npx prisma db seed

# DB 상태 확인 (GUI)
npx prisma studio
```

---

## 10. 배포 가이드 (Render)

### 10-1. Render 서비스 구성

| 서비스 타입 | 이름 (예시) | 설명 |
|---|---|---|
| PostgreSQL | `millog-db` | 데이터베이스 |
| Web Service | `millog-api` | NestJS 백엔드 |
| Static Site | `millog-frontend` | React 프론트엔드 |

### 10-2. PostgreSQL 생성

1. Render Dashboard → New → PostgreSQL
2. 이름: `millog-db`, 플랜: Free
3. 생성 완료 후 `Internal Database URL` 복사

### 10-3. 백엔드 Web Service 설정

```
Name:            millog-api
Runtime:         Node
Root Directory:  backend
Build Command:   npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed && npm run build
Start Command:   node dist/main
```

**환경변수 (Render Dashboard → Environment):**

```
DATABASE_URL   = (PostgreSQL Internal URL)
JWT_SECRET     = (랜덤 64바이트 Base64 키)
JWT_EXPIRATION = 3600
ANTHROPIC_API_KEY = (Anthropic API 키 — Claude Haiku 사용)
FRONTEND_URL   = https://millog-frontend.onrender.com
NODE_ENV       = production
PORT           = 3000
```

**package.json scripts:**

```json
{
  "scripts": {
    "build":      "nest build",
    "start":      "node dist/main",
    "start:dev":  "nest start --watch",
    "start:prod": "node dist/main"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### 10-4. 프론트엔드 Static Site 설정

```
Name:              millog-frontend
Root Directory:    frontend
Build Command:     npm install && npm run build
Publish Directory: dist
```

**환경변수:**

```
VITE_API_BASE_URL = https://millog-api.onrender.com
```

**SPA 라우팅 처리 — `frontend/public/_redirects`:**

```
/*  /index.html  200
```

### 10-5. 배포 순서

```
1. GitHub 저장소에 코드 Push
2. Render → PostgreSQL 생성 → Internal URL 복사
3. Render → Web Service(millog-api) 생성 → 환경변수 입력
   (빌드 시 migrate deploy + db seed 자동 실행)
4. Render → Static Site(millog-frontend) 생성 → VITE_API_BASE_URL 입력
5. millog-api의 FRONTEND_URL을 millog-frontend URL로 업데이트
6. 양쪽 배포 완료 확인 후 E2E 테스트
```

### 10-6. 무료 플랜 주의사항

| 항목 | 내용 |
|---|---|
| Web Service Sleep | 15분 비활성 시 슬립 → 첫 요청 ~30초 지연 |
| PostgreSQL 만료 | 무료 DB는 90일 후 삭제 → 유료 전환 또는 Supabase 활용 |
| 해결책 | Starter 플랜 ($7/월) 또는 Supabase 무료 PostgreSQL 연동 |

---

## 11. 구현 순서 로드맵

### 1단계: 프로젝트 기반 세팅
- [x] NestJS 프로젝트 생성 (`nest new backend`)
- [x] Prisma + PostgreSQL 연결
- [x] 공통 구조: TransformInterceptor, HttpExceptionFilter, CurrentUser 데코레이터
- [x] Swagger 설정
- [x] 환경변수 `.env` 구성

### 2단계: 인증/사용자
- [x] `User` Prisma 모델
- [x] `AuthModule`: signup, login, JWT 발급
- [x] JWT Strategy + JwtAuthGuard
- [x] `UsersModule`: 내 정보 조회/수정

### 3단계: 사용자 초기 설정
- [x] `UserProfile` Prisma 모델 (dischargeDate, unitName, rankName 포함)
- [x] `ProfilesModule`: upsert, 조회

### 4단계: 일정 관리
- [x] `Schedule` Prisma 모델
- [x] `SchedulesModule`: CRUD + 날짜별 조회

### 5단계: 목표 관리
- [x] `Goal` Prisma 모델 (progressPercent 포함)
- [x] `GoalsModule`: CRUD

### 6단계: 강의 추천 (핵심 기능)
- [x] `Course`, `CourseRecommendation` Prisma 모델
- [x] 큐레이션 시드 데이터 입력 (`prisma/seed.ts`)
  - 장병e음 강의 5건
  - 국방전직교육원 공고 3건
  - K-MOOC 강의 2건 + K-MOOC API 연동 (kmooc-sync.service.ts)
- [x] `CourseRecommendationService`: 규칙 기반 필터링 + Claude 추천 이유 생성
- [x] `CoursesModule`: 강의 목록/상세/AI추천/저장/닫기 API

### 7단계: AI 일정 기반 계획
- [x] `AiPlan` Prisma 모델
- [x] 규칙 기반 추천 엔진 (빈 시간 계산 알고리즘)
- [x] `AiPlansModule`: 추천/적용/조정/완료/일괄적용

### 8단계: 캘린더 & 대시보드
- [x] `CalendarModule`: weekly-summary, monthly-summary, daily-detail
- [x] `DashboardModule`: 홈 요약 (가용시간·피로도·일과 시간표·목표·로드맵 요약)

### 9단계: AI 채팅 + 로드맵
- [x] Anthropic SDK 연동 (`@anthropic-ai/sdk`)
- [x] `AiChatModule`: Claude Haiku 기반 자기개발 상담 채팅
- [x] `RoadmapModule`: 목표 기반 4단계 주차별 로드맵 AI 생성/업데이트

### 10단계: 피로도 AI (Python)
- [x] `millog-fatigue` FastAPI 모듈 생성
- [x] 피로도 공식 구현: `F = clamp(Σ(Di × Ti × hi) × C + P - R, 0, 10)`
- [x] 5개 테스트 케이스 전체 통과

### 11단계: 프론트엔드 (Ver 2 UI 기준)
- [x] Vite + React + TypeScript 프로젝트 생성
- [x] TailwindCSS 설정
- [x] 라우팅 구조 (ProtectedRoute, GuestRoute)
- [x] 인증 유틸 + Axios 클라이언트
- [x] 온보딩 / 로그인 / 회원가입 페이지
- [x] **홈 페이지 (/)**: 가용시간 원형 게이지, 피로도 수준, 오늘 일과 시간표, 로드맵 요약, 목표 진행률 카드
- [x] **로드맵 페이지 (/roadmap)**: AI 맞춤 학습 경로, 단계별 아코디언, 업데이트 배너, 목표별 탭
- [x] **/recommend 페이지**: 강의 추천 탭 (AI 추천/저장한 강의) + AI 채팅 탭
- [x] **내 정보 페이지 (/profile)**: 전역 D-day 배지, 활동 요약 카드, 계급/부대 입력, 보안 정책
- [x] 하단 4탭 네비게이션 (홈 / 로드맵 / 추천 / 내 정보)
- [x] 일정/목표 CRUD 페이지

### 12단계: Render 배포
- [x] `render.yaml` 배포 설정 완료 (PostgreSQL + Web Service + Static Site)
- [x] `prisma migrate deploy` + `prisma db seed` 자동 실행 설정
- [ ] PostgreSQL 서비스 생성 후 환경변수 설정
  - `DATABASE_URL`, `JWT_SECRET`, `ANTHROPIC_API_KEY`, `FRONTEND_URL`
- [ ] 백엔드/프론트엔드 실제 배포 및 E2E 테스트

---

## 12. 큐레이션 데이터셋 설계

### 12-1. 큐레이션 방식 채택 이유

실시간 스크래핑 대신 수동 큐레이션 방식을 채택한 이유:

| 비교 항목 | 실시간 스크래핑 | 큐레이션 데이터셋 |
|---|---|---|
| 대회 시연 안정성 | 낮음 (네트워크·사이트 의존) | 높음 (DB에 직접 저장) |
| 구현 복잡도 | 높음 (크롤러 + 파싱) | 낮음 (수동 입력) |
| 추천 품질 제어 | 어려움 | 직접 선별 가능 |
| 장병e음 접근 | 군 내부망으로 불가 | 수동 입력으로 해결 |

### 12-2. 데이터 구조 및 필드 설명

| 필드 | 역할 |
|---|---|
| `source` | 출처 구분. 프론트에서 뱃지 색상·라벨 분기에 사용 |
| `category` | 분야 분류. 필터링 및 GoalType과의 1차 매핑에 사용 |
| `targetGoalType` | 목표 타입과 직접 매핑. null이면 범용 강의로 모든 사용자에게 노출 |
| `durationMinutes` | 사용자 `availableStudyMinutes`와 비교해 수강 가능 여부 판단 |
| `tags` | GPT 프롬프트 컨텍스트 및 키워드 검색에 활용 |

### 12-3. 출처별 수집 전략

| 출처 | 수집 방법 | 비고 |
|---|---|---|
| **장병e음** | 수동 입력 (군 내부망 접근 필요) | 화면 캡처·공식 안내 기반 |
| **국방전직교육원** | `kdemtc.or.kr` 공개 포털에서 수동 수집 | 연 4회 공고 주기 |
| **K-MOOC** | `kmooc.kr` 공개 강의 목록 수동 선별 | IT·어학 중심 선택 |
| **자격증** | 국가자격증 DB 기반 수동 선별 | 컴활·한국사·토익 중심 |

### 12-4. 향후 확장 방안

대회 이후 실제 서비스로 확장 시 아래 구조를 활용한다.

**Admin API 추가:**
```
POST /api/admin/courses       강의 수동 등록
PUT  /api/admin/courses/:id   강의 정보 수정
POST /api/admin/courses/sync  외부 소스 자동 동기화 트리거
```

**자동 수집 Cron (NestJS Scheduler):**
```typescript
// @Cron('0 0 * * 1') — 매주 월요일 00:00
async syncDefenseTransitionCourses() {
  // 국방전직교육원 공개 포털 스크래핑 후 DB 갱신
}
```

**K-MOOC 공개 API:**
K-MOOC는 공공데이터포털(data.go.kr)을 통해 API를 제공하므로,
추후 API 키 발급 후 자동 동기화 가능.

---

## 13. 수익 구조 (B2P + B2G)

### 13-1. B2P — 장병 구독 모델

| 구분 | 가격 | 기능 |
|---|---|---|
| **무료** | 0원 | 가용시간 분석, 분기별 로드맵(1회), 강의 추천(3강좌 이내) |
| **유료** | 월 2,990원 | 가용시간별 주간/월간 로드맵(월 4회), 강의 추천(무제한), 자기개발 현황 상세 피드백 |
| **초기 프로모션** | 3개월 무료 | 베타 가입자 대상 전 기능 무료 제공 |

> 시장 규모 추정: 육군 장병 144,594명 × 자기개발 경험 비율 40% × 2,990원 = **약 1.7억 원/월 SOM**

### 13-2. B2G — 국방부 협약

| 단계 | 내용 | 목표 시기 |
|---|---|---|
| 사업 협약 | 장병 자기개발 지원사업 홍보 서비스로 MOU 체결 | 27년 하반기 |
| 인사이트 제공 | 장병 자기개발 데이터 기반 인사이트 제공 | 27년 이후 |
| 예산 목표 | 26년도 잔여 예산 121억 원의 10% 점유 | 27~28년 |

### 13-3. 진출 전략

| 단계 | 내용 | 시기 |
|---|---|---|
| 1단계 | 군 커뮤니티·SNS 기반 WebApp MVP 배포, 트래킹 데이터 확보 | 26년 상반기 |
| 2단계 | Google Play / App Store 정식 배포, 구독 서비스 이용률 확보 | 26년 하반기 |
| 3단계 | 국방부 협약을 위한 서비스 고도화, 데이터 확보 | 27년 |
| 4단계 | 국방부 MOU 체결, 국내 자기개발 시장 진출 | 28년~ |

---

## 14. 보안 정책

### 14-1. 수집 데이터 범위

| 분류 | 항목 | 처리 방식 |
|---|---|---|
| **개인정보** | 이름, 나이, 생년월일, 이메일, 휴대폰 번호 | 암호화 저장 |
| **일정정보** | 훈련, 출타 등 민감 일정 | 암호문으로 관리 |
| **사용정보** | 트래킹 데이터, API 출입 데이터 | 익명 집계 후 활용 |

### 14-2. 데이터 처리 방침

- **전송**: App 내부에서 암호화 후 내부 API로 전송
- **저장**: 이미 암호화된 데이터를 저장 (이중 암호화)
- **파기**: 서비스 유지에 필요한 데이터 외 모든 데이터는 **가입 후 1개월 이내 파기**

### 14-3. 군 보안 규정 준수

> 국방부 정보보호 지침에 따라 운영됩니다.

- 데이터 암호화: 앱 내부에서 암호화 후 전송, 민감한 일정 정보는 암호문으로 관리
- 안전한 전송: 암호화된 데이터를 내부 API로 전송하여 이중 보안 유지
- 자동 데이터 파기: 서비스 유지에 필요한 데이터 외 모든 데이터 가입 후 1개월 이내 자동 파기

---

> **Millog** — 군 생활 속에서도 성장하는 병사를 위한 AI 자기개발 강의 추천 파트너
