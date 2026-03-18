# Millog (밀로그) — 군 생활 맞춤형 AI 자기개발 플래너

> 병사의 군 생활 일정과 자기개발 목표를 기반으로 AI가 자기개발 계획을 추천하고 관리하는 서비스

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

---

## 1. 서비스 개요

**Millog**는 군 생활 중인 병사가 자신의 일정(근무, 훈련, 점호 등)을 등록하고,
AI가 빈 시간에 자기개발 계획(공부, 운동, 독서 등)을 자동 추천해주는 서비스입니다.

### 핵심 기능

| 기능 | 설명 |
|---|---|
| 회원가입/로그인 | JWT 기반 인증 |
| 일정 관리 | 군 생활 일정 CRUD (반복 일정 포함) |
| 목표 관리 | 자기개발 목표 CRUD |
| AI 계획 추천 | 빈 시간 계산 후 목표 기반 자기개발 계획 자동 배치 |
| AI 채팅 가이드 | OpenAI GPT-4o-mini 기반 자유 질의응답 |
| 캘린더 조회 | 주간/월간/일별 통합 조회 |
| 홈 대시보드 | 오늘의 일정 요약, 완료율, 활성 목표 수 |
| 계획 실행 관리 | 완료 체크, 미완료 기록 |

---

## 2. 기술 스택

### 선정 이유 (Render 최적화)

> 기존 Spring Boot(Java)는 메모리 512MB+ 필요로 Render 무료 플랜에 부적합.
> Node.js + NestJS는 ~128MB로 경량 실행, 빠른 Cold Start, TypeScript로 프론트와 언어 일관성 유지.
> PostgreSQL은 Render가 무료 DB로 기본 제공 (MySQL 미지원).

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
| **AI** | OpenAI API (gpt-4o-mini) | - |
| **Frontend** | React + TypeScript | 19.x |
| **Build Tool** | Vite | 7.x |
| **CSS** | TailwindCSS | 4.x |
| **HTTP Client** | Axios | 1.x |
| **Routing** | React Router | 7.x |
| **날짜 처리** | DayJS | 1.x |
| **배포 (Backend)** | Render Web Service | - |
| **배포 (Frontend)** | Render Static Site | - |
| **배포 (DB)** | Render PostgreSQL | - |

---

## 3. 프로젝트 구조

