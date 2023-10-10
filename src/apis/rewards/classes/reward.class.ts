import { RewardItemKeyMap } from 'src/commons/consts/rewards.const';

export class Reward {
  protected level: string;
  protected total: number;
  protected reward: {
    [itemName: string]: {
      min: number;
      max: number;
      avg: number;
    };
  };
  protected tradableGoldValue: number;
  protected goldValue: number;

  constructor(
    level: string,
    total: number,
    tradableGoldValue: number,
    goldValue: number,
  ) {
    this.level = level;
    this.total = total;
    this.tradableGoldValue = tradableGoldValue;
    this.goldValue = goldValue;

    // level에 해당하는 보상 목록으로 초기화
    this.reward = {};
    RewardItemKeyMap[level].forEach((value) => {
      this.reward[value] = {
        min: 0,
        max: 0,
        avg: 0,
      };
    });
  }

  setReward(rewardMin: number[], rewardMax: number[], rewardAvg: number[]) {
    for (let i = 0; i < rewardAvg.length; i++) {
      this.reward[RewardItemKeyMap[this.level][i]] = {
        min: rewardMin[i],
        max: rewardMax[i],
        avg: rewardAvg[i],
      };
    }
  }
}
