# CLAUDE_FRONT.md

## 1. 문서 목적

이 문서는 **군 생활 맞춤형 AI 자기개발 플래너**의 프론트엔드 구현을 위해 작성된 가이드 문서이다.
Claude Code가 다음을 빠르게 이해하도록 돕는 것이 목적이다.

* 이 서비스의 화면 구조
* 현재 제공된 Main 화면의 UI 의도
* 각 화면에서 필요한 컴포넌트
* 사용자 흐름
* 스타일 가이드
* 구현 우선순위
* 백엔드 API와 연결되는 프론트 단위 구조

이 문서는 **디자인 시스템 초안 + 화면설계 해설 + 프론트 구현 기준 문서**로 사용한다.

---

## 2. 서비스 개요

이 서비스는 병사가 군 생활 중에도 자기개발을 지속할 수 있도록 돕는 **일정 기반 AI 자기개발 플래너**이다.

핵심 기능은 다음과 같다.

* 병사가 자신의 일정을 등록/조회/수정/삭제한다.
* 목표를 설정한다.
* AI 가이드가 일정표와 목표를 바탕으로 자기개발 계획을 추천한다.
* 추천된 계획을 일정표에 반영한다.
* 사용자는 매일 계획을 확인하고 수행 여부를 체크한다.

---

## 3. 현재 기준 제품 방향

이 서비스는 단순 캘린더 앱이 아니다.
핵심 방향은 다음과 같다.

> “병사의 실제 생활 일정 위에 자기개발 계획을 얹는 일정 중심 자기관리 서비스”

따라서 프론트엔드는 다음 원칙을 따라야 한다.

* 일정 확인이 가장 빠르고 쉬워야 한다.
* 복잡한 기능보다 **즉시 이해되는 화면 구조**가 중요하다.
* AI 기능도 독립 기능처럼 보이기보다 **기존 일정 흐름 안에 자연스럽게 녹아들어야 한다.**
* 메인 화면은 정보 과잉보다 **한 달 일정 파악 + 빠른 액션 진입**에 집중한다.
* 군인 사용자가 짧은 시간 안에 사용할 수 있도록, 터치 횟수와 입력 피로를 줄여야 한다.

---

## 4. 참고 기준

이 문서는 아래 두 가지를 기반으로 프론트 스타일과 화면 구조를 정리한다.

### 4-1. 사용자 제공 Main 화면 시안

현재 제공된 이미지는 **Main 화면**이다.
이 화면은 다음 특징을 가진다.

* 상단에 필터/카테고리처럼 보이는 둥근 칩 버튼
* 프로필 영역
* 월 단위 캘린더 중심 레이아웃
* 우측 상단의 일정 추가 버튼
* 매우 미니멀한 흑백 중심 디자인
* 넉넉한 여백과 단순한 정보 밀도

### 4-2. To Do Mate 참고

`todo mate: tasks & routines`는 Google Play와 App Store에서 공개적으로 다음 기능을 안내한다.

* 할 일(Task) 관리
* 루틴(Routine) 관리
* 색상 기반 일정 구분
* AI 기반 할 일 추천
* 일기/기록 기능
* 모바일, 데스크톱, 웹 동기화 지원 ([구글 플레이][1])

또한 스토어 설명상 todo mate는 “한국에서 많이 사용되는 투두 앱”, “3 million users”, “작업/루틴/AI/다이어리 중심 생산성 앱”으로 소개되고 있으며, 캘린더와 기록 중심 사용 흐름을 강조한다. ([구글 플레이][1])

이 서비스는 todo mate를 그대로 복제하는 것이 아니라,
**todo mate의 미니멀함 + 캘린더 중심 구성 + 빠른 입력 UX**를 참고하되
우리 서비스의 목적에 맞게 **군 일정 + 자기개발 계획 + AI 추천**으로 재구성한다.

---

## 5. Main 화면 해석

현재 제공된 Main 화면은 서비스의 출발점 역할을 한다.

### Main 화면의 핵심 역할

1. 사용자 프로필/인사말 제공
2. 현재 보고 있는 연/월 컨텍스트 제공
3. 월간 일정 캘린더 제공
4. 일정 추가 진입 제공
5. 이후 AI 추천, 일정 상세, 목표 관리로 이동하는 허브 역할 수행

### 화면 구조 해석

현재 화면은 아래 4개 블록으로 구성된다.

#### A. 상단 필터/칩 영역

예시:

* `2024`
* `June 2024`
* `June`
* `진덕명`

이 영역은 실제 구현 시 다음 중 하나의 역할로 정리할 수 있다.

* 연/월/보기 기준 필터
* 사용자 맞춤 태그/상태 칩
* 상단 빠른 전환 네비게이션

초기 MVP에서는 우선 다음처럼 해석하는 것을 권장한다.

* 첫 번째 칩: 연도
* 두 번째 칩: 현재 월
* 세 번째 칩: 보기 옵션 또는 탭
* 네 번째 칩: 사용자 또는 현재 모드

단, 이 칩들은 나중에 정보 구조가 바뀔 수 있으므로 **하드코딩된 의미보다 재사용 가능한 `Chip` 컴포넌트**로 구현해야 한다.

#### B. 프로필 영역

구성:

* 원형 프로필 이미지
* 닉네임
* 응원/상태 문구
* 우측 아이콘 버튼들

이 영역은 사용자의 정체성을 보여주고, 메인 화면의 감성 톤을 형성한다.
todo mate 계열 앱이 “기록과 일상 관리”의 정서를 주는 것처럼, 이 서비스도 너무 업무용처럼 차갑기보다 **가볍고 친근한 정서**를 유지한다. 다만 본 서비스는 생산성 앱이므로 귀여움보다 **깔끔함과 안정감**을 우선한다. 참고 앱은 루틴, AI 추천, 다이어리 등 개인 일상 관리 흐름을 한 앱 안에 통합해 제공한다. ([구글 플레이][1])

#### C. 월 표시 + 추가 버튼 영역

구성:

* 아이콘
* `2026.03`
* 드롭다운 화살표
* `+` 버튼

이 블록은 현재 날짜 맥락과 주요 액션을 함께 제공한다.

권장 역할:

* 좌측: 현재 월 이동/변경
* 우측: 일정 추가

즉, 사용자는 메인 화면에서 **한 달을 보고 + 바로 일정 추가**를 할 수 있어야 한다.

#### D. 월간 캘린더 영역

구성:

* 요일 헤더
* 날짜 그리드
* 이전/다음 달 날짜 일부 노출

이 화면에서 가장 중요한 중심 영역이다.
초기 MVP에서는 다음 정도만 지원하면 충분하다.

* 날짜 선택
* 특정 날짜 클릭 시 일정 조회
* 일정이 있는 날짜 점/배지 표시
* AI 추천 일정이 있는 날짜 구분 표시
* 오늘 날짜 하이라이트

---

## 6. Main 화면 프론트 구현 목표

Main 화면은 아래 기능을 만족해야 한다.

### 필수 기능

* 현재 사용자 정보 표시
* 월간 캘린더 표시
* 날짜 선택
* 일정 추가 버튼
* 일정 있는 날짜 시각적 표시
* 선택 날짜의 간단한 일정 요약 또는 하단 패널 연결

### 확장 기능

