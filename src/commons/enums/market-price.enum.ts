export const MarketPriceCategory = {
  0: '재련 재료',
  1: '보석',
  2: '각인서',
  3: '에스더의 기운',
} as const;
export type MarketPriceCategory =
  (typeof MarketPriceCategory)[keyof typeof MarketPriceCategory];
