# CrazyMonth

아이돌 콘서트 티켓 예매 오픈 일정을 한눈에 보는 달력 웹 앱입니다.

## 기술 스택

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS
- Vercel 배포

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속하세요.

## Vercel 배포

1. GitHub 등에 이 저장소를 푸시한 뒤, [Vercel](https://vercel.com)에서 해당 저장소를 임포트합니다.
2. **Root Directory**를 `code`로 설정한 뒤 배포하세요. (프로젝트 루트가 `CrazyMonth`이고 코드가 `code` 폴더에 있는 경우)
3. 또는 `code` 폴더 내용만 별도 저장소로 푸시한 뒤, Root Directory 없이 그 저장소를 배포해도 됩니다.

배포 후 사이트가 동작하며, `/api/scrape`가 멜론/인터파크 페이지를 fetch하여 현재 월 예매 오픈 일정을 수집합니다. (동적 렌더링 사이트는 HTML만으로는 데이터가 없을 수 있어, 그 경우 달력은 빈 상태로 보이고 에러 없이 동작합니다.)
