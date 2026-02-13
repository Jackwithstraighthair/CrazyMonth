# 배포 가이드

CrazyMonth 웹사이트를 호스팅 서버에 배포하는 방법입니다.

## 배포 전 준비사항

1. Node.js 18 이상 설치 확인
2. npm 또는 yarn 설치 확인

## 배포 방법

### 방법 1: Vercel 배포 (가장 간단)

1. [Vercel](https://vercel.com) 계정 생성
2. GitHub에 코드 푸시 (선택사항)
3. Vercel 대시보드에서 "New Project" 클릭
4. 코드 저장소 연결 또는 직접 업로드
5. 자동으로 빌드 및 배포 완료

### 방법 2: 일반 Node.js 호스팅

1. 서버에 프로젝트 파일 업로드
2. SSH로 서버 접속
3. 다음 명령어 실행:

```bash
cd /path/to/crazymonth
npm install
npm run build
npm start
```

4. PM2를 사용한 프로세스 관리 (권장):

```bash
npm install -g pm2
pm2 start npm --name "crazymonth" -- start
pm2 save
pm2 startup
```

### 방법 3: 정적 파일 배포

Next.js를 정적 파일로 내보내려면:

1. `next.config.js` 수정:

```javascript
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
}
```

2. 빌드:

```bash
npm run build
```

3. `out` 폴더의 내용을 웹 서버에 업로드

### 방법 4: Docker 배포

1. Dockerfile 생성 (프로젝트 루트에):

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

2. Docker 이미지 빌드 및 실행:

```bash
docker build -t crazymonth .
docker run -p 3000:3000 crazymonth
```

## 환경 변수 설정

현재는 환경 변수가 필요하지 않습니다. 향후 실제 스크래핑 기능 추가 시:

- `.env.local` 파일 생성 (로컬 개발용)
- 호스팅 플랫폼의 환경 변수 설정 메뉴 사용

## 도메인 연결

1. 호스팅 플랫폼의 도메인 설정 메뉴로 이동
2. 도메인 추가 및 DNS 설정
3. SSL 인증서 자동 발급 (대부분의 플랫폼에서 자동)

## 트러블슈팅

### 빌드 에러

- Node.js 버전 확인 (18 이상 필요)
- `npm install` 재실행
- `node_modules` 삭제 후 재설치

### 런타임 에러

- 환경 변수 확인
- 포트 번호 확인 (기본: 3000)
- 로그 확인

### 성능 최적화

- CDN 사용 권장
- 이미지 최적화
- 코드 스플리팅 확인

## 모니터링

배포 후 다음을 확인하세요:

- [ ] 홈페이지 로딩 확인
- [ ] 달력 렌더링 확인
- [ ] 모바일 반응형 확인
- [ ] 이벤트 데이터 표시 확인

## 업데이트 방법

코드 변경 후:

1. 변경사항 커밋 및 푸시
2. Vercel: 자동 재배포
3. 일반 호스팅: 서버에서 `git pull` 후 `npm run build` 및 재시작
