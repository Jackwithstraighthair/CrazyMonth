# CrazyMonth - AI 코딩 태스크별 프롬프트

이 문서는 CrazyMonth 프로젝트를 단계별로 구현하기 위한 AI 프롬프트 모음입니다.

---

## Task 1: 프로젝트 초기 설정

### 프롬프트:
```
React + TypeScript + Tailwind CSS를 사용하여 Next.js 프로젝트를 생성해줘.

프로젝트 이름: crazymonth
필요한 패키지:
- react-big-calendar (달력 라이브러리)
- date-fns (날짜 유틸리티)
- axios (HTTP 클라이언트)

다음 폴더 구조를 만들어줘:
src/
├── components/
│   ├── Calendar/
│   └── Layout/
├── services/
├── types/
├── utils/
└── styles/

package.json, tsconfig.json, tailwind.config.js도 적절히 설정해줘.
```

---

## Task 2: TypeScript 타입 정의

### 프롬프트:
```
src/types/event.ts 파일을 생성하고, 다음 데이터 모델에 대한 TypeScript 인터페이스를 정의해줘:

1. ConcertEvent (콘서트 예매 이벤트):
   - artist: string (아티스트 이름)
   - saleDate: string (예매 날짜, ISO 8601 형식)
   - saleTime: string (예매 시간, "HH:MM" 형식)
   - title?: string (콘서트 제목, 선택적)
   - source: 'nol' | 'melon' (출처)
   - url?: string (예매 링크, 선택적)

2. CalendarEvent (달력 표시용 이벤트):
   - id: string
   - title: string
   - start: Date
   - end: Date
   - artist: string
   - source: 'nol' | 'melon'
   - color?: string

3. ScrapingResult:
   - events: ConcertEvent[]
   - lastUpdated: string
   - errors?: string[]

각 인터페이스에 JSDoc 주석도 추가해줘.
```

---

## Task 3: 날짜 유틸리티 함수

### 프롬프트:
```
src/utils/dateHelpers.ts 파일을 만들고 다음 함수들을 구현해줘:

1. getCurrentMonthRange(): { start: Date, end: Date }
   - 현재 월의 시작일과 마지막일을 반환

2. formatDate(date: Date | string): string
   - Date 객체를 "YYYY-MM-DD" 형식으로 변환

3. formatTime(time: string): string
   - "HH:MM" 형식의 시간을 "오후 8시" 같은 한국어 형식으로 변환

4. isSameMonth(date1: Date, date2: Date): boolean
   - 두 날짜가 같은 월인지 확인

5. getDaysInMonth(date: Date): number
   - 해당 월의 일수 반환

6. getWeekdayName(dayIndex: number): string
   - 0(일요일)~6(토요일)을 "일", "월", ... "토"로 변환

모든 함수에 TypeScript 타입 정의와 JSDoc 주석을 추가해줘.
date-fns 라이브러리를 활용해도 좋아.
```

---

## Task 4: 웹 스크래핑 서비스 (기본 구조)

### 프롬프트:
```
src/services/scraper.ts 파일을 생성하고, 웹 스크래핑을 위한 기본 구조를 만들어줘.

대상 아티스트 리스트:
["엔시티드림", "엔시티위시", "라이즈", "세븐틴", "임영웅", "엑소", "방탄소년단", "워너원", 
"데이식스", "투바투", "스트레이키즈", "에이티즈", "더보이즈", "보이넥스트도어", "엔하이픈", "제로베이스원"]

다음 함수들을 구현해줘:

1. scrapeNOL(artists: string[]): Promise<ConcertEvent[]>
   - NOL 티켓 사이트에서 콘서트 예매 정보 스크래핑
   - URL: https://nol.yanolja.com/ticket/genre/concert
   - 현재는 목(mock) 데이터를 반환하도록 구현 (실제 스크래핑은 나중에)

2. scrapeMelon(artists: string[]): Promise<ConcertEvent[]>
   - 멜론 티켓 사이트에서 콘서트 예매 정보 스크래핑
   - URL: https://ticket.melon.com/concert/index.htm?genreType=GENRE_CON
   - 현재는 목(mock) 데이터를 반환하도록 구현

3. scrapeAllSources(artists: string[]): Promise<ScrapingResult>
   - 모든 소스에서 데이터를 수집하고 통합
   - 에러 핸들링 포함

주의사항:
- 각 함수는 async/await 사용
- try-catch로 에러 처리
- 현재 월의 데이터만 필터링
- ConcertEvent 타입 사용

목 데이터는 2-3개의 샘플 이벤트만 포함해줘.
```

---

## Task 5: 데이터 프로세서

