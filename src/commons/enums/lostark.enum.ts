export const MarketItemCategory = {
  각인서: 40000,
  '강화 재료': 50000,
  '재련 재료': 50010,
  '재련 추가 재료': 50020,
  '기타 재료': 51000,
} as const;
export type MarketItemCategory =
  (typeof MarketItemCategory)[keyof typeof MarketItemCategory];

export const MarketItemId = {
  파괴강석: 66102004,
  '정제된 파괴강석': 66102005,
  수호강석: 66102104,
  '정제된 수호강석': 66102105,
  '경이로운 명예의 돌파석': 66110223,
  '찬란한 명예의 돌파석': 66110224,
  '태양의 은총': 66111121,
  '태양의 축복': 66111122,
  '태양의 가호': 66111123,
  '명예의 파편 주머니(소)': 66130131,
  '명예의 파편 주머니(중)': 66130132,
  '명예의 파편 주머니(대)': 66130133,
  '에스더의 기운': 66150010,
  '선명한 지혜의 정수': 66160220,
  '빛나는 지혜의 정수': 66160320,
  '상급 오레하 융화 재료': 6861009,
  '최상급 오레하 융화 재료': 6861011,
} as const;
export type MarketItemId = (typeof MarketItemId)[keyof typeof MarketItemId];

export const AuctionItemCategory = {
  아뮬렛: 170300,
  '어빌리티 스톤': 30000,
  장신구: 200000,
  목걸이: 200010,
  귀걸이: 200020,
  반지: 200030,
  팔찌: 200040,
  보석: 210000,
} as const;
export type AuctionItemCategory =
  (typeof AuctionItemCategory)[keyof typeof AuctionItemCategory];
