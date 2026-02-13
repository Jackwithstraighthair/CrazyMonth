# Product Requirements Document (PRD) - v2.0
## CrazyMonth - 아이돌 콘서트 티켓 예매 오픈 달력

---

## 📌 문서 업데이트 이력
- **v2.0 (2025-02-14)**: 핵심 기능 수정 - 콘서트 날짜가 아닌 **티켓 예매 오픈 날짜**를 표시
- **v1.0 (2025-02-14)**: 초안 작성

---

## 1. Product Overview

### 1.1 Product Name
**CrazyMonth**

### 1.2 Product Vision
인기 아이돌 그룹의 **콘서트 티켓 예매 오픈(판매 시작) 일정**을 하나의 통합 달력에서 한눈에 확인할 수 있는 웹 서비스

### 1.3 핵심 가치 제안
> "언제 티켓팅을 해야 하는지" - 콘서트가 언제 열리는지가 아니라, **티켓이 언제 판매 시작되는지**를 알려줍니다.

### 1.4 Target Users
- **Primary Users**: 아이돌 콘서트 팬, 티켓팅을 준비하는 사용자
- **Pain Point**: 여러 티켓 사이트에서 예매 오픈 일정을 일일이 확인해야 하는 번거로움
- **Solution**: 한 곳에서 모든 예매 오픈 일정을 통합 관리

---

## 2. Core Features

### 2.1 Data Collection (Web Scraping) - **핵심 수정사항**

**⚠️ 중요: 수집 대상은 "콘서트 날짜"가 아닌 "티켓 예매 오픈 날짜"입니다**

#### 2.1.1 멜론 티켓 스크래핑

**Target URL**: 
```
https://ticket.melon.com/csoon/index.htm#orderType=0&pageIndex=1&schGcode=GENRE_ALL&schText=&schDt=
```

**접근 경로**:
- 멜론 티켓 홈페이지 → **"티켓 오픈"** 코너

**수집 데이터**:
- 아티스트 이름
- **티켓 예매 시작 날짜** (Ticket Sale Opening Date)
- **티켓 예매 시작 시간** (Ticket Sale Opening Time)
- 콘서트 제목 (optional)
- 예매 페이지 링크 (optional)

#### 2.1.2 인터파크 NOL 스크래핑

**Target URL**:
```
https://tickets.interpark.com/contents/notice
```

**접근 경로**:
- 인터파크 티켓 → **"공지사항"** 페이지

**수집 전략**:
1. 공지사항 리스트에서 **대상 아티스트 이름이 포함된 게시글** 검색
2. 각 공지사항 내용에서 **티켓 오픈 일시** 텍스트 파싱
3. 날짜/시간 정보 추출 및 정규화

#### 2.1.3 Target Artists (16개 그룹)
```
엔시티드림, 엔시티위시, 라이즈, 세븐틴, 임영웅, 엑소, 방탄소년단, 워너원, 
데이식스, 투바투, 스트레이키즈, 에이티즈, 더보이즈, 보이넥스트도어, 
엔하이픈, 제로베이스원
```

#### 2.1.4 Collected Data Fields

**핵심 데이터 구조**:
```typescript
interface TicketSaleEvent {
  artist: string;              // 아티스트 이름
  saleOpenDate: string;        // 예매 오픈 날짜 (ISO 8601: YYYY-MM-DD)
  saleOpenTime: string;        // 예매 오픈 시간 (24시간제: HH:MM)
  concertTitle?: string;       // 콘서트 제목 (optional)
  source: 'melon' | 'interpark'; // 출처
  noticeUrl?: string;          // 공지/상세 페이지 링크
  concertDate?: string;        // 실제 공연 날짜 (수집하되 표시 안 함)
}
```

#### 2.1.5 Collection Scope
- **시간 범위**: 현재 날짜가 속한 월(month)의 예매 오픈 일정만 수집
- **업데이트 주기**: 매일 1-2회 자동 업데이트

---

### 2.2 Calendar Display

**핵심 원칙**: 달력에 표시되는 모든 이벤트는 **티켓 예매 오픈 날짜**입니다.

#### 2.2.1 Calendar Structure
- 표준 월간 달력 레이아웃
- 열(Columns): 일, 월, 화, 수, 목, 금, 토 (7일)
- 행(Rows): 4-5주 (월에 따라 가변)
- 1일부터 말일까지 표시

#### 2.2.2 Design Specifications

**1. Overall Style**:
- 심플하고 미니멀한 디자인 (현재 디자인 유지)
- Apple Calendar 스타일 참고

**2. Month Indicator**:
- 달력 중앙에 해당 월 숫자 표시 (예: "2")
- 큰 폰트 사이즈
- 반투명 처리 (opacity: 0.05-0.1)

**3. Event Display** (티켓 오픈 일정):
- 직사각형 박스 형태
- 하이라이트된 배경색
- Apple Calendar의 이벤트 UI와 유사

**각 이벤트 카드에 표시할 정보**:
- 아티스트 이름 (가장 크게, 볼드)
- 예매 오픈 시간 (중간 크기)
- 출처 (작게, 배지 형태)