```
millog/
├── backend/                    # NestJS 백엔드
│   ├── src/
│   │   ├── main.ts             # 진입점
│   │   ├── app.module.ts       # 루트 모듈
│   │   ├── prisma/             # Prisma 서비스
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── auth/               # 인증 모듈
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── dto/
│   │   │       ├── signup.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── login-response.dto.ts
│   │   ├── users/              # 사용자 모듈
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       ├── user-response.dto.ts
│   │   │       └── update-user.dto.ts
│   │   ├── profiles/           # 사용자 초기 설정
│   │   │   ├── profiles.module.ts
│   │   │   ├── profiles.controller.ts
│   │   │   ├── profiles.service.ts
│   │   │   └── dto/
│   │   │       ├── profile-request.dto.ts
│   │   │       └── profile-response.dto.ts
│   │   ├── schedules/          # 일정 모듈
│   │   │   ├── schedules.module.ts
│   │   │   ├── schedules.controller.ts
│   │   │   ├── schedules.service.ts
│   │   │   └── dto/
│   │   │       ├── create-schedule.dto.ts
│   │   │       ├── update-schedule.dto.ts
│   │   │       └── schedule-response.dto.ts
│   │   ├── goals/              # 목표 모듈
│   │   │   ├── goals.module.ts
│   │   │   ├── goals.controller.ts
│   │   │   ├── goals.service.ts
│   │   │   └── dto/
│   │   │       ├── create-goal.dto.ts
│   │   │       ├── update-goal.dto.ts
│   │   │       └── goal-response.dto.ts
│   │   ├── ai-plans/           # AI 계획 모듈
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
│   │   ├── calendar/           # 캘린더 조회 모듈 (Read Model)
│   │   │   ├── calendar.module.ts
│   │   │   ├── calendar.controller.ts
│   │   │   ├── calendar.service.ts
│   │   │   └── dto/
│   │   │       ├── weekly-summary-response.dto.ts
│   │   │       ├── monthly-summary-response.dto.ts
│   │   │       └── daily-detail-response.dto.ts
│   │   ├── dashboard/          # 홈 대시보드
│   │   │   ├── dashboard.module.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── dto/
│   │   │       └── dashboard-home-response.dto.ts
│   │   ├── main-home/          # 메인 홈 통합 API
│   │   │   ├── main-home.module.ts
│   │   │   ├── main-home.controller.ts
│   │   │   ├── main-home.service.ts
│   │   │   └── dto/
│   │   │       └── main-home-response.dto.ts
│   │   ├── ai-chat/            # OpenAI 채팅
│   │   │   ├── ai-chat.module.ts
│   │   │   ├── ai-chat.controller.ts
│   │   │   ├── ai-chat.service.ts
│   │   │   └── dto/
│   │   │       ├── chat-request.dto.ts
│   │   │       └── chat-response.dto.ts
│   │   └── common/             # 공통
│   │       ├── decorators/
│   │       │   └── current-user.decorator.ts
│   │       ├── filters/
│   │       │   └── http-exception.filter.ts
│   │       └── interceptors/
│   │           └── transform.interceptor.ts
│   ├── prisma/
│   │   └── schema.prisma       # DB 스키마 정의
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
    │   │   ├── ai/             # AiPage.tsx
    │   │   ├── profile/        # ProfilePage.tsx
    │   │   └── schedules/      # ScheduleCreatePage.tsx
    │   ├── widgets/
    │   │   ├── weekly-calendar/    # WeeklyCalendarSection.tsx
    │   │   ├── daily-plan-panel/   # SelectedDatePanel.tsx
    │   │   ├── ai-guide/           # AiGuideSection.tsx
    │   │   └── friend/             # FriendActionSection.tsx
    │   └── shared/
    │       ├── lib/
    │       │   ├── apiClient.ts    # Axios 인스턴스 + 인터셉터
    │       │   ├── auth.ts         # 토큰 관리 유틸
    │       │   └── calendar.ts     # 날짜 유틸
    │       ├── model/
    │       │   ├── types.ts        # TypeScript 인터페이스
    │       │   └── mock.ts         # Fallback 목 데이터
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
| `AiPlan` | AI 추천 자기개발 계획 |

### Enum 정의

```typescript
enum AuthProvider   { LOCAL, KAKAO, APPLE }
enum UserRole       { USER, ADMIN }
enum RepeatType     { NONE, DAILY, WEEKLY, MONTHLY }
enum ScheduleCategory { MILITARY, SELF_DEV, PERSONAL, REST, OTHER }
enum GoalType       { STUDY, CERTIFICATE, EXERCISE, READING, CODING, OTHER }
enum AiPlanStatus   { RECOMMENDED, APPLIED, COMPLETED, MISSED, CANCELED }
enum PlanSourceType { AI_GENERATED, MANUAL_ADJUSTED }
enum PlanIntensity  { LOW, MEDIUM, HIGH }
```

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
    "id": 1,
    "title": "야간 점호",
    "scheduleDate": "2026-03-18",
    "startTime": "21:00",
    "endTime": "21:30",
    "repeatType": "DAILY",
    "category": "MILITARY",
    "memo": "생활관 점호",
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
    "id": 1,
    "title": "토익 공부",
    "type": "STUDY",
    "targetDescription": "토익 900점 목표",
    "preferredMinutesPerSession": 60,
    "preferredSessionsPerWeek": 5,
    "isActive": true
  }
}
```

### AI 계획 (AI Plans) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/ai-plans/recommend` | AI 계획 추천 요청 |
| GET | `/api/ai-plans` | 추천 계획 목록 |
| GET | `/api/ai-plans/:id` | 추천 계획 상세 |
| POST | `/api/ai-plans/:id/apply` | 계획 개별 적용 (RECOMMENDED → APPLIED) |
| PATCH | `/api/ai-plans/:id/adjust` | 계획 시간 조정 |
| POST | `/api/ai-plans/apply-batch` | 계획 일괄 적용 |
| PATCH | `/api/ai-plans/:id/complete` | 계획 완료 처리 (APPLIED → COMPLETED) |
| PATCH | `/api/ai-plans/:id/miss` | 계획 미완료 처리 (APPLIED → MISSED) |

