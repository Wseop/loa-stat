import { RewardItemKey } from '../consts/rewards.const';

export class Reward {
  protected level: string;
  protected items: { [item: string]: number };
  protected tradableGoldValue: number;
  protected goldValue: number;

  constructor(level: string, rewards: number[]) {
    this.level = level;
    this.items = {};
    this.tradableGoldValue = rewards.pop();
    this.goldValue = rewards.pop();

    rewards.forEach((reward, i) => {
      this.items[RewardItemKey[level][i]] = reward;
    });
  }
}
