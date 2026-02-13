/**
 * 아티스트 이름 매칭 유틸리티
 * 다양한 표기법(한글/영문, 띄어쓰기, 약칭)을 처리하여 정규화된 아티스트 이름으로 매칭
 */

/**
 * 대상 아티스트 리스트 (정규화된 이름)
 */
export const TARGET_ARTISTS = [
  '엔시티드림',
  '엔시티위시',
  '라이즈',
  '세븐틴',
  '임영웅',
  '엑소',
  '방탄소년단',
  '워너원',
  '데이식스',
  '투바투',
  '스트레이키즈',
  '에이티즈',
  '더보이즈',
  '보이넥스트도어',
  '엔하이픈',
  '제로베이스원',
] as const;

/**
 * 아티스트별 별칭 매핑 테이블
 */
const ARTIST_ALIASES: Record<string, string[]> = {
  '엔시티드림': ['엔시티드림', '엔시티 드림', 'NCT DREAM', 'NCT-DREAM', 'NCTDREAM', '엔시티', 'NCT'],
  '엔시티위시': ['엔시티위시', '엔시티 위시', 'NCT WISH', 'NCT-WISH', 'NCTWISH'],
  '라이즈': ['라이즈', 'RIIZE', '리즈'],
  '세븐틴': ['세븐틴', 'SEVENTEEN', '17', '세븐', '세븐틴'],
  '임영웅': ['임영웅', '임영웅'],
  '엑소': ['엑소', 'EXO', '엑소'],
  '방탄소년단': ['방탄소년단', 'BTS', '방탄', 'BTS', 'Bangtan'],
  '워너원': ['워너원', 'Wanna One', 'WANNA ONE', '워너원'],
  '데이식스': ['데이식스', 'DAY6', 'DAY 6', '데이식스'],
  '투바투': ['투바투', 'TXT', 'TOMORROW X TOGETHER', '투모로우바이투게더'],
  '스트레이키즈': ['스트레이키즈', 'Stray Kids', 'STRAY KIDS', '스트레이', 'SKZ'],
  '에이티즈': ['에이티즈', 'ATEEZ', '에이티즈'],
  '더보이즈': ['더보이즈', 'THE BOYZ', '더보이즈', '더보이즈'],
  '보이넥스트도어': ['보이넥스트도어', 'BOYNEXTDOOR', 'BOY NEXT DOOR', '보이넥스트도어'],
  '엔하이픈': ['엔하이픈', 'ENHYPEN', '엔하이픈'],
  '제로베이스원': ['제로베이스원', 'ZEROBASEONE', 'ZERO BASE ONE', 'ZB1', '제로베이스원'],
};

/**
 * 텍스트에서 아티스트 이름을 찾아 정규화된 이름으로 반환
 * @param text 검색할 텍스트
 * @returns 매칭된 정규화된 아티스트 이름 또는 null
 */
export function matchArtist(text: string): string | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const normalizedText = text.toUpperCase().trim();

  // 각 아티스트의 별칭을 확인
  for (const [canonical, aliases] of Object.entries(ARTIST_ALIASES)) {
    for (const alias of aliases) {
      const normalizedAlias = alias.toUpperCase().trim();
      // 정확한 매칭 또는 포함 여부 확인
      if (
        normalizedText === normalizedAlias ||
        normalizedText.includes(normalizedAlias) ||
        normalizedAlias.includes(normalizedText)
      ) {
        return canonical;
      }
    }
  }

  return null;
}

/**
 * 여러 텍스트에서 아티스트를 찾음 (첫 번째로 매칭되는 것 반환)
 */
export function findArtistInTexts(texts: string[]): string | null {
  for (const text of texts) {
    const artist = matchArtist(text);
    if (artist) {
      return artist;
    }
  }
  return null;
}

/**
 * 텍스트에 대상 아티스트가 포함되어 있는지 확인
 */
export function containsTargetArtist(text: string): boolean {
  return matchArtist(text) !== null;
}

/**
 * 정규화된 아티스트 이름이 유효한지 확인
 */
export function isValidArtist(artist: string): boolean {
  return TARGET_ARTISTS.includes(artist as any);
}