* 월 전환
* 필터 칩 선택
* 목표별 일정 표시
* AI 추천 일정 표시
* 수행률 표시
* 하단 시트로 당일 상세 일정 표시

---

## 7. 정보 구조(IA 관점)

프론트엔드 기준 화면 구조는 다음을 기본으로 한다.

### 1차 화면

* 온보딩
* 회원가입
* 로그인
* 초기 설정
* Main
* 일정 상세/목록
* 일정 추가/수정
* 목표 관리
* 목표 추가/수정
* AI 가이드
* AI 추천 결과
* 오늘의 계획
* 마이페이지

### Main에서 연결되는 주요 흐름

* 프로필 영역 → 마이페이지
* `+` 버튼 → 일정 추가
* 날짜 클릭 → 해당 날짜 일정 보기
* AI 배너 또는 버튼 → AI 추천 화면
* 목표 버튼 → 목표 관리

---

## 8. 화면별 간단 정의

### 8-1. Main

역할:

* 월간 일정 확인의 중심 화면

핵심 컴포넌트:

* Header Chips
* Profile Card
* Calendar Header
* Monthly Calendar Grid
* Floating/Inline Add Button

### 8-2. 일정 추가/수정

역할:

* 일정 생성, 편집

핵심 컴포넌트:

* 입력 폼
* 날짜 선택기
* 시간 선택기
* 반복 설정
* 저장 버튼

### 8-3. 일정 상세

역할:

* 특정 일정 상세 확인

핵심 컴포넌트:

* 제목
* 날짜/시간
* 카테고리
* 메모
* 수정/삭제 버튼

### 8-4. 목표 관리

역할:

* 자기개발 목표 생성 및 목록 관리

핵심 컴포넌트:

* 목표 카드 리스트
* 추가 버튼
* 목표 상태 토글

### 8-5. AI 가이드

역할:

* 목표와 선호 조건 입력 후 AI 추천 요청

핵심 컴포넌트:

* 목표 선택
* 강도 선택
* 추천 요청 버튼

### 8-6. AI 추천 결과

역할:

* 추천 일정 검토 및 적용

핵심 컴포넌트:

* 추천 일정 카드
* 적용 버튼
* 다시 추천 버튼

### 8-7. 오늘의 계획

역할:

* 당일 계획 실행 관리

핵심 컴포넌트:

* 오늘 일정 리스트
* 완료/미수행 버튼
* 상태 태그

---

## 9. 컴포넌트 구조 가이드

Claude는 화면을 페이지 단위로만 만들지 말고, **재사용 가능한 UI 컴포넌트 중심**으로 설계해야 한다.

권장 구조는 다음과 같다.

### 공통 UI 컴포넌트

* `Chip`
* `IconButton`
* `Avatar`
* `SectionHeader`
* `EmptyState`
* `BottomSheet`
* `PrimaryButton`
* `SecondaryButton`
* `Tag`
* `CalendarDayCell`

### Main 전용 컴포넌트

* `MainHeaderChips`
* `ProfileSummaryCard`
* `CalendarMonthHeader`
* `MonthlyCalendar`
* `MonthlyCalendarWeekHeader`
* `MonthlyCalendarGrid`
* `SchedulePreviewPanel`
* `AddScheduleButton`

### 일정 관련 컴포넌트

* `ScheduleCard`
* `ScheduleForm`
* `ScheduleTimeField`
* `RepeatSelector`

### 목표 관련 컴포넌트

* `GoalCard`
* `GoalForm`

### AI 관련 컴포넌트

* `AiRecommendationCard`
* `AiRecommendationList`
* `AiReasonBox`

---

## 10. Main 화면 상태 정의

프론트 설계에서 중요한 것은 “기본 화면”만이 아니라 “상태별 화면”이다.

### State A. 최초 진입 / 데이터 있음

* 프로필 표시
* 월간 캘린더 표시
* 일정 점 표시

### State B. 일정 없음

* 캘린더는 보이되 일정 마커 없음
* 하단에 “아직 일정이 없어요. + 버튼으로 일정을 추가하세요.” 같은 빈 상태 표시

### State C. 로딩

* 프로필 스켈레톤
* 캘린더 스켈레톤
* 하단 패널 스켈레톤

### State D. 에러

* “일정을 불러오지 못했습니다.”
* 다시 시도 버튼

### State E. 특정 날짜 선택

* 선택된 날짜 강조
* 하단 패널에 해당 날짜 일정 표시

### State F. AI 추천 일정 포함

* 일반 일정과 다른 표시 방식 사용
* 예: 점/라인/테두리 구분

---

## 11. 사용자 인터랙션 가이드

### 날짜 클릭

* 해당 날짜 선택
* 하단 패널 또는 상세 화면에 일정 표시

### `+` 버튼 클릭

* 일정 추가 화면 진입

### 프로필 클릭

* 마이페이지 또는 프로필 화면 진입

### 월 표시 클릭

* 월 선택 드롭다운 또는 이전/다음 월 이동

### 칩 클릭

* 필터 전환 또는 보기 모드 전환

---

## 12. Style Guide

이 서비스의 스타일은 **“Calm Minimal Productivity”**를 기본 방향으로 한다.

사용자 제공 Main 시안과 todo mate의 공개 스토어 설명 및 스크린샷 맥락상, 참고해야 할 핵심은 다음이다.

* 미니멀한 레이아웃
* 캘린더 중심 구성
* 둥근 칩/버튼
* 가벼운 정보 밀도
* 생산성 앱이지만 차갑지 않은 감성
* 필요할 때만 색을 쓰는 절제된 방식
* 루틴/일정/기록/AI 기능을 한 흐름에 녹이는 구조 ([구글 플레이][1])

### 12-1. 디자인 키워드

* 미니멀
* 정돈된
* 친근한
* 차분한
* 둥근
* 캘린더 중심
* 가벼운 생산성
* 과장되지 않은 감성

### 12-2. 전체 톤

* 기본은 밝은 배경
* 검정/회색 중심 타이포그래피
* 포인트 컬러는 제한적으로 사용
* 화면 전반에 여백을 충분히 둔다
* 카드/칩/버튼은 부드러운 모서리 사용
* 그림자보다 **톤 차이와 여백**으로 계층을 만든다

### 12-3. Color

권장 예시 값:

* `Background`: `#F8F8F6`
* `Surface`: `#FFFFFF`
* `Primary Text`: `#111111`
* `Secondary Text`: `#8E8E93`
* `Divider`: `#E6E6E8`
* `Chip Background`: `#EFEFEF`
* `Chip Active`: `#E4E4E4`
* `Success`: `#3D7A57`
* `Warning`: `#D98E2F`
* `Accent Soft Blue`: `#DCE8F8`
* `Accent Soft Green`: `#DDEEDF`

주의:

* todo mate는 일정 색상 구분 기능을 제공하지만, 우리 서비스의 메인 화면은 처음부터 다채로운 색상 앱처럼 보이면 안 된다. 색은 **일정 구분 또는 상태 강조**에 제한적으로 써야 한다. ([구글 플레이][1])

### 12-4. Typography

권장 폰트 계층:

* Page Title: 24 / Bold
* Section Title: 20 / Semibold
* Card Title: 18 / Semibold
* Body: 15~16 / Regular
* Caption: 12~13 / Regular
* Chip Text: 14 / Medium
* Calendar Day Number: 16 / Medium
* Calendar Week Label: 12 / Regular

