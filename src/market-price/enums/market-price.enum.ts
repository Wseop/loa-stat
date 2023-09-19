export const MarketPriceCategory = {
  Reforge: '재련 재료',
  Gem: '보석',
  EngravingBook: '각인서',
  Esther: '에스더의 기운',
} as const;
export type MarketPriceCategory =
  (typeof MarketPriceCategory)[keyof typeof MarketPriceCategory];
