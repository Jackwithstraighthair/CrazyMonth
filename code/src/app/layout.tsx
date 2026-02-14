import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrazyMonth - 아이돌 콘서트 티켓 예매 오픈 달력',
  description: '인기 아이돌 그룹의 콘서트 티켓 예매 오픈 일정을 한눈에 확인하세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
