import { ClassEngravingMap, Engravings } from './lostark.const';

export const MarketPriceCategoryMap: {
  readonly [key: string]: readonly string[];
} = {
  '재련 재료': [
    '명예의 파편 주머니(소)',
    '명예의 파편 주머니(중)',
    '명예의 파편 주머니(대)',
    '파괴강석',
    '정제된 파괴강석',
    '수호강석',
    '정제된 수호강석',
    '경이로운 명예의 돌파석',
    '찬란한 명예의 돌파석',
    '태양의 은총',
    '태양의 축복',
    '태양의 가호',
    '상급 오레하 융화 재료',
    '최상급 오레하 융화 재료',
  ],
  보석: Array.from({ length: 20 }, (_, i) => {
    const gemLevel = Math.floor(i / 2) + 1;
    if (i & 1) {
      return `${gemLevel}레벨 홍염의 보석`;
    } else {
      return `${gemLevel}레벨 멸화의 보석`;
    }
  }),
  각인서: Array.from(
    [...Engravings, ...Object.keys(ClassEngravingMap)],
    (v) => {
      if (Engravings.includes(v)) return `${v} 각인서`;
      else return `[${ClassEngravingMap[v]}] ${v} 각인서`;
    },
  ),
  '에스더의 기운': ['에스더의 기운'],
} as const;