### 프롬프트:
```
src/services/dataProcessor.ts 파일을 만들고, 스크래핑된 데이터를 처리하는 함수들을 구현해줘:

1. convertToCalendarEvents(concertEvents: ConcertEvent[]): CalendarEvent[]
   - ConcertEvent[]를 react-big-calendar에서 사용할 CalendarEvent[]로 변환
   - start, end 시간 설정 (예매 시작 시간부터 1시간)
   - 고유한 id 생성
   - 아티스트별로 다른 색상 할당 (선택적)

2. filterCurrentMonth(events: ConcertEvent[]): ConcertEvent[]
   - 현재 월의 이벤트만 필터링

3. sortEventsByDateTime(events: ConcertEvent[]): ConcertEvent[]
   - 날짜와 시간 순으로 정렬

4. removeDuplicates(events: ConcertEvent[]): ConcertEvent[]
   - 중복 이벤트 제거 (같은 아티스트, 날짜, 시간)

5. getArtistColor(artist: string): string
   - 아티스트 이름을 받아서 일관된 색상 코드 반환
   - Tailwind CSS 색상 팔레트 활용

모든 함수에 TypeScript 타입과 JSDoc 주석 추가.
```

---

## Task 6: 달력 그리드 컴포넌트

### 프롬프트:
```
src/components/Calendar/CalendarGrid.tsx 파일을 만들고, 커스텀 월간 달력 그리드를 구현해줘.

요구사항:
1. 레이아웃:
   - 7열 (일~토)
   - 4-5행 (월에 따라 가변)
   - CSS Grid 또는 Flexbox 사용

2. 스타일:
   - Tailwind CSS 사용
   - 심플하고 깔끔한 디자인
   - 반응형 (모바일/태블릿/데스크톱)

3. Props:
   interface CalendarGridProps {
     currentDate: Date;
     events: CalendarEvent[];
   }

4. 기능:
   - 현재 월의 모든 날짜 표시
   - 각 날짜에 해당하는 이벤트 표시
   - 오늘 날짜 하이라이트
   - 이전/다음 달의 날짜는 흐리게 표시

5. 월 숫자 표시:
   - 달력 중앙에 현재 월 숫자 (예: "2")
   - 큰 폰트 사이즈 (text-9xl 또는 그 이상)
   - 반투명 (opacity-10)
   - absolute positioning으로 배경에 배치

컴포넌트는 React + TypeScript로 작성하고, 가독성 좋은 코드로 작성해줘.
```

---

## Task 7: 달력 헤더 컴포넌트

### 프롬프트:
```
src/components/Calendar/CalendarHeader.tsx 컴포넌트를 만들어줘.

요구사항:
1. Props:
   interface CalendarHeaderProps {
     currentDate: Date;
     onPrevMonth?: () => void;  // 선택적 (향후 확장용)
     onNextMonth?: () => void;  // 선택적 (향후 확장용)
   }

2. 표시 내용:
   - 현재 년도와 월 (예: "2025년 2월")
   - 왼쪽: 이전 달 버튼 (비활성화 상태로, 향후 확장용)
   - 오른쪽: 다음 달 버튼 (비활성화 상태로, 향후 확장용)

3. 스타일:
   - Tailwind CSS 사용
   - 중앙 정렬
   - 간단하고 모던한 디자인
   - 모바일에서도 잘 보이도록

4. 요일 헤더:
   - 일, 월, 화, 수, 목, 금, 토를 표시하는 서브 컴포넌트 포함
   - 주말(일, 토)은 다른 색상으로 표시

React + TypeScript로 작성하고, 접근성(a11y)도 고려해줘.
```

---

## Task 8: 이벤트 아이템 컴포넌트

### 프롬프트:
```
src/components/Calendar/EventItem.tsx 컴포넌트를 만들어줘.

요구사항:
1. Props:
   interface EventItemProps {
     event: CalendarEvent;
     isCompact?: boolean;  // 작은 화면용
   }

2. 디자인:
   - Apple Calendar 스타일의 이벤트 UI
   - 직사각형 박스 형태
   - 둥근 모서리 (rounded-md)
   - 배경색은 아티스트별 색상 사용
   - 그라데이션 또는 단색 배경

3. 표시 내용:
   - 아티스트 이름 (볼드)
   - 예매 시간 (작은 폰트)
   - 출처 아이콘 또는 텍스트 (NOL/멜론)

4. 인터랙션:
   - 호버 시 약간 확대 (scale-105)
   - 클릭 시 예매 링크로 이동 (url이 있는 경우)
   - 부드러운 transition 효과

5. 반응형:
   - isCompact=true일 때 더 작은 사이즈와 폰트
   - 모바일에서는 자동으로 compact 모드

Tailwind CSS를 활용하고, 애니메이션은 framer-motion을 사용해도 좋아.
```

---

## Task 9: 개별 날짜 셀 컴포넌트

