export const RewardsCategory = {
  카오스던전: '카오스던전',
  가디언토벌: '가디언토벌',
} as const;
export type RewardsCategory =
  (typeof RewardsCategory)[keyof typeof RewardsCategory];
