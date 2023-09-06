export const MarketPriceCategory = {
  Reforge: 'reforge',
  Gem: 'gem',
  Esther: 'esther',
} as const;
export type MarketPriceCategory =
  (typeof MarketPriceCategory)[keyof typeof MarketPriceCategory];
