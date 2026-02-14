# Product Requirements Document (PRD)
## CrazyMonth - 아이돌 콘서트 티켓 예매 오픈 달력

---

## 1. Product Overview

### 1.1 Product Name
**CrazyMonth**

### 1.2 Product Vision
인기 아이돌 그룹의 콘서트 티켓 예매 오픈 일정을 하나의 통합 달력에서 한눈에 확인할 수 있는 웹 서비스

### 1.3 핵심 가치
사용자가 "언제 티켓팅을 해야 하는지"를 한눈에 파악할 수 있도록, 여러 티켓 사이트의 예매 시작 날짜와 시간을 통합하여 보여줍니다.

### 1.4 Target Users
- 아이돌 콘서트 팬
- 티켓팅을 준비하는 사용자
- 여러 아티스트를 팔로우하는 멀티 팬

---

## 2. Core Features

### 2.1 데이터 수집 (Web Scraping)

#### 2.1.1 수집 대상 웹사이트

**1. 멜론 티켓 - 티켓 오픈 코너**
- URL: `https://ticket.melon.com/csoon/index.htm#orderType=0&pageIndex=1&schGcode=GENRE_ALL&schText=&schDt=`
- 수집 내용: 티켓 예매 오픈 날짜, 시간, 아티스트명

**2. 인터파크 티켓 - 공지사항**
- URL: `https://tickets.interpark.com/contents/notice`
- 수집 방법: 공지사항 게시글에서 예매 오픈 정보 파싱

#### 2.1.2 대상 아티스트 (16개 그룹)
```
엔시티드림, 엔시티위시, 라이즈, 세븐틴, 임영웅, 엑소, 방탄소년단, 워너원, 
데이식스, 투바투, 스트레이키즈, 에이티즈, 더보이즈, 보이넥스트도어, 
엔하이픈, 제로베이스원
```

#### 2.1.3 수집 데이터 구조

```typescript
interface TicketSaleEvent {
  artist: string;              // 아티스트 이름
  saleOpenDate: string;        // 예매 오픈 날짜 (YYYY-MM-DD)
  saleOpenTime: string;        // 예매 오픈 시간 (HH:MM, 24시간제)
  concertTitle?: string;       // 콘서트 제목 (선택)
  source: 'melon' | 'interpark'; // 출처
  noticeUrl?: string;          // 공지/상세 페이지 링크 (선택)
}
```

#### 2.1.4 수집 범위
- 현재 날짜가 속한 월의 예매 오픈 일정만 수집
- 이미 지난 예매 오픈은 제외
- 업데이트 주기: 매일 1-2회

#### 2.1.5 데이터 수집 로직

**멜론 티켓 스크래핑**:
1. 티켓 오픈 페이지 접속
2. 대상 아티스트 이름이 포함된 공연 필터링
3. 각 공연의 예매 오픈 날짜/시간 추출

**인터파크 공지사항 파싱**:
1. 공지사항 리스트에서 대상 아티스트 이름이 포함된 게시글 검색
2. 각 게시글 내용에서 예매 오픈 날짜/시간 텍스트 파싱
3. 정규식을 활용한 날짜/시간 추출 및 정규화

**날짜/시간 파싱 패턴**:
- "2025년 2월 20일 오후 8시 예매 시작"
- "티켓 오픈: 2/20 (목) 20:00"
- "예매 개시: 2025.02.20 20:00"

**아티스트 이름 매칭**:
- 한글/영문 표기 처리 (예: "세븐틴" / "SEVENTEEN")
- 띄어쓰기 변형 처리 (예: "엔시티드림" / "엔시티 드림")
- 약칭 처리 (예: "NCT DREAM")

---

### 2.2 달력 UI

#### 2.2.1 레이아웃
- 표준 월간 달력 형태
- 7열: 일, 월, 화, 수, 목, 금, 토
- 4-5행 (월에 따라 가변)

#### 2.2.2 디자인 스타일
- 심플하고 미니멀한 디자인
- Apple Calendar 스타일 참고
- 깔끔한 타이포그래피

#### 2.2.3 월(Month) 표시
- 달력 중앙 배경에 해당 월 숫자 표시 (예: "2")
- 매우 큰 폰트 사이즈
- 반투명 처리 (opacity: 0.05-0.1)
- absolute 포지셔닝으로 배경 레이어에 배치
- 다른 요소들과 겹쳐도 가독성 유지

#### 2.2.4 이벤트 표시

