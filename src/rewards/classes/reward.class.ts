import { RewardKey } from '../consts/rewards.const';
import { RewardsCategory } from '../enums/rewards.enum';

export class Reward {
  protected level: string;
  protected silling?: number;
  protected shard?: number;
  protected destruction: number;
  protected proptection: number;
  protected leap: number;
  protected gem?: number;
  protected goldValue: number;
  protected tradableGoldValue: number;

  constructor(category: RewardsCategory, level: string, rewards: number[]) {
    this.level = level;

    rewards.forEach((reward, i) => {
      this[RewardKey[category][i]] = reward;
    });
  }
}
