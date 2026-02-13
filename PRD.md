# Product Requirements Document (PRD)
## CrazyMonth - 아이돌 콘서트 티켓 예매 달력

---

## 1. Product Overview

### 1.1 Product Name
**CrazyMonth**

### 1.2 Product Vision
인기 아이돌 그룹의 콘서트 티켓 예매 일정을 하나의 통합 달력에서 한눈에 확인할 수 있는 웹 서비스

### 1.3 Target Users
- **Primary Users**: 아이돌 콘서트 팬, 티켓팅을 준비하는 사용자
- **System Role**: 자동으로 티켓 예매 정보를 수집하고 달력을 생성하는 웹사이트

---

## 2. Core Features

### 2.1 Data Collection (Web Scraping)
**목적**: 티켓 예매 사이트에서 콘서트 정보 자동 수집

**Target Websites**:
1. 노을(NOL) 티켓: `https://nol.yanolja.com/ticket/genre/concert`
2. 멜론 티켓: `https://ticket.melon.com/concert/index.htm?genreType=GENRE_CON`

**Target Artists** (16개 그룹):
```
엔시티드림, 엔시티위시, 라이즈, 세븐틴, 임영웅, 엑소, 방탄소년단, 워너원, 
데이식스, 투바투, 스트레이키즈, 에이티즈, 더보이즈, 보이넥스트도어, 
엔하이픈, 제로베이스원
```

**Collected Data Fields**:
- 아티스트 이름 (Artist Name)
- 예매 시작 날짜 (Ticket Sale Date)
- 예매 시작 시간 (Ticket Sale Time)
- 콘서트 제목 (Concert Title) - optional
- 예매 사이트 링크 (Booking URL) - optional

**Collection Scope**:
- 현재 날짜가 속한 월(month)의 예매 일정만 수집
- 매일 또는 주기적으로 업데이트

**Data Storage Format**:
```json
{
  "artist": "세븐틴",
  "saleDate": "2025-02-20",
  "saleTime": "20:00",
  "title": "SEVENTEEN WORLD TOUR",
  "source": "melon",
  "url": "https://..."
}
```

### 2.2 Calendar Display
**목적**: 수집된 데이터를 시각적 달력 UI로 표시

**Calendar Structure**:
- 표준 월간 달력 레이아웃
- 열(Columns): 일, 월, 화, 수, 목, 금, 토 (7일)
- 행(Rows): 4-5주 (월에 따라 가변)
- 1일부터 말일까지 표시

**Design Specifications**:

1. **Overall Style**:
   - 심플하고 미니멀한 디자인
   - Apple Calendar 스타일 참고
   
2. **Month Indicator**:
   - 달력 중앙에 해당 월 숫자 표시 (예: "2")
   - 큰 폰트 사이즈 (제목 크기)
   - 반투명 처리 (opacity: 0.1-0.2)
   - 다른 일정과 겹쳐도 가독성 유지

3. **Event Display**:
   - 직사각형 박스 형태
   - 하이라이트된 배경색
   - Apple Calendar의 이벤트 UI와 유사
   - 각 이벤트 포함 정보:
     - 아티스트 이름
     - 예매 시간
   - 같은 날 여러 이벤트 시 세로로 스택

4. **Color Coding** (선택사항):
   - 아티스트별 또는 소속사별 색상 구분
   - 출처별 색상 구분 (NOL/멜론)

### 2.3 Responsive Design
**목적**: 모든 디바이스에서 최적화된 사용 경험 제공

**Breakpoints**:
1. **Mobile** (< 768px):
   - 세로 스크롤 가능한 주간 뷰 또는 컴팩트한 월간 뷰
   - 터치 최적화
   - 작은 화면에 맞춘 폰트 크기

2. **Tablet** (768px - 1024px):
   - 전체 월간 뷰
   - 적절한 여백과 간격

3. **Desktop** (> 1024px):
   - 넓은 레이아웃
   - 선택적으로 사이드바 추가 가능

**Performance Requirements**:
- 빠른 로딩 속도
- 부드러운 스크롤 및 애니메이션
- 크로스 브라우저 호환성

---

## 3. Technical Architecture

### 3.1 Recommended Tech Stack

**Frontend**:
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Calendar Library**: react-big-calendar 또는 커스텀 구현
- **State Management**: React Query (데이터 페칭) + Zustand (UI 상태)

**Backend** (선택적):
- **Runtime**: Node.js
- **Framework**: Express.js 또는 Next.js API Routes
- **Scraping**: Puppeteer 또는 Cheerio
- **Scheduling**: node-cron

**Alternative (Simpler)**:
- **Frontend Only**: Next.js (SSR/SSG)
- **Scraping**: 클라이언트 사이드 또는 서버리스 함수
- **Deployment**: Vercel

### 3.2 Data Flow
```
[티켓 사이트] 
    ↓ (스크래핑)
[데이터 수집 모듈]
    ↓ (필터링/정제)
[JSON 데이터 저장]
    ↓ (API 또는 직접 로드)
[React 달력 컴포넌트]
    ↓ (렌더링)
[사용자 브라우저]
```