원칙:

* 지나치게 다양한 폰트 크기 사용 금지
* 타이틀은 선명하고 짧게
* 보조 텍스트는 옅지만 읽히게
* 숫자와 날짜는 시인성이 좋아야 함

### 12-5. Spacing

권장 spacing scale:

* `4`
* `8`
* `12`
* `16`
* `20`
* `24`
* `32`

원칙:

* 화면 바깥 여백은 넉넉하게
* 그룹 간 간격은 카드 내부 간격보다 크게
* 캘린더는 촘촘하지 않게 유지
* 터치 영역은 최소 44px 이상

### 12-6. Radius

권장 radius:

* Small: `10`
* Medium: `16`
* Large: `20`
* Pill/Chip: `999`

현재 Main 화면처럼 칩과 버튼이 둥글게 처리되는 방향을 유지한다.

### 12-7. Shadow / Border

* 그림자는 약하게 사용
* 기본은 border 또는 배경 톤 차이로 구분
* 캘린더 셀은 테두리 없이도 구분 가능해야 함
* 강조가 필요한 카드만 약한 shadow 허용

### 12-8. Icon Style

* 단색 아이콘
* 너무 두껍거나 장난스럽지 않은 라인 아이콘
* iOS 감성과 잘 맞는 심플한 아이콘 사용
* 동일 stroke 두께 유지

### 12-9. Calendar Style

캘린더는 이 서비스의 중심 UI이다.

원칙:

* 날짜 숫자는 명확해야 한다.
* 오늘 날짜는 subtle highlight
* 선택 날짜는 확실히 구분
* 일정 있는 날은 점/작은 막대/배지로 표시
* AI 추천 일정은 일반 일정과 다른 방식으로 구분
* 이전/다음 달 날짜는 더 옅은 회색 처리

권장 표시 방식:

* 일반 일정: 작은 회색 점
* 중요 일정: 진한 점
* AI 일정: 아웃라인 점 또는 다른 위치 점
* 오늘: 얇은 배경 하이라이트
* 선택된 날짜: 원형 또는 rounded rectangle 강조

### 12-10. Motion

* 전환은 빠르고 짧게
* 슬라이드/페이드 위주
* 과한 bounce 금지
* 일정 추가, 하단 시트, 추천 결과는 부드러운 움직임 사용

---

## 13. Main 화면 레이아웃 규칙

### 상단 Safe Area

* iOS notch 대응
* 상단 콘텐츠는 너무 붙지 않게 처리

### 상단 칩 영역

* 가로 스크롤 가능 구조 권장
* 칩 간 간격 일정하게 유지
* 선택 상태와 비선택 상태 구분

### 프로필 영역

* 좌측 아바타
* 중앙에 이름/문구
* 우측에 1~2개 액션 아이콘
* 한 줄로 과밀하게 만들지 말 것

### 캘린더 헤더

* 월 정보는 크게
* 월 전환 affordance 제공
* `+` 버튼은 명확히 독립된 액션으로 보이게

### 캘린더 그리드

* 7열 고정
* 각 셀 높이는 충분히 확보
* 날짜와 상태 마커의 간격 분리
* 너무 작거나 빽빽한 느낌 금지

---

## 14. 접근성 가이드

* 텍스트 대비 충분히 확보
* 날짜 선택 상태는 색상만으로 구분하지 말 것
* 버튼은 최소 터치 영역 확보
* 아이콘 버튼은 접근성 레이블 제공
* 폼 입력은 placeholder만 쓰지 말고 label 제공
* 시각적으로 옅은 회색 텍스트는 정보 우선순위가 낮은 곳에만 사용

---

## 15. 프론트엔드 기술 방향

Claude는 프론트 구현 시 다음을 권장한다.

### 권장 스택

* React
* TypeScript
* 상태관리: React Query + Zustand 또는 Context 최소 구성
* 스타일링: Tailwind CSS 또는 CSS Modules
* 라우팅: React Router
* 날짜 처리: dayjs 또는 date-fns

### 데이터 처리 원칙

* 서버 상태와 UI 상태 분리
* 캘린더 데이터는 월 단위 fetch 고려
* 일정 목록은 날짜 기준 selector 제공
* 낙관적 업데이트는 일정 수정/삭제 시 필요할 수 있음

---

## 16. 폴더 구조 가이드

권장 예시:

```text
src
├─ app
│  ├─ router
│  └─ providers
├─ pages
│  ├─ main
│  ├─ auth
│  ├─ profile
│  ├─ schedule
│  ├─ goal
│  └─ ai
├─ widgets
│  ├─ main-calendar
│  ├─ profile-summary
│  ├─ daily-plan-panel
│  └─ ai-recommendation
├─ features
│  ├─ auth
│  ├─ schedule
│  ├─ goal
│  └─ ai-plan
├─ entities
│  ├─ user
│  ├─ schedule
│  ├─ goal
│  └─ ai-plan
├─ shared
│  ├─ ui
│  ├─ lib
│  ├─ api
│  ├─ model
│  └─ styles
```

---

## 17. Main 화면 구현 우선순위

Claude는 Main 화면을 아래 순서로 구현한다.

### Step 1

정적 UI 뼈대 구현

* Safe area
* 칩 영역
* 프로필 카드
* 월 헤더
* 캘린더 그리드

### Step 2

상태 연결

* 현재 월 표시
* 날짜 선택
* 월 이동

### Step 3

API 연결

* 사용자 정보 조회
* 월간 일정 조회
* 날짜별 일정 마커 표시

### Step 4

상호작용 연결

* 일정 추가 이동
* 날짜 선택 시 하단 상세 패널
* 프로필 이동

### Step 5

확장

* AI 추천 일정 구분
* 목표 필터
* 빈 상태/에러 상태/UI polish

---

## 18. Claude 작업 지침

Claude는 이 문서를 기준으로 프론트를 구현할 때 아래 원칙을 따른다.

1. 먼저 Main 화면을 기준으로 전체 UI 톤을 잡는다.
2. 화면 하나를 만들더라도 재사용 가능한 컴포넌트 단위로 분리한다.
3. 스타일은 과도한 장식보다 정돈된 여백과 계층으로 해결한다.
4. todo mate의 생산성/기록 감성은 참고하되, 본 서비스의 핵심인 “군 일정 + 자기개발 + AI 추천” 구조를 우선한다. todo mate 공개 설명상 루틴, AI 추천, 다이어리, 색상 기반 캘린더 흐름이 강조되므로, 우리 서비스도 이를 참고해 일정·루틴·추천이 한 흐름 안에서 연결되도록 설계한다. ([구글 플레이][1])
5. 첫 구현에서는 모든 기능을 한 번에 넣지 말고, Main → 일정 → 목표 → AI 순서로 확장한다.
6. UI가 예쁘기만 한 구조보다 실제 일정 관리 흐름에 맞는 구조를 우선한다.
7. 백엔드 응답이 아직 고정되지 않은 경우 mock data 기반으로 먼저 화면 상태를 설계한다.

---

## 19. 요약

이 프론트엔드의 첫 인상은 다음이어야 한다.

