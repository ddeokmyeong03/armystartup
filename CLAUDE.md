# CLAUDE.md

## 1. 프로젝트 개요

이 프로젝트는 **군 생활 맞춤형 AI 자기개발 플래너** 서비스의 백엔드입니다.

서비스의 핵심 목적은 다음과 같습니다.

- 병사가 자신의 생활 일정을 직접 등록/수정/삭제할 수 있다.
- 병사의 생활 일정과 자기개발 목표를 기반으로 AI가 자기개발 계획을 추천한다.
- 추천된 계획은 실제 일정표에 반영될 수 있다.
- 병사는 매일 일정과 자기개발 계획을 확인하고 수행 여부를 기록할 수 있다.
- 군 생활 특성상 일정 변동이 잦기 때문에, 변경된 일정에 맞춰 AI 계획을 재추천할 수 있어야 한다.

이 프로젝트는 우선 **백엔드 MVP**를 먼저 구축한다.
프론트엔드는 추후 React 기반으로 API 연동 예정이다.
백엔드는 API 서버 중심으로 설계하며, 이후 모바일/WebApp과 쉽게 연결될 수 있어야 한다.

---

## 2. 개발 환경 및 전제

### 개발 환경
- IDE: GitHub Codespaces
- 협업/개발 보조: Claude Code
- Backend Framework: Spring Boot
- Language: Java 17
- Build Tool: Gradle
- Database: Google Cloud MySQL
- ORM: Spring Data JPA
- Security: Spring Security + JWT
- Validation: Bean Validation
- API 문서화: Swagger / Springdoc OpenAPI
- 테스트: JUnit5, Spring Boot Test
- 시간 처리: `LocalDate`, `LocalTime`, `LocalDateTime`

### 기본 원칙
- 초기 단계는 **MVP 구현 우선**
- 프론트엔드가 없어도 Postman/Swagger로 검증 가능해야 함
- RESTful API 중심으로 설계
- 도메인 중심 구조를 지향
- 비즈니스 로직은 Controller가 아니라 Service에 위치
- Entity를 API 응답에 직접 노출하지 않고 DTO를 사용
- 예외 처리, 응답 구조, 네이밍을 일관성 있게 유지

---

## 3. MVP 범위

초기 MVP에서 반드시 포함할 기능은 다음과 같다.

### 사용자/인증
- 회원가입
- 로그인
- JWT 기반 인증
- 사용자 기본 정보 조회
- 사용자 초기 설정 저장

### 일정 관리
- 일정 생성
- 일정 목록 조회
- 일정 상세 조회
- 일정 수정
- 일정 삭제

### 목표 관리
- 자기개발 목표 생성
- 목표 조회
- 목표 수정
- 목표 삭제

### AI 계획 추천
- 사용자의 일정 + 목표를 바탕으로 자기개발 계획 추천 요청
- 추천 결과 저장
- 추천 계획 조회
- 추천 계획 적용
- 추천 계획 재생성

### 계획 실행 관리
- 오늘의 일정/계획 조회
- 계획 수행 완료 체크
- 계획 미완료 상태 기록

---

## 4. 핵심 도메인

이 프로젝트의 핵심 도메인은 아래와 같다.

### 1) User
서비스 사용자(병사)

주요 정보:
- id
- email
- password
- nickname
- phoneNumber
- provider (LOCAL, KAKAO, APPLE)
- role
- createdAt
- updatedAt

### 2) UserProfile
사용자의 초기 설정 및 생활 패턴 정보

주요 정보:
- userId
- wakeUpTime
- sleepTime
- weekdayPattern
- weekendPattern
- availableStudyMinutes
- preferredPlanIntensity
- memo

### 3) Schedule
사용자의 일반 일정(근무, 훈련, 점호, 개인 일정 등)

주요 정보:
- id
- userId
- title
- scheduleDate
- startTime
- endTime
- repeatType
- memo
- category
- createdAt
- updatedAt

### 4) Goal
사용자의 자기개발 목표

주요 정보:
- id
- userId
- title
- type
- targetDescription
- preferredMinutesPerSession
- preferredSessionsPerWeek
- isActive

예시:
- 토익 공부
- 컴활 자격증
- 독서
- 운동
- 코딩 공부

### 5) AiPlan
AI가 생성한 자기개발 추천 계획

