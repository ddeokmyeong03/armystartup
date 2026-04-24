# Millog (밀로그) — 군 장병 AI 자기개발 서비스

> 군 일과와 목표를 기반으로 **강의 추천 · 로드맵 · 피로도 분석**을 제공하는 멀티플랫폼 자기개발 서비스

---

## 목차

1. [서비스 개요](#1-서비스-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [빠른 시작 (로컬 개발)](#4-빠른-시작-로컬-개발)
5. [환경변수 전체 목록](#5-환경변수-전체-목록)
6. [배포 가이드](#6-배포-가이드)
7. [API 목록](#7-api-목록)
8. [데이터베이스 구조](#8-데이터베이스-구조)
9. [피로도 AI 명세](#9-피로도-ai-명세)
10. [구현 현황](#10-구현-현황)

---

## 1. 서비스 개요

**Millog**는 군 복무 중인 병사가 자신의 일과·근무 유형과 자기개발 목표를 등록하면, AI가 장병e음·국방전직교육원·K-MOOC 강의를 맞춤 추천하고 주차별 학습 로드맵을 자동 생성하는 서비스입니다.

### 핵심 기능

| 기능 | 설명 |
|---|---|
| 일정 관리 | 군 생활 일정 CRUD (익일 넘기는 야간 근무 지원) |
| 목표 관리 | 자기개발 목표 CRUD + 진행률 추적 |
| **피로도 기반 가용시간 계산** | Python FastAPI - 근무 유형·시간대·수면 패턴 기반 피로도(0~10) → 자기개발 가용시간 도출 |
| **AI 로드맵** | Claude API - 목표별 6단계 12주 학습 경로 생성·업데이트 |
| **AI 강의 추천** | 목표 기반 장병e음·국방전직교육원·K-MOOC 강의 자동 추천 |
| **AI 채팅 가이드** | Claude Haiku - 자기개발 상담 채팅 |
| **알림 자동 생성** | 목표 생성·달성, 일정 추가 시 알림 자동 발송 |
| 관리자 대시보드 | B2G용 장병 사용 패턴 분석 (Recharts 시각화) |

### 플랫폼

| 플랫폼 | 기술 | 배포 |
|---|---|---|
| **Web** | React 19 + Vite 7 + TypeScript | Render Static Site |
| **Mobile** | Expo 54 + React Native 0.81 | EAS Build (Android AAB / iOS IPA) |
| **Backend** | NestJS 11 + Prisma 5 + PostgreSQL | Render Web Service |
| **Fatigue AI** | Python 3.11 + FastAPI | Render Web Service |
| **Admin** | React 19 + Vite + Recharts | Vercel (별도 앱) |

---

## 2. 기술 스택

| 영역 | 기술 | 버전 |
|---|---|---|
| **Backend** | NestJS | 11.x |
| **ORM** | Prisma | 5.x |
| **Database** | PostgreSQL | 16 |
| **Auth** | JWT (passport-jwt) + bcryptjs | - |
| **AI** | Anthropic Claude API (claude-haiku-4-5-20251001) | - |
| **Fatigue AI** | Python FastAPI + Pydantic | 3.11 |
| **Web Frontend** | React 19, Vite 7, TypeScript, React Router 7 | - |
| **Mobile** | Expo 54, React Native 0.81, NativeWind v4, Expo Router v6 | - |
| **Admin** | React 19, Vite, Recharts, TypeScript | - |
| **HTTP Client** | Axios 1.x | - |
| **날짜 처리** | DayJS | 1.x |
| **빌드 (Mobile)** | EAS Build (Expo Application Services) | CLI ≥ 5.0.0 |

---

## 3. 프로젝트 구조

```
armystartup/
├── backend/                    # NestJS 백엔드 API
│   ├── src/
│   │   ├── auth/               # JWT 인증 (signup, login, 비밀번호 변경)
│   │   ├── users/              # 사용자 정보 CRUD
│   │   ├── profiles/           # 군인 프로필 (계급, 부대, 전역일 등)
│   │   ├── schedules/          # 일정 관리 + 알림 자동 생성
│   │   ├── goals/              # 자기개발 목표 + 알림 자동 생성
│   │   ├── courses/            # 강의 목록 + AI 추천
│   │   ├── roadmap/            # AI 로드맵 생성 (6단계 12주)
│   │   ├── notifications/      # 알림 관리 + autoCreate 헬퍼
│   │   ├── ai-chat/            # Claude Haiku 채팅
│   │   ├── dashboard/          # 홈 대시보드 요약
│   │   ├── admin/              # B2G 관리자 분석 (HTTP Basic Auth)
│   │   │   ├── analytics/      # 통계 집계 (DAU, 목표 분포, 강의 열람)
│   │   │   └── guards/         # AdminGuard
│   │   └── prisma/             # Prisma 서비스
│   └── prisma/
│       ├── schema.prisma       # DB 스키마
│       └── migrations/         # 마이그레이션 (강의 시드 30개 포함)
│
├── frontend/                   # Web (Vite + React 19)
│   └── src/
│       ├── pages/
│       │   ├── auth/           # LoginPage (회원가입 포함)
│       │   ├── home/           # HomePage (가용시간 링, 일정 탭)
│       │   ├── goals/          # GoalsPage
│       │   ├── roadmap/        # RoadmapPage
│       │   ├── courses/        # CoursesPage (강의 추천)
│       │   ├── profile/        # ProfilePage, ProfileEditPage
│       │   ├── schedules/      # ScheduleCreatePage (수정 모드 지원)
│       │   ├── notifications/  # NotificationsPage
│       │   └── settings/       # SettingsPage, ChangePasswordPage
│       └── shared/
│           ├── api/index.ts    # API 함수 모음
│           └── components/     # PageHeader, TabBar 등 공유 컴포넌트
│
├── mobile/                     # Mobile (Expo 54 + RN 0.81)
│   ├── app/                    # Expo Router 기반 라우팅
│   ├── app.json                # EAS 설정 (com.main.millog, newArchEnabled: true)
│   ├── eas.json                # EAS Build 프로파일 (dev/preview/production)
│   └── metro.config.js         # NativeWind v4 Metro 설정
│
├── millog-fatigue/             # 피로도 AI (Python FastAPI)
│   ├── main.py                 # FastAPI 앱 진입점
│   ├── api/routes.py           # /calculate, /recommend 엔드포인트
│   ├── fatigue/
│   │   ├── calculator.py       # 피로도 공식 엔진
│   │   ├── constants.py        # 설문 기반 계수 (Di, Ti, C, P, R)
│   │   ├── models.py           # Pydantic 모델
│   │   └── predictor.py        # 주간 예측 (ML 확장 예정)
│   └── Millog_Fatigue_ML_v1.ipynb  # Google Colab ML 학습 노트북
│
├── admin/                      # B2G 관리자 대시보드 (Vite + Recharts)
│   └── src/
│       └── pages/              # Overview, Goals, Courses, Fatigue, Users
│
├── shared/                     # 웹·앱 공유 타입 정의
│   └── types/                  # goal.ts, schedule.ts, user.ts 등
│
├── eas.json                    # EAS Build 루트 설정
├── vercel.json                 # Vercel SPA 배포 설정
└── render.yaml                 # Render 배포 설정
```

---

## 4. 빠른 시작 (로컬 개발)

### 백엔드

```bash
cd backend
cp .env.example .env   # 환경변수 설정 필요
npm install
npx prisma migrate dev
npm run start:dev      # http://localhost:3000
# API 문서: http://localhost:3000/api-docs
```

### 프론트엔드 (Web)

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
# .env 설정 없이도 Vite 프록시로 localhost:3000 연결
```

### 피로도 AI (Python)

```bash
cd millog-fatigue
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API 문서: http://localhost:8000/docs
```

### 모바일 (Expo)

```bash
cd mobile
npm install
npx expo start         # QR 코드로 Expo Go 앱 연결
```

### 관리자 대시보드

```bash
cd admin
npm install
npm run dev            # http://localhost:5174
```

---

## 5. 환경변수 전체 목록

### 백엔드 (`backend/.env`)

```bash
# PostgreSQL (Render Internal URL 또는 로컬)
DATABASE_URL="postgresql://user:password@host:5432/millog?schema=public"

# JWT 인증
JWT_SECRET="랜덤-64바이트-Base64-키"
JWT_EXPIRATION="3600"           # 초 단위 (1시간)

# Claude AI (로드맵·채팅·강의 추천)
ANTHROPIC_API_KEY="sk-ant-..."

# CORS 허용 도메인 (콤마 구분)
FRONTEND_URL="https://your-frontend.onrender.com,http://localhost:5173"

# 관리자 대시보드 Basic Auth
ADMIN_EMAIL="admin@millog.kr"
ADMIN_PASSWORD="강력한-관리자-비밀번호"

# 서버 설정
PORT=3000
NODE_ENV="development"          # production 배포 시 production
```

### 프론트엔드 (`frontend/.env`)

```bash
# 로컬 개발: 빈 값 → Vite 프록시(localhost:3000) 사용
VITE_API_BASE_URL=

# Render 배포 시:
# VITE_API_BASE_URL=https://millog-api.onrender.com

# 피로도 AI 서비스 URL
VITE_FATIGUE_API_URL=https://millog-fatigue.onrender.com
```

### 피로도 AI (`millog-fatigue/.env`)

```bash
# 필수 환경변수 없음 (FastAPI 자체 설정)
# Render 배포 시 PORT 자동 주입
PORT=8000
```

### 모바일 (`mobile/.env`)

```bash
EXPO_PUBLIC_API_BASE_URL=https://millog-api.onrender.com
EXPO_PUBLIC_FATIGUE_API_URL=https://millog-fatigue.onrender.com
```

### JWT 시크릿 키 생성 방법

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 6. 배포 가이드

### 6-1. Render — 백엔드 (Web Service)

| 항목 | 값 |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install && npx prisma generate && npx prisma migrate deploy && npm run build` |
| Start Command | `node dist/main` |
| Runtime | Node |

**Render 환경변수 설정:**

| 변수 | 값 |
|---|---|
| `DATABASE_URL` | Render PostgreSQL Internal URL |
| `JWT_SECRET` | 랜덤 64바이트 Base64 키 |
| `JWT_EXPIRATION` | `3600` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `FRONTEND_URL` | `https://millog-frontend.onrender.com,http://localhost:5173` |
| `ADMIN_EMAIL` | 관리자 이메일 |
| `ADMIN_PASSWORD` | 관리자 비밀번호 |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### 6-2. Render — 프론트엔드 (Static Site)

| 항목 | 값 |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

**환경변수:**

| 변수 | 값 |
|---|---|
| `VITE_API_BASE_URL` | `https://millog-api.onrender.com` |
| `VITE_FATIGUE_API_URL` | `https://millog-fatigue.onrender.com` |

> SPA 라우팅: `frontend/public/_redirects` 파일에 `/* /index.html 200` 추가 필요

### 6-3. Render — 피로도 AI (Web Service)

| 항목 | 값 |
|---|---|
| Root Directory | `millog-fatigue` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Runtime | Python 3 |

### 6-4. EAS Build — Android / iOS

```bash
# 로그인 (최초 1회)
cd mobile
eas login

# Android AAB (Google Play)
eas build --platform android --profile production

# Android APK (테스트용)
eas build --platform android --profile preview

# iOS IPA (App Store)
eas build --platform ios --profile production
```

**EAS 설정 파일:** `mobile/eas.json`  
**앱 패키지명:** `com.main.millog`  
**EAS Project ID:** `bb93947c-5ea9-417f-a5b9-b299f6ce31b6`

> `newArchEnabled: true` (React Native New Architecture 활성화 — Reanimated 3.x 필수)

### 6-5. Prisma 마이그레이션 (배포 후)

Render Build Command에 `npx prisma migrate deploy`가 포함되어 자동 실행됩니다.  
강의 시드 30개는 `backend/prisma/migrations/20260424100000_seed_courses/migration.sql`로 관리됩니다.

---

## 7. API 목록

### 공통 응답 형식

```json
{ "success": true, "message": "요청이 성공했습니다.", "data": { ... } }
{ "success": false, "message": "에러 메시지", "data": null }
```

### 인증 (Auth)

| Method | URL | 설명 | 인증 |
|---|---|---|---|
| POST | `/api/auth/signup` | 회원가입 | ✗ |
| POST | `/api/auth/login` | 로그인 (JWT 발급) | ✗ |

### 사용자 (Users)

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/users/me` | 내 정보 조회 |
| PATCH | `/api/users/me` | 내 정보 수정 (nickname, phoneNumber) |
| PATCH | `/api/users/password` | 비밀번호 변경 (currentPassword, newPassword) |

### 프로필 (Profiles)

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/profiles` | 프로필 생성/수정 (upsert) |
| GET | `/api/profiles/me` | 내 프로필 조회 |

### 일정 (Schedules)

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/schedules` | 일정 생성 → 알림 자동 발송 |
| GET | `/api/schedules` | 전체 일정 조회 |
| GET | `/api/schedules/by-date?date=YYYY-MM-DD` | 날짜별 일정 |
| GET | `/api/schedules/:id` | 일정 상세 |
| PATCH | `/api/schedules/:id` | 일정 수정 |
| DELETE | `/api/schedules/:id` | 일정 삭제 |

### 목표 (Goals)

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/goals` | 목표 생성 → 알림 자동 발송 |
| GET | `/api/goals` | 목표 전체 조회 |
| GET | `/api/goals/:id` | 목표 상세 |
| PATCH | `/api/goals/:id` | 목표 수정 (100% 달성 시 알림) |
| DELETE | `/api/goals/:id` | 목표 삭제 |

### 강의 (Courses)

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/courses` | 강의 목록 (source, category, goalType 필터) |
| GET | `/api/courses/:id` | 강의 상세 |
| POST | `/api/courses/recommend` | 목표 기반 AI 강의 추천 |
| GET | `/api/courses/saved` | 저장한 강의 목록 |
| POST | `/api/courses/recommendations/:id/save` | 강의 저장 |
| POST | `/api/courses/recommendations/:id/dismiss` | 강의 닫기 |

### 로드맵 (Roadmap)

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/roadmap` | 전체 로드맵 목록 |
| GET | `/api/roadmap/:id` | 로드맵 상세 |
| POST | `/api/roadmap/generate` | 목표 기반 AI 로드맵 생성 (body: `{ goalId }`) |
| PATCH | `/api/roadmap/:id/stage/:index` | 단계 상태 업데이트 (체크) |

### 알림 (Notifications)

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/notifications` | 알림 목록 + unreadCount |
| PATCH | `/api/notifications/read-all` | 전체 읽음 처리 |
| PATCH | `/api/notifications/:id/read` | 개별 읽음 처리 |

### AI 채팅 (AI Chat)

| Method | URL | 설명 |
|---|---|---|
| POST | `/api/ai/chat` | Claude Haiku 자기개발 상담 |

### 대시보드 (Dashboard)

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/dashboard/home` | 홈 요약 (가용시간, 목표, 오늘 일정) |

### 관리자 (Admin) — HTTP Basic Auth 필요

| Method | URL | 설명 |
|---|---|---|
| GET | `/api/admin/analytics/overview` | DAU/MAU, 목표 카테고리 분포 |
| GET | `/api/admin/analytics/goals` | 카테고리별 목표 분포 |
| GET | `/api/admin/analytics/courses` | 강의 소스별 열람 통계 |
| GET | `/api/admin/analytics/fatigue` | 피로도 분포 |
| GET | `/api/admin/analytics/users` | 계급/군종별 유저 분포 |

### 피로도 AI (millog-fatigue — 별도 서비스)

| Method | URL | 설명 |
|---|---|---|
| POST | `/calculate` | 피로도 계산 (DailySchedule 입력) |
| POST | `/recommend` | 피로도 기반 자기개발 추천 |
| GET | `/` | 헬스체크 |

---

## 8. 데이터베이스 구조

### 주요 모델

| 모델 | 설명 |
|---|---|
| `User` | 사용자 계정 (email, password, nickname) |
| `UserProfile` | 군인 프로필 (계급, 부대, 전역일, 기상/취침시간) |
| `Schedule` | 일정 (익일 넘기는 근무 지원) |
| `Goal` | 자기개발 목표 (isActive, progressPercent) |
| `Course` | 강의 큐레이션 (30개 내장, 장병e음·국방전직교육원·K-MOOC·Class101) |
| `CourseRecommendation` | AI 추천 기록 (RECOMMENDED/SAVED/DISMISSED) |
| `Roadmap` | AI 생성 로드맵 (6단계 12주, stages JSON) |
| `AiPlan` | AI 학습 계획 |
| `Notification` | 알림 (type, title, body, isRead) |
| `UserActivity` | B2G 분석용 행동 로그 (eventType, payload, platform) |
| `AdminUser` | 관리자 계정 (별도 테이블) |

---

## 9. 피로도 AI 명세

### 피로도 공식

```
F = clamp( Σ(Di × Ti × hi) × C + P - R, 0, 10 )
```

| 변수 | 설명 | 기반 데이터 |
|---|---|---|
| Di | 근무 유형별 피로지수 (시간당) | 36사단 22명 설문 |
| Ti | 시간대 가중치 (주간 0.80 ~ 새벽 1.15) | 설문 교차분석 |
| hi | 근무 수행 시간 (시간) | 입력값 |
| C | 연속 근무 계수 (1일→1.0, 최대 2.0) | - |
| P | 수면 중단 페널티 (1회당 3.0) | 설문 86.4% 응답 |
| R | 수면 회복량 (수면질 × 수면시간) | 회복저하율 46.7% |

### 근무 유형별 피로지수 (Di)

| 근무 유형 | Di | 설명 |
|---|---|---|
| `gop_gp` | 2.63 | GOP/GP 경계근무 |
| `guard_duty` | 2.45 | 당직근무 |
| `field_training` | 2.33 | 야외 훈련 |
| `guard_post` | 2.25 | 일반 경계/초소 |
| `night_watch` | 2.16 | 불침번 |
| `cctv_surveillance` | 2.00 | CCTV/정찰감시 |
| `indoor_training` | 0.80 | 실내/이론 교육 |
| `admin_work` | 0.50 | 일반 행정/정비 |
| `none` | 0.00 | 근무 없음 |

### ML 확장 계획 (Sprint 6)

현재 규칙 기반 엔진을 ML로 보강하기 위한 단계별 계획:

| 단계 | 조건 | 모델 |
|---|---|---|
| Phase 1 (현재) | 데이터 수집 인프라 구축 | 규칙 기반 유지 |
| Phase 2 (500건+) | `fatigue_logs.jsonl` 수집 후 | Ridge Regression |
| Phase 3 (5000건+) | 개인화 예측 | LSTM 시계열 |

학습 노트북: `millog-fatigue/Millog_Fatigue_ML_v1.ipynb` (Google Colab)

---

## 10. 구현 현황

### 완료

- [x] NestJS 백엔드 전체 API (인증, 사용자, 프로필, 일정, 목표, 강의, 로드맵, 알림, AI채팅, 대시보드)
- [x] 비밀번호 변경 (`PATCH /api/users/password`)
- [x] 알림 자동 생성 (목표 생성·달성, 일정 추가 트리거)
- [x] 강의 시드 데이터 30개 (SQL 마이그레이션)
- [x] B2G 관리자 분석 API + HTTP Basic Auth
- [x] React 웹 프론트엔드 전 페이지 (홈, 목표, 로드맵, 강의, 프로필, 알림, 설정)
- [x] 홈 일정 클릭 → 수정 진입 (ScheduleCreatePage edit mode)
- [x] AI 로드맵 6단계 12주 구조 + 참고 리소스 포함
- [x] Expo 모바일 앱 기본 구조 (Expo Router, NativeWind v4)
- [x] EAS Build 설정 (Android AAB, iOS IPA)
- [x] B2G 관리자 대시보드 (Vite + Recharts)
- [x] 피로도 AI FastAPI 서비스
- [x] 피로도 ML 학습 노트북 (Google Colab)

### 사용자 직접 실행 필요

- [ ] Render 환경변수 설정 (`ANTHROPIC_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`)
- [ ] `eas build --platform android --profile production` (AAB 재빌드)
- [ ] Render 배포 후 `npx prisma migrate deploy` 확인

---

> **Millog** — 군 복무 중에도 성장하는 병사를 위한 AI 자기개발 파트너