**이벤트 카드 디자인**:
- 직사각형 박스 형태
- 둥근 모서리 (rounded)
- 하이라이트된 배경색
- 그림자 효과

**표시 정보**:
```
┌─────────────────────────┐
│ 세븐틴                   │  ← 아티스트 이름 (볼드, 큰 폰트)
│ ⏰ 20:00                │  ← 예매 오픈 시간
│ 📍 멜론티켓              │  ← 출처 (작은 폰트)
└─────────────────────────┘
```

**정보 우선순위**:
1. 아티스트 이름 (가장 눈에 띄게)
2. 예매 오픈 시간
3. 출처

**같은 날 여러 이벤트**:
- 세로로 스택 배치
- 시간 순으로 정렬
- 공간 부족 시 "+N개" 형태로 축약

**색상 구분**:
- 아티스트별로 다른 색상 배경
- 또는 출처별 색상 구분 (멜론/인터파크)

---

### 2.3 반응형 디자인

#### Mobile (< 768px)
- 컴팩트한 월간 뷰
- 터치 최적화
- 이벤트 카드: 아티스트명 + 시간만 표시

#### Tablet (768px - 1024px)
- 전체 월간 뷰
- 적절한 여백
- 이벤트 카드: 전체 정보 표시

#### Desktop (> 1024px)
- 넓은 레이아웃
- 호버 효과 활용
- 이벤트 카드: 전체 정보 + 추가 세부사항

---

## 3. Technical Specifications

### 3.1 기술 스택

**Frontend**:
- React + TypeScript
- Tailwind CSS
- 커스텀 달력 컴포넌트

**Backend**:
- Next.js (App Router)
- Node.js
- Puppeteer (웹 스크래핑)

**배포**:
- Vercel

### 3.2 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 메인 페이지
│   └── api/
│       └── scrape/
│           └── route.ts            # 스크래핑 API
├── components/
│   ├── Calendar/
│   │   ├── CalendarGrid.tsx        # 달력 그리드
│   │   ├── CalendarHeader.tsx      # 헤더 (년/월)
│   │   ├── CalendarDay.tsx         # 날짜 셀
│   │   └── EventCard.tsx           # 이벤트 카드
│   └── Layout/
│       └── Container.tsx
├── services/
│   ├── scrapers/
│   │   ├── melon.ts                # 멜론 스크래퍼
│   │   ├── interpark.ts            # 인터파크 스크래퍼
│   │   └── matcher.ts              # 아티스트 매칭
│   └── parser.ts                   # 날짜/시간 파싱
├── types/
│   └── event.ts                    # 타입 정의
└── utils/
    └── date.ts                     # 날짜 유틸리티
```

### 3.3 데이터 플로우

```
[멜론 티켓 오픈] ──┐
                   ├──> [스크래핑] ──> [파싱] ──> [필터링] ──> [API] ──> [달력 UI]
[인터파크 공지] ───┘
```

---

## 4. 상세 기능 명세

### 4.1 스크래핑 로직

#### 멜론 티켓 스크래핑
```typescript
async function scrapeMelon(artists: string[]): Promise<TicketSaleEvent[]> {
  // 1. 티켓 오픈 페이지 접속
  // 2. 공연 리스트 로드 대기
  // 3. 각 공연에서 아티스트명, 날짜, 시간 추출
  // 4. 대상 아티스트 필터링
  // 5. 데이터 정규화
}
```

#### 인터파크 공지사항 파싱
```typescript
async function scrapeInterpark(artists: string[]): Promise<TicketSaleEvent[]> {
  // 1. 공지사항 리스트 접속
  // 2. 대상 아티스트가 포함된 제목 검색
  // 3. 각 공지사항 상세 내용 접근
  // 4. 정규식으로 날짜/시간 추출
  // 5. 데이터 정규화
}
```

### 4.2 날짜/시간 파싱

**정규식 패턴**:
```typescript
const patterns = {
  date: [
    /(\d{4})[년.\-/](\d{1,2})[월.\-/](\d{1,2})/,
    /(\d{1,2})[월/](\d{1,2})[일]/,
  ],
  time: [
    /(\d{1,2}):(\d{2})/,
    /(오전|오후)\s*(\d{1,2})시/,
  ]
};
```

**정규화**:
- 모든 날짜를 "YYYY-MM-DD" 형식으로 통일
- 모든 시간을 24시간제 "HH:MM" 형식으로 통일

### 4.3 아티스트 매칭

```typescript
const artistAliases = {
  '세븐틴': ['세븐틴', 'SEVENTEEN', '17'],
  '엔시티드림': ['엔시티드림', '엔시티 드림', 'NCT DREAM', 'NCTDREAM'],
  // ... 나머지 아티스트
};