* 깔끔하다
* 복잡하지 않다
* 한눈에 일정이 보인다
* 쓰기 쉬워 보인다
* AI 기능이 억지스럽지 않고 자연스럽다

즉, 이 서비스의 메인 화면은
**“가볍고 차분한 캘린더 기반 자기관리 홈”**으로 설계되어야 한다.

그리고 전체 프론트는
**“일정 관리 앱의 익숙함” 위에 “AI 자기개발 코치”를 얹는 방식**으로 발전시켜야 한다.

---

## 20. 참고 사실 메모

* todo mate는 Google Play와 App Store에서 작업, 루틴, AI 추천, 일기/기록 기능을 제공하는 생산성 앱으로 소개된다. ([구글 플레이][1])
* App Store 설명상 todo mate는 모바일, Windows, macOS, 웹 간 동기화를 지원한다고 안내한다. ([App Store][2])
* Google Play 설명상 반복 루틴과 색상 기반 일정 관리가 핵심 기능 중 하나다. ([구글 플레이][1])

---

[1]: https://play.google.com/store/apps/details?id=com.undefined.mate&utm_source=chatgpt.com "todo mate: tasks & routines - Apps on Google Play"
[2]: https://apps.apple.com/kr/app/todo-mate/id1505220130?l=en-GB&platform=ipad&utm_source=chatgpt.com "todo mate: tasks & routines - App Store"

---

## 21. React 컴포넌트 트리 제안

이 프로젝트는 페이지 단위 개발보다, **페이지 = 위젯 조합**, **위젯 = 공통 UI 조합** 구조로 설계하는 것이 적절하다.

### 21-1. Main 페이지 컴포넌트 트리

```text
MainPage
├─ MainLayout
│  ├─ TopChipBar
│  │  ├─ Chip
│  │  ├─ Chip
│  │  ├─ Chip
│  │  └─ Chip
│  │
│  ├─ ProfileSummarySection
│  │  ├─ Avatar
│  │  ├─ UserGreeting
│  │  └─ ProfileActionButtons
│  │      ├─ IconButton
│  │      └─ IconButton
│  │
│  ├─ CalendarSection
│  │  ├─ CalendarMonthHeader
│  │  │  ├─ LeftIcon
│  │  │  ├─ MonthLabel
│  │  │  ├─ DropdownButton
│  │  │  └─ AddScheduleButton
│  │  │
│  │  ├─ CalendarWeekHeader
│  │  │  ├─ WeekLabel
│  │  │  ├─ WeekLabel
│  │  │  ├─ WeekLabel
│  │  │  ├─ WeekLabel
│  │  │  ├─ WeekLabel
│  │  │  ├─ WeekLabel
│  │  │  └─ WeekLabel
│  │  │
│  │  └─ MonthlyCalendarGrid
│  │      ├─ CalendarDayCell
│  │      ├─ CalendarDayCell
│  │      ├─ CalendarDayCell
│  │      └─ ...
│  │
│  └─ SelectedDatePanel
│     ├─ SectionHeader
│     ├─ SchedulePreviewCard
│     ├─ SchedulePreviewCard
│     └─ EmptyState
```

---

## 22. 페이지별 컴포넌트 구조 제안

### 22-1. 인증 페이지

```text
AuthPage
├─ AuthLayout
│  ├─ AuthHeader
│  ├─ AuthForm
│  │  ├─ InputField
│  │  ├─ InputField
│  │  ├─ PasswordField
│  │  └─ PrimaryButton
│  └─ SocialLoginButtons
│     ├─ KakaoLoginButton
│     └─ AppleLoginButton
```

### 22-2. 일정 추가/수정 페이지

```text
ScheduleFormPage
├─ PageLayout
│  ├─ TopNavigationBar
│  ├─ SectionTitle
│  ├─ ScheduleForm
│  │  ├─ TextInput
│  │  ├─ DatePickerField
│  │  ├─ TimeRangeField
│  │  ├─ CategorySelector
│  │  ├─ RepeatSelector
│  │  ├─ MemoTextArea
│  │  └─ SaveButton
```

### 22-3. 목표 관리 페이지

```text
GoalPage
├─ PageLayout
│  ├─ TopNavigationBar
│  ├─ GoalListHeader
│  ├─ GoalList
│  │  ├─ GoalCard
│  │  ├─ GoalCard
│  │  └─ ...
│  └─ AddGoalButton
```

### 22-4. AI 추천 페이지

```text
AiRecommendationPage
├─ PageLayout
│  ├─ TopNavigationBar
│  ├─ GoalSelector
│  ├─ PreferenceSelector
│  ├─ RecommendButton
│  ├─ RecommendationResultSection
│  │  ├─ AiRecommendationCard
│  │  ├─ AiRecommendationCard
│  │  └─ ...
│  └─ BottomActionBar
│     ├─ SecondaryButton
│     └─ PrimaryButton
```

---

## 23. Main 화면 컴포넌트 상세 역할

### 23-1. `TopChipBar`

역할:

* 현재 화면의 필터 또는 컨텍스트를 보여주는 상단 바

구성:

* 수평 스크롤 가능한 칩 리스트
* 칩마다 활성/비활성 상태 존재

주의:

* 칩의 의미를 지금 고정하지 말 것
* 연도, 월, 보기 옵션, 사용자 상태 등 다양한 데이터에 재사용 가능해야 함

### 23-2. `ProfileSummarySection`

역할:

* 현재 로그인한 사용자 정보를 보여줌
* 감정적으로 너무 차갑지 않은 홈 화면 인상을 형성함

구성:

* 아바타
* 닉네임
* 짧은 상태 문구
* 우측 액션 아이콘

주의:

* 과한 카드 UI로 만들지 말고, 여백 중심의 가벼운 섹션으로 유지

### 23-3. `CalendarMonthHeader`

역할:

* 현재 월/연도 표시
* 월 이동 또는 선택 기능 제공
* 일정 추가 기능 제공

구성:

* 좌측 작은 아이콘
* `2026.03` 같은 월 라벨
* 드롭다운 화살표
* 우측 `+` 버튼

주의:

* 월 텍스트는 작지 않게
* `+` 버튼은 메인 CTA 중 하나로 명확히 보여야 함

### 23-4. `MonthlyCalendarGrid`

역할:

* 월간 일정 확인의 중심 UI

구성:

* 7열 날짜 그리드
* 이전/다음 달 날짜 포함
* 날짜 셀별 상태 표시

표시 요소:

* 날짜 숫자
* 오늘 여부
* 선택 여부
* 일정 여부
* AI 일정 여부

### 23-5. `SelectedDatePanel`

역할:

* 선택한 날짜의 상세 정보를 보조적으로 보여줌

초기 MVP 방향:

* Main 하단에 간단히 붙이거나
* 바텀 시트로 띄우는 방식 둘 다 가능

표시 내용:

* 선택 날짜
* 일반 일정 목록
* AI 자기개발 계획 목록
* 일정 없을 경우 EmptyState

---

## 24. 추천 Props 설계

### 24-1. `Chip`

```ts
type ChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};
```

### 24-2. `Avatar`

```ts
type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
};
```

### 24-3. `CalendarDayCell`

```ts
type CalendarDayCellProps = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  hasSchedule?: boolean;
  hasAiPlan?: boolean;
  scheduleCount?: number;
  onClick?: () => void;
};
```

