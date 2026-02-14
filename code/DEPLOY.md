# Vercel 배포 가이드

## 방법 1: code 폴더만 배포 (권장)

1. `code` 폴더 내용을 **새 저장소**로 푸시합니다.
2. [Vercel](https://vercel.com) → New Project → 해당 저장소 Import.
3. Root Directory는 비워 둡니다. (저장소 루트가 곧 Next.js 프로젝트)
4. Deploy 클릭.

## 방법 2: CrazyMonth 전체 저장소 배포

1. Vercel에서 CrazyMonth 저장소를 Import.
2. **Root Directory**에 `code` 입력.
3. Deploy.

## 배포 후 확인

- 사이트 URL 접속 시 달력이 보여야 합니다.
- `/api/scrape` 호출 시 JSON으로 현재 월 예매 일정이 반환됩니다.
- 멜론/인터파크가 JS 렌더링이면 스크래핑 결과가 비어 있을 수 있으며, 이 경우에도 에러 없이 빈 달력으로 표시됩니다.

## 문제 해결

- **빌드 실패**: `code` 폴더에서 `npm install && npm run build` 로컬 실행 후 에러 메시지 확인.
- **API 타임아웃**: Vercel 무료 플랜에서 함수 최대 30초까지 설정되어 있음 (`vercel.json`).