**4. Color Coding**:
- 아티스트별 색상 + 출처 배지

---

### 2.3 Responsive Design

**현재 디자인이 좋다고 하셨으므로 기존 디자인 패턴 유지**

#### Breakpoints (유지):
1. **Mobile** (< 768px)
2. **Tablet** (768px - 1024px)
3. **Desktop** (> 1024px)

---

## 3. Technical Architecture

### 3.1 Recommended Tech Stack (유지)

**Frontend**:
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Calendar**: 커스텀 구현 (현재 디자인 기반)

**Backend**:
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Scraping**: Puppeteer (동적 페이지 처리)
- **Text Parsing**: 정규식 + cheerio

---

## 4. User Stories (업데이트)

### 4.1 Core User Story
**As a** K-pop 팬,  
**I want to** 이번 달 내가 좋아하는 아이돌의 **티켓 예매 오픈 날짜와 시간**을 한눈에 보고 싶다  
**So that** 예매 시작 시간을 놓치지 않고 정확히 그 시간에 티켓팅을 할 수 있다

---

## 5. Acceptance Criteria (업데이트)

### 5.1 Must Have (MVP)
- [ ] 멜론 티켓 "티켓 오픈" 페이지에서 16개 아티스트의 **예매 오픈 정보** 수집
- [ ] 인터파크 공지사항에서 16개 아티스트의 **예매 오픈 정보** 수집
- [ ] 현재 월의 **티켓 예매 오픈 일정**만 달력에 표시
- [ ] 각 일정에 아티스트명, **예매 오픈 날짜**, **예매 오픈 시간** 표시
- [ ] 모바일/태블릿/데스크톱 반응형 지원 (현재 디자인 유지)
- [ ] Apple Calendar 스타일의 심플한 UI (현재 디자인 유지)

### 5.2 Must NOT Have (명확한 제외 사항)
- [ ] ❌ 콘서트 공연 날짜는 **수집하지 않음** (또는 수집하되 표시하지 않음)
- [ ] ❌ 콘서트 장소는 표시하지 않음
- [ ] ❌ 티켓 가격 정보는 표시하지 않음

---

## 6. Constraints & Considerations

### 6.1 Legal & Ethical
- **저작권**: 티켓 사이트의 robots.txt 및 이용약관 준수
- **스크래핑 빈도**: 서버 부하를 최소화하기 위해 적절한 간격 설정

### 6.2 Technical Challenges
- **동적 콘텐츠**: JavaScript로 렌더링되는 페이지 스크래핑 (Puppeteer 필요)
- **텍스트 파싱**: 공지사항의 자유 텍스트에서 날짜/시간 추출
- **아티스트 이름 매칭**: 다양한 표기법 처리 (예: "NCT DREAM" vs "엔시티드림")

---

## 7. Success Metrics (업데이트)

### 7.1 Technical Metrics
- **스크래핑 정확도**: 95% 이상
- **데이터 신선도**: 12시간 이내 업데이트
- **페이지 로딩 시간**: 2초 이하

---

## 8. Timeline & Milestones

### Phase 1: 핵심 스크래핑 개발 (1주)
- [ ] 멜론 티켓 "티켓 오픈" 페이지 스크래핑 구현
- [ ] 인터파크 공지사항 파싱 로직 구현
- [ ] 아티스트 매칭 시스템 구현
- [ ] 날짜/시간 파싱 및 정규화

### Phase 2: UI 통합 (3-4일)
- [ ] 기존 달력 컴포넌트에 티켓 오픈 데이터 연동
- [ ] 이벤트 카드 UI 업데이트 ("예매 오픈" 명시)

### Phase 3: 테스트 및 배포 (2-3일)
- [ ] 스크래핑 정확도 테스트
- [ ] 배포 및 모니터링

---

## 9. Future Enhancements

1. **더 많은 소스 추가**: 예스24 티켓, 티켓링크 등
2. **AI 기반 파싱**: GPT API로 공지사항 내용 이해
3. **실시간 알림**: 웹 푸시 알림, 카카오톡 알림톡
4. **사용자 맞춤화**: 관심 아티스트 선택, 알림 시간 설정

---

## 10. Appendix

### 10.1 Updated Reference Links
- ✅ 멜론 티켓 오픈: https://ticket.melon.com/csoon/index.htm
- ✅ 인터파크 공지사항: https://tickets.interpark.com/contents/notice

### 10.2 Sample Data
```json
{
  "events": [
    {
      "artist": "세븐틴",
      "saleOpenDate": "2025-02-20",
      "saleOpenTime": "20:00",
      "concertTitle": "SEVENTEEN WORLD TOUR FOLLOW AGAIN SEOUL",
      "source": "melon",
      "noticeUrl": "https://ticket.melon.com/performance/index.htm?prodId=209999"
    }
  ]
}
```

---

**Document Version**: 2.0  
**Last Updated**: 2025-02-14  
**Status**: Production-Ready  
**Key Update**: 핵심 기능을 티켓 예매 오픈 일정으로 수정