### 24-4. `ProfileSummarySection`

```ts
type ProfileSummarySectionProps = {
  nickname: string;
  message?: string;
  avatarUrl?: string;
  onProfileClick?: () => void;
  onFriendClick?: () => void;
};
```

### 24-5. `CalendarMonthHeader`

```ts
type CalendarMonthHeaderProps = {
  yearMonthLabel: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onOpenMonthPicker?: () => void;
  onAddSchedule?: () => void;
};
```

---

## 25. Main 페이지 상태 모델 제안

Main 페이지는 아래 상태를 가진다고 가정한다.

```ts
type MainPageState = {
  selectedDate: string;
  currentYearMonth: string;
  chips: Array<{
    id: string;
    label: string;
    active: boolean;
  }>;
  user: {
    nickname: string;
    avatarUrl?: string;
    message?: string;
  } | null;
  calendarDays: CalendarDayModel[];
  selectedDateSchedules: SchedulePreviewModel[];
  selectedDateAiPlans: AiPlanPreviewModel[];
  isLoading: boolean;
  isError: boolean;
};
```

### `CalendarDayModel`

```ts
type CalendarDayModel = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasSchedule: boolean;
  hasAiPlan: boolean;
  scheduleCount: number;
};
```

### `SchedulePreviewModel`

```ts
type SchedulePreviewModel = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
};
```

### `AiPlanPreviewModel`

```ts
type AiPlanPreviewModel = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  status: "RECOMMENDED" | "APPLIED" | "COMPLETED" | "MISSED";
};
```

---

## 26. Main 화면용 Mock Data 예시

초기 프론트 구현 시 백엔드 연결 전까지 아래와 같은 mock data를 사용한다.

```ts
export const mainPageMock = {
  chips: [
    { id: "year", label: "2024", active: false },
    { id: "month-full", label: "June 2024", active: true },
    { id: "month-short", label: "June", active: false },
    { id: "user", label: "진덕명", active: false },
  ],
  user: {
    nickname: "Nickname",
    avatarUrl: "/images/mock-avatar.png",
    message: "오늘 하루도 재밌게 화이팅!",
  },
  currentYearMonth: "2026.03",
  selectedDate: "2026-03-07",
  calendarDays: [],
  selectedDateSchedules: [
    {
      id: 1,
      title: "점호",
      startTime: "21:00",
      endTime: "21:30",
      category: "MILITARY",
    },
    {
      id: 2,
      title: "영어 공부",
      startTime: "22:00",
      endTime: "22:30",
      category: "SELF_DEV",
    },
  ],
  selectedDateAiPlans: [
    {
      id: 100,
      title: "AI 추천 독서 20분",
      startTime: "20:30",
      endTime: "20:50",
      status: "RECOMMENDED",
    },
  ],
};
```

---

## 27. Main 페이지 JSX 설계 예시

아래는 실제 구현 방향을 잡기 위한 구조 예시이다.

```tsx
function MainPage() {
  const {
    chips,
    user,
    currentYearMonth,
    calendarDays,
    selectedDateSchedules,
    selectedDateAiPlans,
    isLoading,
    isError,
  } = useMainPageViewModel();

  if (isLoading) {
    return <MainPageSkeleton />;
  }

  if (isError) {
    return <MainPageError />;
  }

  return (
    <MainLayout>
      <TopChipBar chips={chips} />

      <ProfileSummarySection
        nickname={user?.nickname ?? ""}
        message={user?.message ?? ""}
        avatarUrl={user?.avatarUrl}
      />

      <CalendarSection>
        <CalendarMonthHeader
          yearMonthLabel={currentYearMonth}
          onAddSchedule={() => {}}
          onOpenMonthPicker={() => {}}
        />

        <CalendarWeekHeader />

        <MonthlyCalendarGrid days={calendarDays} onSelectDate={() => {}} />
      </CalendarSection>

      <SelectedDatePanel
        schedules={selectedDateSchedules}
        aiPlans={selectedDateAiPlans}
      />
    </MainLayout>
  );
}
```

---

## 28. Main 페이지 ViewModel 가이드

프론트에서 화면과 비즈니스 로직을 적당히 분리하기 위해, 페이지 훅 또는 ViewModel 훅을 두는 것을 권장한다.

예시:

```ts
function useMainPageViewModel() {
  // 현재 월 상태
  // 선택 날짜 상태
  // 사용자 조회
  // 월간 일정 조회
  // 날짜별 필터링
  // 액션 핸들러 정의

  return {
    chips,
    user,
    currentYearMonth,
    calendarDays,
    selectedDateSchedules,
    selectedDateAiPlans,
    isLoading,
    isError,
    onSelectDate,
    onPrevMonth,
    onNextMonth,
    onAddSchedule,
  };
}
```

이 구조의 장점:

* JSX가 깔끔해진다.
* 나중에 테스트하기 쉬워진다.
* 캘린더 계산 로직과 UI를 분리할 수 있다.

---

## 29. API 매핑 가이드

### Main 화면에서 필요한 API

#### 1. 내 정보 조회

* `GET /api/v1/auth/me`

용도:

* 프로필 영역
* 닉네임
* 사용자 기본 식별 정보

#### 2. 프로필 조회

* `GET /api/v1/profile`

용도:

* 상태 문구
* 사용자 생활 패턴
* 추후 개인화 홈 데이터

#### 3. 특정 월 일정 조회

* `GET /api/v1/schedules?startDate=2026-03-01&endDate=2026-03-31`

용도:

* 월간 캘린더 마커 표시
* 날짜별 일정 여부 표시

#### 4. 특정 날짜 계획 조회

* `GET /api/v1/daily-plans?date=2026-03-07`

용도:

* 선택 날짜 패널
* 일반 일정 + AI 계획 함께 조회

---

## 30. Main 화면 DTO 관점 요구사항

프론트 관점에서 백엔드가 내려주면 좋은 최소 데이터 구조는 아래와 같다.

### 월간 일정 조회 응답 예시

```json
{
  "success": true,
  "message": "일정을 조회했습니다.",
  "data": [
    {
      "date": "2026-03-01",
      "scheduleCount": 2,
      "hasAiPlan": false
    },
    {
      "date": "2026-03-02",
      "scheduleCount": 1,
      "hasAiPlan": true
    }
  ]
}
```

### 날짜별 통합 조회 응답 예시