### 3.3 Component Structure
```
src/
├── components/
│   ├── Calendar/
│   │   ├── CalendarGrid.tsx       # 달력 그리드
│   │   ├── CalendarHeader.tsx     # 월/년도 헤더
│   │   ├── CalendarDay.tsx        # 개별 날짜 셀
│   │   └── EventItem.tsx          # 예매 일정 아이템
│   └── Layout/
│       └── ResponsiveContainer.tsx
├── services/
│   ├── scraper.ts                  # 웹 스크래핑 로직
│   └── dataProcessor.ts            # 데이터 가공
├── types/
│   └── event.ts                    # TypeScript 타입 정의
└── utils/
    └── dateHelpers.ts              # 날짜 유틸리티
```

---

## 4. User Stories

### 4.1 Core User Story
**As a** K-pop 팬,  
**I want to** 이번 달 내가 좋아하는 아이돌의 티켓 예매 일정을 한눈에 보고 싶다  
**So that** 예매 시간을 놓치지 않고 미리 준비할 수 있다

### 4.2 Additional User Stories
1. **모바일 사용자**: 이동 중에도 휴대폰으로 쉽게 일정을 확인하고 싶다
2. **여러 그룹 팬**: 내가 팔로우하는 여러 아티스트의 일정을 한 곳에서 보고 싶다
3. **타이트한 일정**: 같은 날 여러 예매가 겹칠 때 시간 순으로 보고 싶다

---

## 5. Acceptance Criteria

### 5.1 Must Have (MVP)
- [ ] NOL과 멜론 티켓에서 16개 아티스트의 예매 정보 수집
- [ ] 현재 월의 예매 일정을 달력에 표시
- [ ] 아티스트명, 날짜, 시간 정보 표시
- [ ] 모바일/태블릿/데스크톱 반응형 지원
- [ ] Apple Calendar 스타일의 심플한 UI

### 5.2 Should Have
- [ ] 자동 데이터 업데이트 (일일 스크래핑)
- [ ] 예매 사이트 링크 제공
- [ ] 아티스트별 색상 구분
- [ ] 로딩 상태 표시

### 5.3 Could Have
- [ ] 이전/다음 달 네비게이션
- [ ] 특정 아티스트 필터링
- [ ] 알림/리마인더 기능
- [ ] 캘린더 내보내기 (iCal)

---

## 6. Constraints & Considerations

### 6.1 Legal & Ethical
- **저작권**: 티켓 사이트의 robots.txt 및 이용약관 준수
- **스크래핑 빈도**: 서버 부하를 최소화하기 위해 적절한 간격 설정
- **데이터 사용**: 개인 정보 수집 금지, 공개 정보만 활용

### 6.2 Technical Challenges
- **동적 콘텐츠**: JavaScript로 렌더링되는 페이지 스크래핑 (Puppeteer 필요)
- **사이트 구조 변경**: 티켓 사이트 HTML 구조 변경 시 대응
- **아티스트 이름 매칭**: 다양한 표기법 처리 (예: "NCT DREAM" vs "엔시티드림")

### 6.3 Performance
- **스크래핑 최적화**: 병렬 처리, 캐싱
- **프론트엔드 최적화**: 이미지 최적화, 코드 스플리팅

---

## 7. Success Metrics

### 7.1 Technical Metrics
- 데이터 수집 정확도: 95% 이상
- 페이지 로딩 시간: 2초 이하
- 모바일 반응 속도: 60fps 유지

### 7.2 User Metrics (향후 확장 시)
- 월간 활성 사용자 (MAU)
- 평균 세션 시간
- 재방문율

---

## 8. Timeline & Milestones

### Phase 1: MVP Development (2-3주)
- Week 1: 웹 스크래핑 모듈 개발 및 테스트
- Week 2: 달력 UI 컴포넌트 개발
- Week 3: 통합 및 반응형 최적화

### Phase 2: Enhancement (1-2주)
- 자동 업데이트 스케줄링
- UI/UX 개선
- 버그 수정

### Phase 3: Launch (1주)
- 배포 및 모니터링
- 사용자 피드백 수집

---

## 9. Future Enhancements

1. **더 많은 티켓 사이트 지원**: 인터파크, 예스24 등
2. **개인화 기능**: 사용자별 관심 아티스트 설정
3. **알림 시스템**: 예매 시작 전 푸시 알림
4. **커뮤니티 기능**: 티켓팅 팁 공유
5. **통계 대시보드**: 예매 경쟁률, 트렌드 분석

---

## 10. Appendix

### 10.1 Reference Links
- NOL 티켓: https://nol.yanolja.com/ticket/genre/concert
- 멜론 티켓: https://ticket.melon.com/concert/index.htm?genreType=GENRE_CON

### 10.2 Design References
- Apple Calendar (iOS/macOS)
- Google Calendar
- Notion Calendar

---

**Document Version**: 1.0  
**Last Updated**: 2025-02-14  
**Status**: Draft
