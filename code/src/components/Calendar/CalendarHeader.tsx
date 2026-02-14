'use client';

type CalendarHeaderProps = {
  year: number;
  month: number;
};

const MONTH_NAMES = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

export default function CalendarHeader({ year, month }: CalendarHeaderProps) {
  return (
    <header className="text-center mb-4 md:mb-6" role="banner">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
        {year}년 {MONTH_NAMES[month - 1]}
      </h1>
      <p className="text-sm text-gray-500 mt-1">티켓 예매 오픈 일정</p>
    </header>
  );
}
