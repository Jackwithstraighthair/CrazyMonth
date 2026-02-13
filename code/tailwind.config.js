/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 아티스트별 색상 팔레트
        'nct-green': '#00FF00',
        'nct-wish-blue': '#00BFFF',
        'riize-orange': '#FF6B35',
        'seventeen-blue': '#0084FF',
        'lim-purple': '#9B59B6',
        'exo-red': '#E74C3C',
        'bts-purple': '#7F00FF',
        'wannaone-pink': '#FF69B4',
        'day6-yellow': '#FFD700',
        'txt-blue': '#4169E1',
        'straykids-red': '#DC143C',
        'ateez-black': '#1C1C1C',
        'theboys-pink': '#FF1493',
        'boynextdoor-green': '#32CD32',
        'enhypen-blue': '#1E90FF',
        'zerobaseone-gold': '#FFD700',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