#### POST /api/ai-plans/recommend
```json
// Request
{ "goalIds": [1, 2], "targetDate": "2026-03-18" }
// Response 201
{
  "success": true,
  "message": "AI 계획이 추천되었습니다.",
  "data": [
    {
      "id": 101,
      "goalId": 1,
      "activityTitle": "토익 듣기 연습",
      "recommendedDate": "2026-03-18",
      "startTime": "20:00",
      "endTime": "21:00",
      "status": "RECOMMENDED",
      "sourceType": "AI_GENERATED"
    }
  ]
}
```

#### POST /api/ai-plans/apply-batch
```json
// Request
{ "planIds": [101, 102, 103] }
// Response 200
{ "success": true, "message": "3개의 계획이 적용되었습니다.", "data": null }
```

#### PATCH /api/ai-plans/:id/adjust
```json
// Request
{ "startTime": "20:30", "endTime": "21:30" }
```

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

#### GET /api/calendar/daily-detail?date=2026-03-18
```json
{
  "success": true,
  "message": "일일 상세 정보를 조회했습니다.",
  "data": {
    "date": "2026-03-18",
    "schedules": [
      { "id": 1, "title": "야간 점호", "startTime": "21:00", "endTime": "21:30", "category": "MILITARY" }
    ],
    "aiPlans": [
      { "id": 101, "activityTitle": "토익 듣기 연습", "startTime": "20:00", "endTime": "21:00", "status": "RECOMMENDED", "goalId": 1 }
    ]
  }
}
```

### 대시보드 & 메인 홈 — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/dashboard/home` | 홈 대시보드 요약 |
| GET | `/api/main/home?startDate=YYYY-MM-DD&date=YYYY-MM-DD` | 주간+일별 통합 조회 |

#### GET /api/dashboard/home
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

