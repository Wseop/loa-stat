export const MarketPriceCategory = {
  Reforge: '재련재료',
  Gem: '보석',
  Esther: '에스더의 기운',
} as const;
export type MarketPriceCategory =
  (typeof MarketPriceCategory)[keyof typeof MarketPriceCategory];
