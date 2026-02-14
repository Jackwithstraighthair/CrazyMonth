/**
 * PRD 2.1.2 대상 아티스트 16개 + 별칭 매칭
 */
export const ARTIST_ALIASES: Record<string, string[]> = {
  엔시티드림: ['엔시티드림', '엔시티 드림', 'NCT DREAM', 'NCTDREAM', 'nct dream'],
  엔시티위시: ['엔시티위시', '엔시티 위시', 'NCT WISH', 'NCTWISH', 'nct wish'],
  라이즈: ['라이즈', 'RIIZE', 'riize'],
  세븐틴: ['세븐틴', 'SEVENTEEN', '17', 'seventeen'],
  임영웅: ['임영웅', '영웅'],
  엑소: ['엑소', 'EXO', 'exo'],
  방탄소년단: ['방탄소년단', 'BTS', 'bts', '방탄'],
  워너원: ['워너원', 'Wanna One', 'WANNA ONE', 'wanna one'],
  데이식스: ['데이식스', 'DAY6', 'day6'],
  투바투: ['투바투', 'TXT', 'TOMORROW X TOGETHER', 'txt'],
  스트레이키즈: ['스트레이키즈', '스트레이 키즈', 'Stray Kids', 'SKZ', 'stray kids'],
  에이티즈: ['에이티즈', 'ATEEZ', 'ateez'],
  더보이즈: ['더보이즈', '더 보이즈', 'The Boyz', 'THE BOYZ', 'the boyz'],
  보이넥스트도어: ['보이넥스트도어', '보이넥스트 도어', 'BOYNEXTDOOR', 'boy next door'],
  엔하이픈: ['엔하이픈', 'ENHYPEN', 'enhypen', '엔하이픈'],
  제로베이스원: ['제로베이스원', '제로베이스 원', 'ZEROBASEONE', 'ZB1', 'zerobaseone'],
};

const CANONICAL_LIST = Object.keys(ARTIST_ALIASES);

export function matchArtist(text: string): string | null {
  if (!text || typeof text !== 'string') return null;
  const normalized = text.trim();
  for (const canonical of CANONICAL_LIST) {
    const aliases = ARTIST_ALIASES[canonical];
    if (aliases.some((alias) => normalized.includes(alias))) {
      return canonical;
    }
  }
  return null;
}

export function getTargetArtists(): string[] {
  return [...CANONICAL_LIST];
}