주요 정보:
- id
- userId
- goalId
- recommendedDate
- startTime
- endTime
- activityTitle
- status (RECOMMENDED, APPLIED, COMPLETED, MISSED)
- sourceType (AI_GENERATED, MANUAL_ADJUSTED)
- createdAt
- updatedAt

### 6) DailyPlanSummary (선택적 View/Response)
DB Entity일 수도 있고, 조합 응답 DTO일 수도 있음

용도:
- 특정 날짜의 일반 일정 + 자기개발 계획을 통합 조회

---

## 5. 우선 구현 순서

Claude는 아래 순서대로 구현을 진행한다.

### 1단계: 프로젝트 기반 세팅
- Spring Boot 프로젝트 생성
- Gradle 설정
- application.yml 분리 (local/dev)
- MySQL 연결
- JPA 설정
- 공통 응답 구조 생성
- 공통 예외 처리 구조 생성
- Swagger 설정

### 2단계: 인증/사용자
- User Entity
- 회원가입 API
- 로그인 API
- JWT 발급/검증
- 인증 필터 구성
- 사용자 정보 조회 API

### 3단계: 사용자 초기 설정
- UserProfile Entity
- 초기 설정 저장 API
- 초기 설정 조회/수정 API

### 4단계: 일정 관리
- Schedule Entity
- 일정 CRUD API
- 날짜별/기간별 일정 조회 API

### 5단계: 목표 관리
- Goal Entity
- 목표 CRUD API

### 6단계: AI 계획 추천
- AI 추천 로직 인터페이스 설계
- 일정 기반 빈 시간 계산 로직 구현
- 목표 기반 추천 시간 배치
- 추천 계획 저장 API
- 추천 계획 적용 API
- 추천 계획 재생성 API

### 7단계: 계획 실행 관리
- 오늘의 일정/계획 조회 API
- 수행 완료 체크 API
- 상태 변경 API

---

## 6. AI 기능 구현 원칙

초기 MVP에서는 실제 외부 LLM 연동보다, **규칙 기반 추천 엔진**으로 먼저 시작한다.

### 초기 AI 추천 방식
- 특정 날짜의 기존 일정 목록을 조회
- 사용자의 기상/취침 시간 확인
- 일정이 없는 빈 시간대를 계산
- 목표의 희망 시간/빈도를 반영
- 너무 이른 시간, 너무 늦은 시간, 과도한 연속 배치를 피함
- 하루 추천량 제한
- 사용자가 수행 가능한 범위의 자기개발 계획 생성

### 이후 확장 가능성
- OpenAI/Claude API 기반 자연어 추천 설명 추가
- 사용자의 수행 이력 기반 개인화 추천
- 계획 실패 패턴 반영
- “오늘은 훈련이 많아 20분 독서만 추천” 같은 설명형 추천

즉, 현재는:
- **추천 엔진은 서비스 내부 로직으로 구현**
- 나중에 외부 AI API 연동 가능한 구조로 추상화

예시:
- `AiRecommendationService` 인터페이스
- `RuleBasedAiRecommendationService` 구현체
- 이후 `LlmAiRecommendationService` 추가 가능

---

## 7. API 설계 원칙

### 기본 규칙
- RESTful 하게 설계
- URL은 복수형 resource 사용
- 인증 필요한 API는 JWT 필요
- 응답은 JSON
- 성공/실패 응답 구조 통일
- Controller는 요청/응답 처리만 담당
- 실제 로직은 Service에서 처리

### 예시 응답 형식