### 프롬프트:
```
src/components/Calendar/CalendarDay.tsx 컴포넌트를 만들어줘.

요구사항:
1. Props:
   interface CalendarDayProps {
     date: Date;
     events: CalendarEvent[];  // 해당 날짜의 이벤트들
     isCurrentMonth: boolean;
     isToday: boolean;
   }

2. 레이아웃:
   - 날짜 숫자를 셀 상단에 표시
   - 이벤트 목록을 날짜 아래에 세로로 스택
   - 이벤트가 많을 경우 스크롤 가능 또는 "+N개 더보기" 표시

3. 스타일:
   - isToday=true일 때 날짜 숫자를 원형 배경으로 하이라이트
   - isCurrentMonth=false일 때 흐리게 표시 (opacity-40)
   - 최소 높이 설정 (min-h-24 또는 min-h-32)
   - 테두리 또는 구분선

4. 이벤트 표시:
   - 각 이벤트는 EventItem 컴포넌트 사용
   - 최대 2-3개까지만 표시하고 나머지는 "+N" 형태로

5. 반응형:
   - 모바일: 이벤트를 1개만 표시하고 나머지는 숫자로
   - 데스크톱: 최대 3개까지 표시

React + TypeScript로 작성.
```

---

## Task 10: 메인 페이지 통합

### 프롬프트:
```
src/app/page.tsx (Next.js App Router 사용) 또는 src/pages/index.tsx (Pages Router 사용) 파일을 만들어줘.

요구사항:
1. 컴포넌트 구조:
   - CalendarHeader
   - CalendarGrid
   - 로딩 상태 표시
   - 에러 상태 표시

2. 데이터 페칭:
   - 컴포넌트 마운트 시 scrapeAllSources() 호출
   - React Query 또는 useState + useEffect 사용
   - 로딩 중일 때 스켈레톤 UI 또는 스피너 표시
   - 에러 발생 시 에러 메시지 표시

3. 상태 관리:
   - currentDate: Date (현재 보고 있는 월)
   - events: CalendarEvent[] (달력에 표시할 이벤트들)
   - isLoading: boolean
   - error: Error | null

4. 스타일:
   - 전체 페이지 레이아웃
   - 반응형 컨테이너 (max-w-7xl mx-auto)
   - 적절한 패딩과 마진

5. SEO:
   - <title>, <meta> 태그 설정
   - "CrazyMonth - 아이돌 콘서트 티켓 예매 달력"

React + TypeScript로 작성하고, 클린 코드 원칙을 따라줘.
```

---

## Task 11: 반응형 레이아웃 컴포넌트

### 프롬프트:
```
src/components/Layout/ResponsiveContainer.tsx 컴포넌트를 만들어줘.

요구사항:
1. Props:
   interface ResponsiveContainerProps {
     children: React.ReactNode;
   }

2. 기능:
   - 현재 화면 크기를 감지 (useMediaQuery 훅 사용 또는 직접 구현)
   - 자식 컴포넌트에 화면 크기 정보 전달 (Context API)

3. Breakpoints:
   - mobile: < 768px
   - tablet: 768px ~ 1024px
   - desktop: > 1024px

4. Context Provider:
   export const DeviceContext = React.createContext<{
     isMobile: boolean;
     isTablet: boolean;
     isDesktop: boolean;
   }>();

5. 스타일:
   - 기본 레이아웃 스타일 (패딩, 마진)
   - 반응형 컨테이너

커스텀 훅 useDevice()도 함께 export해줘.
```

---

## Task 12: 스타일 설정 및 테마

### 프롬프트:
```
Tailwind CSS 설정 파일(tailwind.config.js)을 수정하고, 
src/styles/globals.css 파일을 생성해서 전역 스타일을 설정해줘.

요구사항:
1. Tailwind 커스터마이징:
   - 컬러 팔레트 확장 (아티스트별 색상)
   - 폰트 설정 (한국어 지원 폰트)
   - 브레이크포인트 확정

2. 전역 스타일:
   - 기본 폰트, 배경색, 텍스트 색상
   - 스크롤바 스타일
   - 포커스 아웃라인 스타일

3. 컬러 팔레트 예시:
   - nct-green: #00FF00
   - seventeen-blue: #0084FF
   - bts-purple: #7F00FF
   - 등등 16개 아티스트별 색상

4. 다크 모드 준비:
   - 다크 모드 클래스 설정 (향후 확장용)

깔끔하고 일관성 있는 디자인 시스템을 만들어줘.
```

---

## Task 13: 웹 스크래핑 고도화 (선택적)

