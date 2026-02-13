# CrazyMonth

인기 아이돌 그룹의 **콘서트 티켓 예매 오픈(판매 시작) 일정**을 한눈에 확인할 수 있는 웹 서비스

## 프로젝트 소개

CrazyMonth는 멜론 티켓과 인터파크 티켓에서 16개 인기 아이돌 그룹의 **티켓 예매 오픈 일정**을 자동으로 수집하여 달력 형태로 보여주는 웹사이트입니다.

> **핵심 가치**: "언제 티켓팅을 해야 하는지" - 콘서트가 언제 열리는지가 아니라, **티켓이 언제 판매 시작되는지**를 알려줍니다.

### 주요 기능

- 📅 **통합 달력**: 여러 티켓 사이트의 예매 오픈 일정을 하나의 달력에서 확인
- 🎨 **Apple Calendar 스타일**: 심플하고 깔끔한 UI 디자인
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- 🎯 **16개 아티스트 지원**: 엔시티드림, 세븐틴, 방탄소년단 등 인기 그룹
- ⏰ **정확한 시간 정보**: 예매 오픈 날짜와 시간을 정확히 표시

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns
- **HTTP Client**: axios

## 설치 방법

1. 프로젝트 클론 또는 다운로드
2. 의존성 설치:

```bash
npm install
```

## 실행 방법

### 개발 모드

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 배포 방법

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결 또는 프로젝트 업로드
3. 자동 배포 완료

### 일반 호스팅

1. `npm run build` 실행
2. `.next` 폴더와 `package.json`을 서버에 업로드
3. Node.js 환경에서 `npm start` 실행

### 정적 파일 배포

1. `npm run build` 실행
2. `out` 폴더의 내용을 웹 서버에 업로드
3. (Next.js 설정에서 `output: 'export'` 필요)

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── Calendar/          # 달력 관련 컴포넌트
│   │   ├── CalendarGrid.tsx
│   │   ├── CalendarHeader.tsx
│   │   ├── CalendarDay.tsx
│   │   └── EventItem.tsx
│   └── Layout/            # 레이아웃 컴포넌트
│       └── ResponsiveContainer.tsx
├── services/              # 비즈니스 로직
│   ├── scraper.ts         # 웹 스크래핑 서비스
│   └── dataProcessor.ts   # 데이터 처리
├── types/                 # TypeScript 타입 정의
│   └── event.ts
└── utils/                 # 유틸리티 함수
    └── dateHelpers.ts
```

## 환경 변수

현재는 환경 변수가 필요하지 않습니다. 향후 실제 스크래핑 기능 추가 시 다음 변수들이 필요할 수 있습니다:

- `NEXT_PUBLIC_API_URL`: API 엔드포인트 URL
- `SCRAPER_INTERVAL`: 스크래핑 주기 (분 단위)

## 주요 아티스트 목록

- 엔시티드림 (NCT DREAM)
- 엔시티위시 (NCT WISH)
- 라이즈 (RIIZE)
- 세븐틴 (SEVENTEEN)
- 임영웅
- 엑소 (EXO)
- 방탄소년단 (BTS)
- 워너원 (Wanna One)
- 데이식스 (DAY6)
- 투바투 (TXT)
- 스트레이키즈 (Stray Kids)
- 에이티즈 (ATEEZ)
- 더보이즈 (THE BOYZ)
- 보이넥스트도어 (BOYNEXTDOOR)
- 엔하이픈 (ENHYPEN)
- 제로베이스원 (ZEROBASEONE)

## 데이터 수집 소스

- **멜론 티켓**: 티켓 오픈 코너에서 예매 오픈 일정 수집
- **인터파크**: 공지사항 페이지에서 예매 오픈 일정 파싱

## 향후 계획

- [ ] 실제 웹 스크래핑 기능 구현 (Puppeteer)
- [ ] 자동 데이터 업데이트 (스케줄링)
- [ ] 이전/다음 달 네비게이션
- [ ] 아티스트 필터링 기능
- [ ] 알림/리마인더 기능 (예매 오픈 임박 알림)
- [ ] 캘린더 내보내기 (iCal)
- [ ] 더 많은 티켓 사이트 지원 (예스24, 티켓링크 등)

## 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.