```json
{
  "success": true,
  "message": "일일 계획을 조회했습니다.",
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
        "id": 100,
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

## 31. Tailwind 기준 스타일 토큰 예시

Tailwind를 사용할 경우 아래 수준의 토큰 체계를 권장한다.

### 컬러 토큰 예시

```ts
colors: {
  background: "#F8F8F6",
  surface: "#FFFFFF",
  text: {
    primary: "#111111",
    secondary: "#8E8E93",
    muted: "#B7B7BD",
  },
  line: "#E6E6E8",
  chip: {
    default: "#EFEFEF",
    active: "#E4E4E4",
  },
  status: {
    success: "#3D7A57",
    warning: "#D98E2F",
    ai: "#DCE8F8",
  },
}
```

### radius 토큰 예시

```ts
borderRadius: {
  sm: "10px",
  md: "16px",
  lg: "20px",
  pill: "999px",
}
```

### spacing 원칙

* 섹션 간: `24px` 이상
* 카드 내부: `12~16px`
* 칩 간: `8px`
* 캘린더 셀 내부: `6~8px`

---

## 32. 캘린더 셀 디자인 규칙

`CalendarDayCell`은 Main 화면 품질을 결정하는 핵심 컴포넌트이므로 아래 규칙을 따른다.

### 셀 내부 우선순위

1. 날짜 숫자
2. 선택/오늘 상태
3. 일정 마커
4. AI 계획 마커

### 상태 표현

* 기본 날짜: 텍스트만
* 이전/다음 달 날짜: 연한 회색
* 오늘: 은은한 배경
* 선택: 진한 텍스트 + 강조 배경
* 일정 있음: 작은 점
* AI 일정 있음: 보조 점 또는 외곽선 점

### 하지 말아야 할 것

* 셀마다 카드처럼 테두리 주기
* 색상을 과도하게 사용하기
* 작은 화면에서 마커를 너무 많이 넣기
* 캘린더를 지나치게 장식적으로 만들기

---

## 33. 빈 상태 문구 가이드

이 서비스는 너무 업무적이거나 딱딱한 문구보다, 가볍고 정돈된 문구가 더 잘 맞는다.

### 일정 없음

* 아직 등록된 일정이 없어요.
* `+` 버튼으로 첫 일정을 추가해보세요.

### 목표 없음

* 아직 자기개발 목표가 없어요.
* 목표를 추가하면 AI가 더 잘 추천할 수 있어요.

### AI 추천 없음

* 아직 추천된 계획이 없어요.
* 목표를 선택하고 AI 추천을 받아보세요.

### 에러

* 데이터를 불러오지 못했어요.
* 잠시 후 다시 시도해주세요.

---

## 34. Main 화면 구현 체크리스트

### UI

* [ ] 상단 칩 영역 구현
* [ ] 프로필 섹션 구현
* [ ] 월 헤더 구현
* [ ] 요일 헤더 구현
* [ ] 캘린더 그리드 구현
* [ ] 날짜 선택 상태 구현
* [ ] 일정 마커 구현
* [ ] AI 마커 구현
* [ ] 빈 상태 구현
* [ ] 에러 상태 구현
* [ ] 로딩 스켈레톤 구현

### 기능

* [ ] 현재 월 계산
* [ ] 이전/다음 달 이동
* [ ] 날짜 선택
* [ ] 선택 날짜 일정 표시
* [ ] 일정 추가 이동
* [ ] 프로필 이동
* [ ] API 연동

### 품질

* [ ] 모바일 화면 기준 여백 점검
* [ ] 터치 영역 점검
* [ ] 접근성 레이블 점검
* [ ] iOS safe area 점검

---

## 35. Claude에게 직접 주는 구현 요청 예시

아래 같은 방식으로 Claude Code에게 작업을 요청할 수 있다.

### 예시 1

* Main 화면을 현재 시안 기준으로 React + TypeScript로 구현하라.
* 상단 칩, 프로필 영역, 월간 캘린더, 일정 추가 버튼을 포함하라.
* 스타일은 미니멀하고 둥근 iOS 감성으로 맞추라.
* 데이터는 우선 mock data로 처리하라.

### 예시 2

* `CalendarDayCell`, `MonthlyCalendarGrid`, `CalendarMonthHeader`를 분리 구현하라.
* 각 컴포넌트는 재사용 가능해야 한다.
* `hasSchedule`, `hasAiPlan`, `isToday`, `isSelected` 상태를 시각적으로 구분하라.

### 예시 3

* `useMainPageViewModel` 훅을 만들어 Main 페이지의 상태와 이벤트를 관리하라.
* 월 이동, 날짜 선택, mock 일정 필터링을 포함하라.

---

## 36. 최종 프론트 구현 방향 요약

이 프로젝트의 프론트는 다음 순서로 발전시키는 것이 적절하다.

### 1단계

* Main 화면 정적 구현
* 일정 추가 화면 정적 구현
* 목표 화면 정적 구현

### 2단계

* Main 화면 캘린더 인터랙션 연결
* mock data 연결
* 날짜 선택 흐름 완성

### 3단계

* 백엔드 API 연동
* 인증 흐름 연결
* 일정 CRUD 연결

### 4단계

* 목표 관리 연결
* AI 추천 흐름 연결
* 오늘의 계획 화면 연결

### 5단계

* 상태 고도화
* 애니메이션 다듬기
* 에러/빈 상태 개선
* 반응형 품질 개선


## 37. Claude Code용 프론트 구현 프롬프트

아래 프롬프트들은 이 프로젝트의 프론트엔드를 단계적으로 구현하기 위해 사용할 수 있는 실전 작업 지시문이다.
한 번에 전체를 구현시키기보다, **화면 단위 → 컴포넌트 단위 → 상태 연결 → API 연동** 순서로 사용하는 것을 권장한다.

---

## 38. 공통 작업 원칙 프롬프트

먼저 Claude Code에게 아래 공통 원칙을 항상 전제로 주는 것이 좋다.

```text id="onpv5w"
이 프로젝트는 군 생활 맞춤형 AI 자기개발 플래너의 프론트엔드입니다.

기술 스택은 React + TypeScript 기준으로 작성해주세요.
스타일은 Tailwind CSS 또는 CSS Modules 중 현재 프로젝트 구조에 맞는 방식으로 작성해주세요.
화면은 모바일 우선으로 구현해주세요.
디자인 방향은 미니멀, 둥근 칩, 차분한 생산성 앱, 캘린더 중심 구조입니다.
제공된 Main 화면 시안을 최대한 반영하되, 컴포넌트는 재사용 가능하게 분리해주세요.
한 번에 너무 많은 파일을 바꾸지 말고, 먼저 구현 계획을 짧게 제시한 뒤 작업해주세요.
mock data 기반으로 먼저 구현하고, 이후 API 연동이 가능하도록 구조화해주세요.
```

---

## 39. Main 화면 정적 구현 프롬프트

처음 시작할 때 가장 먼저 사용할 수 있는 프롬프트다.

```text id="vwr2m6"
Main 화면을 React + TypeScript로 정적 구현해주세요.

요구사항:
- 모바일 화면 기준으로 구현
- 상단에 가로 스크롤 가능한 둥근 칩 바가 있어야 함
- 그 아래 프로필 요약 영역이 있어야 함
  - 원형 아바타
  - 닉네임
  - 짧은 응원 문구
  - 우측 액션 아이콘 1~2개
- 그 아래 월간 캘린더 헤더가 있어야 함
  - 현재 월 표시 (예: 2026.03)
  - 드롭다운 affordance
  - 일정 추가 버튼
- 그 아래 월간 캘린더 그리드를 구현
  - 요일 헤더 포함
  - 7열 구조
  - 이전/다음 달 날짜 일부 표시
- 전체 스타일은 매우 미니멀하고, 흰색/밝은 회색/검정 중심으로 구현
- 칩, 버튼, 셀은 둥근 감성을 유지
- 우선 mock data로 렌더링
- 컴포넌트는 MainPage 내부에 몰아 넣지 말고 분리