```json
{
  "success": true,
  "message": "일정이 생성되었습니다.",
  "data": {
    "id": 1,
    "title": "점호",
    "scheduleDate": "2026-03-07",
    "startTime": "21:00",
    "endTime": "21:30"
  }
}

src
└── main
    ├── java/com/example/selfdev
    │   ├── SelfDevApplication.java
    │   │
    │   ├── global
    │   │   ├── config
    │   │   │   ├── SecurityConfig.java
    │   │   │   ├── SwaggerConfig.java
    │   │   │   └── JpaConfig.java
    │   │   ├── auth
    │   │   │   ├── JwtTokenProvider.java
    │   │   │   ├── JwtAuthenticationFilter.java
    │   │   │   ├── CustomUserDetailsService.java
    │   │   │   └── CustomUserDetails.java
    │   │   ├── common
    │   │   │   ├── BaseEntity.java
    │   │   │   ├── ApiResponse.java
    │   │   │   └── ErrorResponse.java
    │   │   ├── exception
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   ├── BusinessException.java
    │   │   │   └── ErrorCode.java
    │   │   └── util
    │   │       ├── DateTimeUtils.java
    │   │       └── SecurityUtils.java
    │   │
    │   ├── domain
    │   │   ├── user
    │   │   │   ├── controller
    │   │   │   │   └── UserController.java
    │   │   │   ├── dto
    │   │   │   │   ├── request
    │   │   │   │   │   ├── SignUpRequest.java
    │   │   │   │   │   └── LoginRequest.java
    │   │   │   │   └── response
    │   │   │   │       ├── LoginResponse.java
    │   │   │   │       └── UserResponse.java
    │   │   │   ├── entity
    │   │   │   │   ├── User.java
    │   │   │   │   ├── UserRole.java
    │   │   │   │   └── AuthProvider.java
    │   │   │   ├── repository
    │   │   │   │   └── UserRepository.java
    │   │   │   └── service
    │   │   │       ├── AuthService.java
    │   │   │       └── UserService.java
    │   │   │
    │   │   ├── profile
    │   │   │   ├── controller
    │   │   │   │   └── ProfileController.java
    │   │   │   ├── dto
    │   │   │   │   ├── request
    │   │   │   │   └── response
    │   │   │   ├── entity
    │   │   │   │   └── UserProfile.java
    │   │   │   ├── repository
    │   │   │   │   └── UserProfileRepository.java
    │   │   │   └── service
    │   │   │       └── UserProfileService.java
    │   │   │
    │   │   ├── schedule
    │   │   │   ├── controller
    │   │   │   │   └── ScheduleController.java
    │   │   │   ├── dto
    │   │   │   │   ├── request
    │   │   │   │   │   ├── ScheduleCreateRequest.java
    │   │   │   │   │   └── ScheduleUpdateRequest.java
    │   │   │   │   └── response
    │   │   │   │       ├── ScheduleResponse.java
    │   │   │   │       └── ScheduleListResponse.java
    │   │   │   ├── entity
    │   │   │   │   ├── Schedule.java
    │   │   │   │   ├── RepeatType.java
    │   │   │   │   └── ScheduleCategory.java
    │   │   │   ├── repository
    │   │   │   │   └── ScheduleRepository.java
    │   │   │   └── service
    │   │   │       └── ScheduleService.java
    │   │   │
    │   │   ├── goal
    │   │   │   ├── controller
    │   │   │   │   └── GoalController.java
    │   │   │   ├── dto
    │   │   │   │   ├── request
    │   │   │   │   └── response
    │   │   │   ├── entity
    │   │   │   │   ├── Goal.java
    │   │   │   │   └── GoalType.java
    │   │   │   ├── repository
    │   │   │   │   └── GoalRepository.java
    │   │   │   └── service
    │   │   │       └── GoalService.java
    │   │   │
    │   │   ├── aiplan
    │   │   │   ├── controller
    │   │   │   │   └── AiPlanController.java
    │   │   │   ├── dto
    │   │   │   │   ├── request
    │   │   │   │   └── response
    │   │   │   ├── entity
    │   │   │   │   ├── AiPlan.java
    │   │   │   │   ├── AiPlanStatus.java
    │   │   │   │   └── PlanSourceType.java
    │   │   │   ├── repository
    │   │   │   │   └── AiPlanRepository.java
    │   │   │   └── service
    │   │   │       ├── AiPlanService.java
    │   │   │       ├── AiRecommendationService.java
    │   │   │       └── RuleBasedAiRecommendationService.java
    │   │   │
    │   │   └── dailyplan
    │   │       ├── controller
    │   │       │   └── DailyPlanController.java
    │   │       ├── dto
    │   │       │   └── response
    │   │       └── service
    │   │           └── DailyPlanQueryService.java
    │   │
    │   └── infrastructure
    │       ├── external
    │       │   └── ai
    │       │       └── placeholder
    │       └── persistence
    │
    └── resources
        ├── 
        ication.yml
        ├── application-local.yml
        ├── application-dev.yml
        └── data.sql


## 19. 현재 백엔드에서 추가로 보강할 내용

프론트엔드 Main 화면과 실제 사용자 흐름을 기준으로 보면, 현재 백엔드는 CRUD 중심으로는 충분한 방향이지만,  
프론트에서 바로 쓰기 좋은 “집계형/통합형 API”와 “배포/운영 관점 규칙”이 더 필요하다.

특히 아래 항목은 우선 보강한다.

- Main 화면용 월간 캘린더 요약 API
- 특정 날짜 통합 조회 API
- AI 추천 계획 일괄 적용 API
- 프론트 친화적 DTO 기준
- CORS / 환경변수 / 프로필 분리
- Cloud SQL 연결 기준
- 배포 구조 명확화

---

## 20. 프론트 기준으로 추가해야 할 백엔드 기능

### 20-1. 월간 캘린더 마커 조회 API

Main 화면은 월간 캘린더가 중심이므로, 일정 전체를 무겁게 다 내려주는 방식보다  
“날짜별 요약 정보”를 내려주는 API가 필요하다.

#### 목적
- 월간 캘린더에서 일정 존재 여부 표시
- AI 계획 존재 여부 표시
- 날짜별 일정 개수 표시

#### 권장 API
- `GET /api/v1/calendar/monthly-summary?year=2026&month=3`

#### 응답 예시
```json
{
  "success": true,
  "message": "월간 캘린더 요약을 조회했습니다.",
  "data": {
    "year": 2026,
    "month": 3,
    "days": [
      {
        "date": "2026-03-01",
        "scheduleCount": 2,
        "aiPlanCount": 0,
        "hasSchedule": true,
        "hasAiPlan": false
      },
      {
        "date": "2026-03-02",
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

### 20-2. 특정 날짜 통합 조회 API

Main 화면에서 날짜를 누르면, 해당 날짜의 일반 일정과 AI 계획을 함께 보여줄 가능성이 높다.
따라서 프론트가 schedules와 aiPlans를 각각 따로 조회하지 않도록 통합 응답을 제공하는 것이 좋다.

#### 권장 API

* `GET /api/v1/calendar/daily-detail?date=2026-03-07`

#### 응답 예시

```json
{
  "success": true,
  "message": "일일 상세 정보를 조회했습니다.",
  "data": {
    "date": "2026-03-07",
    "schedules": [
      {
        "id": 1,
        "title": "점호",
        "startTime": "21:00",
        "endTime": "21:30",
        "category": "MILITARY"
      }
    ],
    "aiPlans": [
      {
        "id": 101,
        "title": "AI 추천 영어 공부",
        "startTime": "22:00",
        "endTime": "22:30",
        "status": "RECOMMENDED"
      }
    ]
  }
}
```

---

### 20-3. AI 추천 계획 일괄 적용 API

AI 추천 결과는 보통 여러 개가 동시에 생성될 가능성이 있다.
따라서 planId 하나씩 apply하는 방식 외에, 추천 결과를 한 번에 적용하는 API가 필요하다.

#### 권장 API

* `POST /api/v1/ai-plans/apply-batch`

#### 요청 예시

```json
{
  "planIds": [101, 102, 103]
}
```

#### 처리 목적

* 추천된 여러 계획을 한 번에 적용
* status를 `RECOMMENDED -> APPLIED`로 변경
* 필요 시 실제 일정표 반영 로직 연결

---

### 20-4. 홈 화면 요약 API

추후 Main 화면이 확장되면 아래 정보가 한 번에 필요해질 수 있다.

* 사용자 정보
* 오늘 일정 개수
* 오늘 AI 계획 개수
* 완료율
* 현재 활성 목표 수

이를 위해 홈 대시보드용 API를 미리 고려한다.

#### 권장 API

* `GET /api/v1/dashboard/home`

#### 응답 예시

```json
{
  "success": true,
  "message": "홈 대시보드 정보를 조회했습니다.",
  "data": {
    "nickname": "진덕명",
    "todayScheduleCount": 3,
    "todayAiPlanCount": 2,
    "completedPlanCount": 1,
    "activeGoalCount": 2
  }
}
```

---

## 21. 프론트 친화적 DTO 설계 원칙 추가

현재 백엔드는 CRUD API 중심 구조로는 적절하지만, 프론트엔드에서는 아래 원칙이 매우 중요하다.

### 원칙

1. Entity를 그대로 노출하지 않는다.
2. 리스트 응답과 상세 응답을 분리할 수 있다.
3. 캘린더/대시보드/통합 화면에는 “조회 전용 DTO”를 별도로 둔다.
4. 프론트가 바로 쓰기 좋도록 날짜/시간/상태값을 명확하게 준다.
5. null 가능 필드는 의도를 분명히 한다.

### 추가 권장 DTO

* `MonthlyCalendarSummaryResponse`
* `MonthlyCalendarDayResponse`
* `DailyCalendarDetailResponse`
* `DashboardHomeResponse`
* `AiPlanBatchApplyRequest`

---

## 22. 백엔드 패키지에 추가하면 좋은 구조

현재 구조에 아래 query 전용 도메인 또는 read 모델 성격의 패키지를 추가하는 것을 고려한다.

```bash
domain
└── calendar
    ├── controller
    │   └── CalendarController.java
    ├── dto
    │   └── response
    │       ├── MonthlyCalendarSummaryResponse.java
    │       ├── MonthlyCalendarDayResponse.java
    │       └── DailyCalendarDetailResponse.java
    └── service
        └── CalendarQueryService.java
```

또는 `dailyplan`을 확장해도 되지만,
프론트에서 “캘린더 조회”의 의미가 분명하므로 `calendar` 패키지로 분리하는 것이 더 직관적일 수 있다.

---

## 23. 반복 일정 처리 정책 명확화

일정 기능에서는 반복 일정이 매우 중요하다.
초기 MVP라도 반복 일정 처리 기준을 문서에 명시해야 한다.

### 최소 정책

* `NONE`
* `DAILY`
* `WEEKLY`
* `MONTHLY`

### 구현 방향

초기에는 아래 중 하나를 선택한다.

#### 방식 A. 반복 일정을 원본 1건만 저장

* 장점: 데이터 중복 감소
* 단점: 조회 로직이 복잡해짐

#### 방식 B. 일정 생성 시 실제 occurrence를 확장 저장

* 장점: 조회 단순
* 단점: 반복 일정 변경/삭제가 복잡해짐

### MVP 권장

초기에는 **원본 일정 + 조회 시 확장 계산 방식**을 우선 고려한다.
단, Main 화면이 월간 캘린더 중심이므로 월 단위 조회 성능을 감안해 설계한다.

---

## 24. 일정 겹침 검증 규칙 추가

일정 생성/수정 시 일정 중복 정책을 정해야 한다.

### 최소 검증

* 같은 사용자의 같은 날짜에서 `startTime < endTime`
* 동일 시간대 일정 중복 허용 여부 결정
* AI 추천 일정이 이미 있는 시간대에 일반 일정이 추가될 경우 처리 규칙 정의

### MVP 권장 규칙

* 일반 일정끼리 시간 중복은 허용 가능
* 단, AI 추천 생성 시 기존 일정 시간대와 충돌하면 추천 대상에서 제외
* 필요 시 프론트에 충돌 경고 정보 제공

---

## 25. AI 추천 로직 보강 항목

현재 규칙 기반 추천 로직만으로 시작하는 방향은 적절하다.
다만 아래 항목을 더 명시하면 구현 일관성이 높아진다.

### 추가 규칙

* 취침 1시간 전 이후에는 추천하지 않음
* 기상 직후 일정 추천은 기본적으로 피함
* 하루 추천 총량 상한 설정
* 연속 추천 사이 최소 휴식 간격 설정
* 이미 완료율이 낮은 목표는 강도를 자동 완화
* 선택된 목표의 주당 횟수를 넘기지 않음

### 추천 결과 필드 추가 고려

* `reason`
* `priority`
* `confidence`
* `recommendedMinutes`

---

## 26. 상태값 설계 보강

### ScheduleCategory 예시

* `MILITARY`
* `SELF_DEV`
* `PERSONAL`
* `REST`
* `OTHER`

### AiPlanStatus 예시

* `RECOMMENDED`
* `APPLIED`
* `COMPLETED`
* `MISSED`
* `CANCELED`

### GoalType 예시

* `STUDY`
* `CERTIFICATE`
* `EXERCISE`
* `READING`
* `CODING`
* `OTHER`

Enum은 반드시 STRING으로 저장한다.

---

## 27. 운영 환경 분리 규칙 추가

환경별 설정을 명확히 분리한다.

### application profile

* `local`
* `dev`
* `prod`

### 분리 대상

* DB 연결 정보
* JWT secret
* CORS 허용 origin
* Swagger 활성화 여부
* 로그 레벨
* 외부 API key

### 원칙

* 민감 정보는 절대 Git에 커밋하지 않는다.
* `.env` 또는 Secret Manager 기반으로 주입한다.
* `application-prod.yml`에는 값 자체가 아니라 placeholder만 둔다.

---

## 28. CORS 정책 추가

프론트와 백엔드가 분리 배포될 가능성이 높으므로 CORS 정책을 문서에 명시한다.

### 원칙

* local 개발 환경 origin 허용
* dev/prod 프론트 도메인만 허용
* wildcard `*` 사용 지양
* credentials 사용 여부를 명확히 설정

예시 허용 origin:

* local: `http://localhost:3000`
* dev/prod: 실제 프론트 배포 도메인

---

## 29. Cloud SQL 사용 전제 추가

이 프로젝트는 MySQL을 Google Cloud SQL로 운영할 계획이다.

### 전제

* DB 엔진: MySQL
* 운영 DB는 Cloud SQL 사용
* 애플리케이션은 환경변수 기반으로 DB 접속 정보 주입
* 운영 환경에서는 로컬 DB 전용 설정 사용 금지

### 문서화할 항목

* DB 인스턴스명
* 데이터베이스명
* 애플리케이션 전용 DB 사용자
* 문자셋/Collation 정책
* 접속 방식
* 네트워크 접근 정책
* 백업 정책

### 주의

운영 환경에서는 root 계정을 직접 앱에 연결하지 않는다.
애플리케이션 전용 최소 권한 계정을 사용한다.

---

## 30. 배포 구조 가정 추가

현재 배포 구조는 다음 전제를 둔다.

### 권장 구조

* Frontend: Netlify
* Backend API: 별도 Java 런타임 배포 환경
* Database: Google Cloud SQL (MySQL)

### 이유

이 프로젝트의 백엔드는 Spring Boot 기반이며,
프론트와 백엔드를 분리하면 운영/배포 구조가 더 명확해진다.

따라서 문서와 코드 구조도 아래처럼 분리 전제를 유지한다.

* 프론트: 정적 자원/SPA
* 백엔드: REST API 서버
* DB: 관리형 MySQL

---

## 31. 추가해야 할 API 목록 정리

기존 API에 아래를 추가 고려한다.

### Calendar / Dashboard

* `GET /api/v1/calendar/monthly-summary`
* `GET /api/v1/calendar/daily-detail`
* `GET /api/v1/dashboard/home`

### AI Plan

* `POST /api/v1/ai-plans/apply-batch`

### Optional

* `GET /api/v1/goals/active`
* `GET /api/v1/statistics/weekly`
* `GET /api/v1/statistics/monthly`

---

## 32. 우선 구현 순서 업데이트

기존 구현 순서를 아래처럼 보강한다.

### 추가 우선순위

1. 인증/사용자
2. 일정 CRUD
3. 목표 CRUD
4. 월간 캘린더 요약 API
5. 특정 날짜 통합 조회 API
6. 규칙 기반 AI 추천 API
7. AI 추천 일괄 적용 API
8. 홈 대시보드 요약 API
9. Cloud SQL 환경 분리 적용
10. 배포용 prod 설정 정리

---

## 33. Claude가 추가로 지켜야 할 작업 원칙

1. 프론트 Main 화면이 필요로 하는 조회 API를 우선 만든다.
2. CRUD보다 “프론트 화면 조합용 API”가 더 필요한 경우 query API를 별도 설계한다.
3. 운영 환경을 고려해 env/profile/cors 설정을 먼저 정리한다.
4. Cloud SQL 연결을 염두에 두고 MySQL 의존 코드를 단순하게 유지한다.
5. 배포 구조가 프론트/백엔드 분리라는 점을 고려해 절대 경로, CORS, API base URL 설정을 명확히 한다.

```

[1]: https://docs.cloud.google.com/sql/docs/mysql/introduction?utm_source=chatgpt.com "Cloud SQL overview | Cloud SQL for MySQL"
[2]: https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/?utm_source=chatgpt.com "A Step-by-Step Guide: Deploying on Netlify"
