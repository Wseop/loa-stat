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