### AI 채팅 (AI Chat) — JWT 필요

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/ai/chat` | GPT-4o-mini 채팅 |

```json
// Request
{ "message": "오늘 토익 공부 어떻게 하면 좋을까?" }
// Response 200
{
  "success": true,
  "message": "AI 응답이 생성되었습니다.",
  "data": { "reply": "오늘 저녁 점호 이후 20:00~21:00 시간이 비어있네요. ...", "timestamp": "2026-03-18T20:00:00" }
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
      .setDescription('군 생활 자기개발 플래너 API')
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
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

### 6-7. AI 추천 로직 (규칙 기반)

```typescript
// src/ai-plans/recommendation/rule-based.recommendation.ts
// 알고리즘: 빈 시간 계산 후 목표 기반 배치

interface TimeSlot { start: string; end: string; } // "HH:mm" 형식

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function calculateFreeSlots(
  wakeUpTime: string,       // "06:30"
  sleepTime: string,        // "23:00"
  schedules: TimeSlot[],    // 당일 기존 일정 목록
  minSlotMinutes = 30,      // 최소 빈 시간 (분)
  bufferBeforeSleep = 60,   // 취침 전 버퍼 (분)
  bufferAfterWakeUp = 30,   // 기상 후 버퍼 (분)
): TimeSlot[] {
  const start = toMinutes(wakeUpTime) + bufferAfterWakeUp;
  const end = toMinutes(sleepTime) - bufferBeforeSleep;
  const busy = schedules
    .map(s => ({ s: toMinutes(s.start), e: toMinutes(s.end) }))
    .sort((a, b) => a.s - b.s);

  const free: TimeSlot[] = [];
  let cursor = start;
  for (const b of busy) {
    if (cursor < b.s && b.s - cursor >= minSlotMinutes)
      free.push({ start: toTimeString(cursor), end: toTimeString(b.s) });
    cursor = Math.max(cursor, b.e);
  }
  if (cursor < end && end - cursor >= minSlotMinutes)
    free.push({ start: toTimeString(cursor), end: toTimeString(end) });

  return free;
}

// 추가 제약 규칙:
// - 하루 최대 추천 3개
// - 연속 배치 사이 최소 30분 휴식
// - 목표의 주당 세션 횟수 초과 금지
// - 이미 완료율이 낮은 목표는 세션 시간 단축
```

### 6-8. OpenAI 채팅 서비스

```typescript
// src/ai-chat/ai-chat.service.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async chat(message: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `당신은 군인의 자기개발을 돕는 AI 가이드 '밀로그'입니다.
병사의 군 생활 일정을 고려해 실용적인 자기개발 조언을 한국어로 제공하세요.
답변은 간결하고 실행 가능하게 작성하세요.`,
      },
      { role: 'user', content: message },
    ],
    max_tokens: 500,
  });
  return response.choices[0].message.content ?? '응답을 생성할 수 없습니다.';
}
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
// 비로그인 사용자: /onboarding → /login → /signup
// 로그인 사용자:   / (MainPage) → /today → /goals → /ai → /profile

<Routes>
  <Route element={<GuestRoute />}>         {/* 로그인 시 / 로 리디렉션 */}
    <Route path="/onboarding" element={<OnboardingPage />} />
    <Route path="/login"      element={<LoginPage />} />
    <Route path="/signup"     element={<SignupPage />} />
  </Route>
  <Route element={<ProtectedRoute />}>     {/* 미로그인 시 /onboarding 리디렉션 */}
    <Route path="/"                  element={<MainPage />} />
    <Route path="/today"             element={<TodayPage />} />
    <Route path="/goals"             element={<GoalsPage />} />
    <Route path="/goals/create"      element={<GoalCreatePage />} />
    <Route path="/ai"                element={<AiPage />} />
    <Route path="/profile"           element={<ProfilePage />} />
    <Route path="/schedules/create"  element={<ScheduleCreatePage />} />
  </Route>
  <Route path="*" element={<Navigate to="/onboarding" />} />
</Routes>
```

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

// LoginPage 로그인 성공 후:
// localStorage.setItem('accessToken', data.accessToken);
// localStorage.setItem('nickname', data.user.nickname);
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

export interface DayInfo {
  date: string;           // YYYY-MM-DD
  dayOfWeek: string;      // 일, 월, 화...
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

### 7-6. 메인 페이지 ViewModel 훅 (useMainPageViewModel.ts)

```typescript
// 관리 상태: selectedDate, weekStart, weeklyMarkers, dailySchedules, dailyAiPlans, chatMessages
// API 호출:
//   GET /api/calendar/weekly-summary?startDate=  → weeklyMarkers
//   GET /api/calendar/daily-detail?date=         → dailySchedules, dailyAiPlans
//   POST /api/ai/chat                            → chatMessages
// API 실패 시: mock.ts 데이터로 fallback
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

# OpenAI
OPENAI_API_KEY="sk-..."

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

enum AuthProvider    { LOCAL KAKAO APPLE }
enum UserRole        { USER ADMIN }
enum RepeatType      { NONE DAILY WEEKLY MONTHLY }
enum ScheduleCategory { MILITARY SELF_DEV PERSONAL REST OTHER }
enum GoalType        { STUDY CERTIFICATE EXERCISE READING CODING OTHER }
enum AiPlanStatus    { RECOMMENDED APPLIED COMPLETED MISSED CANCELED }
enum PlanSourceType  { AI_GENERATED MANUAL_ADJUSTED }
enum PlanIntensity   { LOW MEDIUM HIGH }

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

  profile   UserProfile?
  schedules Schedule[]
  goals     Goal[]
  aiPlans   AiPlan[]

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

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  aiPlans AiPlan[]

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
```

### 마이그레이션 명령

```bash
# 개발 환경 (schema 변경 후 마이그레이션 생성 + 적용)
npx prisma migrate dev --name init

# 프로덕션 (마이그레이션만 적용)
npx prisma migrate deploy

# Prisma Client 재생성
npx prisma generate

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
Root Directory:  backend         (모노레포 구조 시)
Build Command:   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
Start Command:   node dist/main
```

**환경변수 (Render Dashboard → Environment):**

```
DATABASE_URL   = (PostgreSQL Internal URL)
JWT_SECRET     = (랜덤 64바이트 Base64 키)
JWT_EXPIRATION = 3600
OPENAI_API_KEY = (OpenAI API 키)
FRONTEND_URL   = https://millog-frontend.onrender.com
NODE_ENV       = production
PORT           = 3000
```

**package.json scripts:**

```json
{
  "scripts": {
    "build":       "nest build",
    "start":       "node dist/main",
    "start:dev":   "nest start --watch",
    "start:prod":  "node dist/main"
  }
}
```

### 10-4. 프론트엔드 Static Site 설정

```
Name:              millog-frontend
Root Directory:    frontend         (모노레포 구조 시)
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
3. Render → Web Service(millog-api) 생성
   → GitHub 연결, 환경변수 입력
4. Render → Static Site(millog-frontend) 생성
   → GitHub 연결, VITE_API_BASE_URL 입력
5. millog-api의 FRONTEND_URL 값을 millog-frontend URL로 업데이트
6. 양쪽 배포 완료 확인 후 E2E 테스트
```

### 10-6. 무료 플랜 주의사항

| 항목 | 내용 |
|---|---|
| Web Service Sleep | 15분 비활성 시 슬립 → 첫 요청 ~30초 지연 |
| PostgreSQL 만료 | 무료 DB는 90일 후 삭제 → 유료 전환 또는 외부 DB 필요 |
| 해결책 | Starter 플랜 ($7/월) 또는 외부 Supabase(PostgreSQL 무제한 무료) 연동 |

### 10-7. 외부 DB 대안 (Supabase)

Render 무료 PostgreSQL 만료 문제 회피를 위해 Supabase 무료 플랜 사용 가능.

```
Supabase → Project Settings → Database → Connection string (URI)
→ DATABASE_URL에 입력
```

---

## 11. 구현 순서 로드맵

### 1단계: 프로젝트 기반 세팅
- [ ] NestJS 프로젝트 생성 (`nest new backend`)
- [ ] Prisma + PostgreSQL 연결
- [ ] 공통 구조: TransformInterceptor, HttpExceptionFilter, CurrentUser 데코레이터
- [ ] Swagger 설정
- [ ] 환경변수 `.env` 구성

### 2단계: 인증/사용자
- [ ] `User` Prisma 모델
- [ ] `AuthModule`: signup, login, JWT 발급
- [ ] JWT Strategy + JwtAuthGuard
- [ ] `UsersModule`: 내 정보 조회/수정

### 3단계: 사용자 초기 설정
- [ ] `UserProfile` Prisma 모델
- [ ] `ProfilesModule`: upsert, 조회

### 4단계: 일정 관리
- [ ] `Schedule` Prisma 모델
- [ ] `SchedulesModule`: CRUD + 날짜별 조회

### 5단계: 목표 관리
- [ ] `Goal` Prisma 모델
- [ ] `GoalsModule`: CRUD

### 6단계: AI 계획 추천
- [ ] `AiPlan` Prisma 모델
- [ ] 규칙 기반 추천 엔진 (빈 시간 계산 알고리즘)
- [ ] `AiPlansModule`: 추천/적용/조정/완료/일괄적용

### 7단계: 캘린더 & 대시보드
- [ ] `CalendarModule`: weekly-summary, monthly-summary, daily-detail
- [ ] `DashboardModule`: 홈 요약
- [ ] `MainHomeModule`: 통합 조회

### 8단계: AI 채팅
- [ ] OpenAI SDK 연동
- [ ] `AiChatModule`: GPT-4o-mini 채팅

### 9단계: 프론트엔드
- [ ] Vite + React + TypeScript 프로젝트 생성
- [ ] TailwindCSS 설정
- [ ] 라우팅 구조 (ProtectedRoute, GuestRoute)
- [ ] 인증 유틸 + Axios 클라이언트
- [ ] 온보딩 / 로그인 / 회원가입 페이지
- [ ] 메인 페이지 (주간 캘린더 + 일정 패널 + AI 가이드)
- [ ] 일정/목표 CRUD 페이지
- [ ] 프로필 페이지 (로그아웃 포함)

### 10단계: Render 배포
- [ ] PostgreSQL 서비스 생성
- [ ] 백엔드 Web Service 배포 + 환경변수 설정
- [ ] 프론트엔드 Static Site 배포 + `_redirects` 파일
- [ ] CORS / 환경변수 최종 확인
- [ ] E2E 테스트 (Swagger UI + 실제 앱)

---

> **Millog** — 군 생활 속에서도 성장하는 병사를 위한 AI 자기개발 파트너