원하는 산출물:
1. MainPage
2. TopChipBar
3. ProfileSummarySection
4. CalendarMonthHeader
5. CalendarWeekHeader
6. MonthlyCalendarGrid
7. CalendarDayCell
8. 필요한 mock data
```

---

## 40. Main 화면 인터랙션 추가 프롬프트

정적 구현 이후 사용하는 프롬프트다.

```text id="w0pxm5"
이미 구현된 Main 화면에 인터랙션을 추가해주세요.

요구사항:
- 현재 월 상태를 관리
- 이전 달 / 다음 달 이동 가능
- 날짜 셀 클릭 시 선택 상태 변경
- 오늘 날짜를 별도로 구분
- 선택된 날짜의 일정 목록을 하단 패널 또는 하단 섹션에 보여주기
- 선택된 날짜에 일정이 없으면 EmptyState를 보여주기
- mock data를 이용해 날짜별 일정 표시
- 일정이 있는 날짜는 점(marker)으로 표시
- AI 추천 일정이 있는 날짜는 일반 일정과 다른 marker로 구분

구현 원칙:
- 캘린더 계산 로직은 컴포넌트 내부에 과도하게 넣지 말고 util 또는 custom hook으로 분리
- MainPage에서 useMainPageViewModel 같은 훅을 사용해 상태를 관리
- 코드 가독성을 우선
```

---

## 41. Main 화면 ViewModel 훅 구현 프롬프트

상태 관리를 정리하고 싶을 때 사용한다.

```text id="n93ecj"
Main 화면용 useMainPageViewModel 훅을 구현해주세요.

포함할 내용:
- currentYearMonth 상태
- selectedDate 상태
- chips mock state
- user mock state
- calendarDays 생성 로직
- selectedDateSchedules 계산 로직
- selectedDateAiPlans 계산 로직
- onPrevMonth
- onNextMonth
- onSelectDate
- onAddSchedule

요구사항:
- React + TypeScript
- dayjs 또는 date-fns 사용 가능
- 반환 타입이 명확해야 함
- JSX에서 사용하기 쉽게 정리
- 향후 API 연동으로 교체하기 쉬운 구조여야 함
```

---

## 42. 캘린더 전용 컴포넌트 분리 프롬프트

캘린더 영역만 고도화할 때 적절하다.

```text id="s7205w"
월간 캘린더 영역을 독립적인 재사용 컴포넌트 세트로 분리해주세요.

필요 컴포넌트:
- CalendarMonthHeader
- CalendarWeekHeader
- MonthlyCalendarGrid
- CalendarDayCell

요구사항:
- props 설계를 먼저 명확히 해주세요
- 날짜 셀은 isToday, isSelected, isCurrentMonth, hasSchedule, hasAiPlan 상태를 지원해야 함
- 스타일은 과장되지 않게 미니멀해야 함
- 셀마다 박스 테두리를 강하게 넣지 말 것
- 여백과 subtle한 상태 표현으로 구분할 것
- 이전/다음 달 날짜는 흐리게 처리
- 일반 일정 marker와 AI marker를 다르게 표시
```

---

## 43. 일정 추가 화면 구현 프롬프트

Main 다음 우선 구현 화면이다.

```text id="or6h9d"
일정 추가/수정 페이지를 구현해주세요.

요구사항:
- 페이지 상단에 뒤로가기와 제목 표시
- 폼 항목:
  - 일정 이름
  - 날짜
  - 시작 시간
  - 종료 시간
  - 카테고리
  - 반복 주기
  - 메모
- 저장 버튼
- 입력 UI는 모바일 친화적으로 구성
- 스타일은 Main 화면과 동일한 톤 유지
- 재사용 가능한 폼 컴포넌트가 있으면 분리
- 현재는 mock submit으로 처리
- 나중에 API 연결이 가능하도록 form state 구조를 명확히 작성

추가 요구사항:
- create 모드와 edit 모드 둘 다 대응할 수 있는 구조로 설계
```

---

## 44. 일정 상세 화면 구현 프롬프트

```text id="xsj1lk"
일정 상세 화면을 구현해주세요.

요구사항:
- 일정 제목
- 날짜
- 시간
- 카테고리
- 반복 여부
- 메모
- 수정 버튼
- 삭제 버튼

스타일 원칙:
- 과하게 카드가 많은 화면보다 정보가 정돈된 레이아웃
- 액션 버튼은 명확히 구분
- 삭제 버튼은 위험 액션으로 인지되도록 하되 과도하게 튀지 않게 처리

상태:
- 데이터 있음
- 데이터 없음
- 로딩
- 에러 상태까지 고려해주세요
```

---

## 45. 목표 관리 화면 구현 프롬프트

```text id="shjmfp"
목표 관리 페이지를 구현해주세요.

요구사항:
- 목표 목록을 카드 형태로 표시
- 각 카드에는 다음 정보가 포함되어야 함
  - 목표명
  - 목표 유형
  - 회당 시간
  - 주당 횟수
  - 활성 여부
- 목표 추가 버튼
- 목표 수정 진입 가능
- EmptyState 지원

디자인 방향:
- Main 화면보다 약간 정보 밀도가 높아도 되지만, 전체 톤은 동일해야 함
- 카드 디자인은 심플하고 라이트한 배경 사용
- 상태 태그는 작고 정돈되게 표현
```

---

## 46. AI 가이드 화면 구현 프롬프트

```text id="vq1qwf"
AI 가이드 화면을 구현해주세요.

화면 목적:
- 사용자가 목표를 선택하고 AI 추천을 요청하는 화면

필수 요소:
- 목표 선택 영역
- 추천 강도 선택
- 하루 권장 시간 선택
- 주당 횟수 선택
- 추천 요청 버튼

스타일:
- 너무 기술적인 느낌보다 친절하고 정돈된 느낌
- form 화면이지만 답답하지 않게 간격을 충분히 둘 것

추가:
- 선택 값은 mock state로 관리
- 추천 버튼 클릭 시 결과 페이지로 이동할 수 있는 구조를 고려
```

---

## 47. AI 추천 결과 화면 구현 프롬프트

```text id="4z5s2g"
AI 추천 결과 화면을 구현해주세요.

요구사항:
- 추천된 일정 리스트 표시
- 각 카드에 포함할 정보:
  - 추천 활동명
  - 시작 시간 / 종료 시간
  - 추천 이유(짧은 설명)
  - 상태 태그
- 하단 액션:
  - 다시 추천받기
  - 적용하기

스타일:
- 추천 결과가 너무 딱딱한 리스트처럼 보이지 않게
- 그러나 과한 카드/배경색 사용은 피할 것
- AI 관련 요소는 아주 연한 보조 색상 사용 가능

상태:
- 추천 결과 있음
- 추천 결과 없음
- 로딩
- 에러
```

---

## 48. 오늘의 계획 화면 구현 프롬프트

```text id="8nsg1p"
오늘의 계획 화면을 구현해주세요.

요구사항:
- 오늘 날짜 표시
- 일반 일정과 AI 자기개발 계획을 함께 보여주기
- 각 항목에 완료 / 미수행 액션 제공
- 상태별 시각적 차이 제공
  - 예정
  - 완료
  - 미수행