function matchArtist(text: string): string | null {
  for (const [canonical, aliases] of Object.entries(artistAliases)) {
    if (aliases.some(alias => text.includes(alias))) {
      return canonical;
    }
  }
  return null;
}
```

### 4.4 데이터 검증

```typescript
function validateEvent(event: TicketSaleEvent): boolean {
  // 1. 필수 필드 존재 확인
  // 2. 날짜 형식 검증
  // 3. 시간 형식 검증
  // 4. 과거 날짜 제외
  // 5. 현재 월 범위 확인
}
```

---

## 5. API 설계

### 5.1 엔드포인트

**GET /api/scrape**

**Query Parameters**:
- `month`: YYYY-MM (선택, 기본값: 현재 월)

**Response**:
```json
{
  "data": [
    {
      "artist": "세븐틴",
      "saleOpenDate": "2025-02-20",
      "saleOpenTime": "20:00",
      "concertTitle": "SEVENTEEN WORLD TOUR",
      "source": "melon",
      "noticeUrl": "https://..."
    }
  ],
  "metadata": {
    "month": "2025-02",
    "lastUpdated": "2025-02-14T10:30:00Z",
    "totalEvents": 12
  }
}
```

---

## 6. UI/UX 요구사항

### 6.1 필수 기능
- 현재 월의 티켓 예매 오픈 일정 표시
- 아티스트명, 날짜, 시간 명확히 표시
- 모바일/태블릿/데스크톱 반응형 지원
- 로딩 상태 표시
- 에러 상태 처리

### 6.2 사용자 인터랙션
- 이벤트 카드 클릭 시 예매 페이지로 이동 (링크 있는 경우)
- 호버 시 추가 정보 표시 (데스크톱)
- 부드러운 애니메이션

### 6.3 접근성
- 시맨틱 HTML
- 키보드 네비게이션 지원
- 색상 대비 확보
- ARIA 레이블

---

## 7. 제약사항 및 고려사항

### 7.1 법적/윤리적 고려
- 티켓 사이트의 robots.txt 준수
- 적절한 스크래핑 간격 설정 (서버 부하 최소화)
- 공개 정보만 활용

### 7.2 기술적 도전과제
- JavaScript로 렌더링되는 동적 페이지 스크래핑
- 사이트 구조 변경 시 대응
- 다양한 날짜/시간 형식 파싱
- 아티스트 이름 변형 처리

### 7.3 성능 요구사항
- 페이지 로딩: 2초 이하
- 스크래핑 시간: 30초 이내
- 모바일 반응성: 60fps 유지

---

## 8. 성공 지표

### 8.1 기술 지표
- 데이터 수집 정확도: 95% 이상
- 스크래핑 성공률: 90% 이상
- API 응답 시간: 1초 이하

### 8.2 사용자 경험
- 정확한 예매 오픈 정보 제공
- 직관적인 UI/UX
- 빠른 로딩 속도

---

## 9. 개발 일정

### Week 1: 스크래핑 개발
- 멜론 티켓 스크래퍼 구현
- 인터파크 공지사항 파서 구현
- 날짜/시간 파싱 로직
- 아티스트 매칭 시스템

### Week 2: UI 개발
- 달력 컴포넌트 구현
- 이벤트 카드 디자인
- 반응형 레이아웃

### Week 3: 통합 및 최적화
- API 연동
- 데이터 검증
- 에러 처리
- 성능 최적화

### Week 4: 테스트 및 배포
- 스크래핑 정확도 테스트
- UI/UX 테스트
- 배포

---

## 10. 향후 확장 가능성

### 10.1 추가 기능
- 이전/다음 달 네비게이션
- 특정 아티스트 필터링
- 알림 기능
- iCal 내보내기

### 10.2 추가 데이터 소스
- 예스24 티켓
- 티켓링크
- 위버스

---

## Appendix

### A. 참조 링크
- 멜론 티켓 오픈: https://ticket.melon.com/csoon/index.htm
- 인터파크 공지사항: https://tickets.interpark.com/contents/notice

### B. 디자인 참고
- Apple Calendar
- Google Calendar
- Notion Calendar

---

**문서 버전**: 1.0  
**작성일**: 2025-02-14  
**상태**: Production Ready
