import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CrazyMonth - 아이돌 콘서트 티켓 예매 달력',
  description: '인기 아이돌 그룹의 콘서트 티켓 예매 일정을 한눈에 확인할 수 있는 웹 서비스',
  keywords: ['아이돌', '콘서트', '티켓', '예매', '달력', 'K-pop'],
  openGraph: {
    title: 'CrazyMonth - 아이돌 콘서트 티켓 예매 달력',
    description: '인기 아이돌 그룹의 콘서트 티켓 예매 일정을 한눈에 확인할 수 있는 웹 서비스',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