UI 방향:
- 체크리스트와 타임라인의 중간 정도 느낌
- 복잡하지 않게 한눈에 오늘 할 일을 파악할 수 있어야 함
- Main 화면 톤과 연결되어야 함
```

---

## 49. 공통 UI 컴포넌트 구축 프롬프트

화면 작업 전에 공통 UI를 먼저 깔고 싶다면 유용하다.

```text id="c8tv0t"
이 프로젝트에서 재사용할 공통 UI 컴포넌트를 먼저 구현해주세요.

우선순위 컴포넌트:
- Chip
- IconButton
- Avatar
- PrimaryButton
- SecondaryButton
- Tag
- EmptyState
- SectionHeader
- BottomSheet
- TextField
- TextAreaField

요구사항:
- 스타일은 미니멀 + 둥근 생산성 앱 톤
- props 타입을 명확히 정의
- 접근성을 고려
- disabled, active, loading 등 기본 상태 지원
- 가능한 한 도메인 종속성을 줄이고 shared/ui 구조에 배치
```

---

## 50. 폴더 구조 정리 프롬프트

Claude가 구조를 일관되게 잡도록 할 때 좋다.

```text id="cbjl6r"
현재 프론트 프로젝트를 아래 원칙에 맞게 폴더 구조를 정리해주세요.

원칙:
- pages / widgets / features / entities / shared 기준
- Main 화면 관련 코드는 widgets와 pages로 분리
- 공통 UI는 shared/ui로 분리
- mock data는 shared/model 또는 features 하위 적절한 위치에 배치
- API 함수는 shared/api에 두고, 화면 로직과 분리
- 각 폴더 역할을 짧게 주석 또는 README 형태로 남겨도 좋음

과도한 추상화는 피하고, 현재 MVP 규모에 맞게 단순하고 명확한 구조를 유지해주세요.
```

---

## 51. Tailwind 스타일 시스템 세팅 프롬프트

Tailwind를 쓴다면 추천한다.

```text id="l7wb5g"
이 프로젝트의 디자인 방향에 맞게 Tailwind 기반 스타일 토큰을 정리해주세요.

포함 내용:
- background
- surface
- text primary / secondary / muted
- line
- chip default / active
- status success / warning / ai
- radius scale
- spacing 기준
- shadow 최소 기준

요구사항:
- 미니멀, 차분한, 둥근 생산성 앱 스타일
- 너무 많은 색상 정의 금지
- Main 화면 시안과 자연스럽게 맞는 값으로 설정
- 예시 컴포넌트에 실제 적용 예도 보여주세요
```

---

## 52. API 연동 전환 프롬프트

mock에서 실제 API로 전환할 때 사용한다.

```text id="8tdu0h"
현재 mock data 기반으로 구현된 Main 화면을 실제 API 연동 구조로 바꿔주세요.

필요 API:
- GET /api/v1/auth/me
- GET /api/v1/profile
- GET /api/v1/schedules?startDate=...&endDate=...
- GET /api/v1/daily-plans?date=...

요구사항:
- React Query 사용 가능
- 서버 상태와 UI 상태를 분리
- 로딩/에러/빈 상태를 유지
- 기존 UI 컴포넌트 구조는 최대한 유지
- API 응답 타입 정의
- 변환 로직이 필요하면 mapper 함수 분리
```

---

## 53. 반응형/품질 개선 프롬프트

UI polish 단계에서 유용하다.

```text id="uv7j4l"
현재 구현된 Main 화면과 주요 화면들의 UI 품질을 개선해주세요.

점검 항목:
- 모바일 화면 여백
- 아이콘 크기 균형
- 칩 높이와 패딩
- 캘린더 셀 높이
- 텍스트 대비
- 버튼 터치 영역
- 스크롤 자연스러움
- 빈 상태/에러 상태 일관성
- iOS safe area 대응

원칙:
- 디자인을 크게 바꾸지 말고, 정돈감과 완성도를 높이는 방향으로 개선
- subtle하고 절제된 polish를 목표로 할 것
```

---

## 54. 실제 작업 순서 추천 프롬프트 묶음

Claude Code에 순차적으로 넣기 좋은 추천 순서다.

### 1단계

```text id="3l0fcs"
공통 UI 컴포넌트부터 구현해주세요.
Chip, Avatar, IconButton, PrimaryButton, EmptyState를 먼저 만들어주세요.
```

### 2단계

```text id="azvo3h"
Main 화면 정적 UI를 구현해주세요.
mock data 기반으로만 우선 작업해주세요.
```

### 3단계

```text id="y1i96g"
Main 화면에 월 이동, 날짜 선택, 일정 marker 표시 인터랙션을 추가해주세요.
```

### 4단계

```text id="d8m4su"
일정 추가/수정 화면을 구현해주세요.
```

### 5단계

```text id="4jot0i"
목표 관리 화면과 목표 추가/수정 화면을 구현해주세요.
```

### 6단계

```text id="jjtqbi"
AI 가이드 화면과 AI 추천 결과 화면을 구현해주세요.
```

### 7단계

```text id="vov3uh"
백엔드 API 응답 구조를 기준으로 Main 화면과 일정 화면을 실제 API 연동 구조로 바꿔주세요.
```

---

## 55. Claude 응답 형식 요구 프롬프트

Claude가 더 정리된 방식으로 응답하도록 유도하려면 아래를 같이 붙이는 것이 좋다.

```text id="m8r1dn"
작업할 때 아래 형식으로 진행해주세요.

1. 먼저 변경 계획을 5줄 이내로 설명
2. 어떤 파일을 만들거나 수정할지 먼저 정리
3. 그 다음 실제 코드를 작성
4. 마지막에 실행 방법과 확인 포인트를 정리

주의:
- 한 번에 너무 많은 범위를 수정하지 말 것
- 기존 코드 스타일을 유지할 것
- 컴파일 가능한 상태를 유지할 것
```

---

## 56. 가장 추천하는 첫 실전 프롬프트

지금 바로 시작할 때는 아래 프롬프트 하나가 가장 실용적이다.

```text id="avb7t3"
이 프로젝트의 Main 화면을 React + TypeScript로 구현해주세요.

전제:
- 모바일 우선
- 미니멀하고 차분한 생산성 앱 스타일
- 둥근 칩, 프로필 요약, 월간 캘린더, 일정 추가 버튼 포함
- 현재 제공된 시안의 구조를 최대한 반영
- mock data 기반으로 먼저 구현
- 컴포넌트는 재사용 가능하게 분리
- pages / widgets / shared/ui 구조를 고려
- 월 이동, 날짜 선택, 일정 marker, AI marker 상태를 지원할 수 있도록 설계

원하는 출력:
1. 구현 계획
2. 필요한 파일 구조
3. 각 파일 코드
4. 실행 방법
5. 다음 단계 제안
```

---

## 57. 최종 요약

Claude Code에게 프론트 작업을 맡길 때 핵심은 다음이다.

* 처음부터 모든 기능을 붙이지 않는다.
* Main 화면을 기준으로 전체 톤을 먼저 잡는다.
* 공통 UI와 캘린더 구조를 먼저 안정화한다.
* 그 다음 일정/목표/AI 화면으로 확장한다.
* mock → 상태 로직 → API 연동 순서로 진행한다.

즉, 가장 좋은 진행 방식은 다음 한 줄로 정리할 수 있다.

> **“Main 화면을 중심으로 UI 톤과 캘린더 구조를 먼저 확립한 뒤, 일정/목표/AI 기능을 점진적으로 연결한다.”**