### 프롬프트:
```
실제 웹 스크래핑 기능을 구현하고 싶어. 
Puppeteer를 사용해서 NOL과 멜론 티켓 사이트를 스크래핑하는 함수를 만들어줘.

주의사항:
- 이 작업은 서버 사이드에서만 실행되어야 해
- Next.js API Routes 사용 (src/app/api/scrape/route.ts)
- rate limiting 적용
- 에러 핸들링 철저히

1. API Route 생성:
   - GET /api/scrape
   - 스크래핑 결과를 JSON으로 반환
   - 캐싱 (1시간 단위)

2. Puppeteer 스크래핑:
   - 페이지 로드 대기
   - HTML 파싱
   - 아티스트 이름 매칭 (정규식 또는 fuzzy matching)
   - 날짜/시간 추출

3. 데이터 검증:
   - 날짜 형식 검증
   - 필수 필드 확인
   - 중복 제거

코드에 주석을 충분히 달아서 유지보수하기 쉽게 만들어줘.
참고: robots.txt를 준수하고, 합리적인 요청 간격을 두어야 해.
```

---

## Task 14: 배포 준비

### 프롬프트:
```
Vercel에 배포하기 위한 설정을 해줘.

1. vercel.json 파일 생성:
   - 환경 변수 설정
   - 빌드 설정
   - 리다이렉트/리라이트 규칙

2. 환경 변수:
   - NEXT_PUBLIC_SITE_URL
   - 기타 필요한 환경 변수

3. README.md 작성:
   - 프로젝트 소개
   - 설치 방법
   - 실행 방법
   - 배포 방법
   - 사용된 기술 스택
   - 스크린샷 (placeholder)

4. .gitignore 확인:
   - node_modules
   - .env.local
   - .next
   - 기타

5. package.json 스크립트 정리:
   - dev, build, start, lint 명령어 확인

배포 가이드를 포함한 완전한 README를 만들어줘.
```

---

## Task 15: 테스트 및 최적화

### 프롬프트:
```
프로젝트의 성능과 품질을 개선하기 위한 작업을 해줘.

1. 성능 최적화:
   - React.memo() 적용
   - useMemo, useCallback 사용
   - 이미지 최적화 (Next.js Image 컴포넌트)
   - 코드 스플리팅
   - 레이지 로딩

2. 접근성 (a11y):
   - 시맨틱 HTML 사용
   - ARIA 레이블 추가
   - 키보드 네비게이션 지원
   - 색상 대비 확인

3. SEO:
   - Open Graph 태그
   - 구조화된 데이터 (JSON-LD)
   - sitemap.xml 생성

4. 에러 처리:
   - Error Boundary 구현
   - 404 페이지
   - 로딩/에러 상태 개선

5. 간단한 E2E 테스트:
   - Playwright 또는 Cypress 설정
   - 메인 페이지 로딩 테스트
   - 달력 렌더링 테스트

최적화 체크리스트를 만들어줘.
```

---

## 보너스 Task: 추가 기능

### 프롬프트:
```
다음 추가 기능 중 하나를 구현해줘:

Option A - 아티스트 필터:
- 체크박스로 특정 아티스트만 표시
- 필터 상태를 로컬 스토리지에 저장

Option B - 공유 기능:
- 현재 월의 일정을 이미지로 캡처 (html2canvas)
- 트위터/카카오톡 공유 버튼

Option C - 캘린더 내보내기:
- .ics 파일 생성 (ical.js 라이브러리)
- 사용자가 자신의 캘린더 앱에 import 가능

Option D - 알림 설정:
- 예매 시작 전 브라우저 알림 (Notification API)
- 푸시 알림은 나중에 (서비스 워커 필요)

가장 구현하기 쉽고 사용자에게 유용한 기능을 추천해주고 구현해줘.
```

---

## 프롬프트 사용 가이드

### 순차적 진행 방법:
1. **Task 1-3**: 프로젝트 기초 설정
2. **Task 4-5**: 데이터 레이어
3. **Task 6-9**: UI 컴포넌트
4. **Task 10-12**: 통합 및 스타일링
5. **Task 13**: 실제 스크래핑 (선택)
6. **Task 14-15**: 배포 및 최적화

### 팁:
- 각 Task를 완료한 후 테스트해보세요
- 에러가 발생하면 관련 부분만 수정 요청하세요
- 필요에 따라 Task를 건너뛰거나 순서를 조정해도 됩니다
- 코드 리뷰를 요청하면 개선점을 제안받을 수 있습니다

### 예시 대화:
```
사용자: "Task 1의 프롬프트로 프로젝트를 만들어줘"
AI: [프로젝트 구조 생성]

사용자: "잘 됐어! 이제 Task 6을 진행해줘. 단, 월 숫자를 더 크게 만들고 싶어"
AI: [CalendarGrid 컴포넌트 생성, 요구사항 반영]
```

---

**문서 버전**: 1.0  
**마지막 업데이트**: 2025-02-14
