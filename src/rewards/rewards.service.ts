import { Injectable, Logger } from '@nestjs/common';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';
import { MarketPriceService } from 'src/market-price/market-price.service';
import { RewardsCategory } from './enums/rewards.enum';
import {
  ChaosDungeonRewardMap,
  GuardianRewardMap,
} from './consts/rewards.const';
import { RewardDto } from './dtos/reward.dto';

@Injectable()
export class RewardsService {
  private readonly logger: Logger = new Logger(RewardsService.name);

  constructor(
    private readonly googleSheetService: GoogleSheetService,
    private readonly marketPriceService: MarketPriceService,
  ) {}

  async getRewards(category: RewardsCategory): Promise<RewardDto[]> {
    const data = await this.getData(category);

    if (data) {
      const rewards = this.calcGoldValue(
        category,
        this.calcAvgData(category, data),
      );
      const result = [];

      for (let level in rewards) {
        if (rewards[level].length === 0) continue;
        result.push(new RewardDto(level, rewards[level]));
      }

      return result;
    } else {
      return null;
    }
  }

  private async getData(category: RewardsCategory): Promise<any[][]> {
    const range =
      category === RewardsCategory.카오스던전 ? 'chaos!E:L' : 'guardian!A:E';
    const data = await this.googleSheetService.get(range);

    if (data?.data?.values) {
      return data.data.values;
    } else {
      this.logger.error(`${category} | Received invalid data`);
      return null;
    }
  }

  private calcAvgData(category: RewardsCategory, data: any[][]) {
    const sum: { [level: string]: number[] } = {};
    const avg: { [level: string]: number[] } = {};
    const columnCount = data[0].length;
    const levels =
      category === RewardsCategory.카오스던전
        ? Object.keys(ChaosDungeonRewardMap)
        : Object.keys(GuardianRewardMap);

    // sum, avg 초기화
    levels.forEach((level) => {
      sum[level] = Array.from({ length: columnCount - 1 }, () => 0);
      avg[level] = [];
    });

    // calc sum
    for (let i = 1; i < data.length; i++) {
      if (data[i].length !== columnCount) continue;
      for (let j = 1; j < columnCount; j++) {
        sum[data[i][0]][j - 1] += Number(data[i][j].replace(',', ''));
      }
    }

    // calc avg
    for (let level in sum) {
      const count = sum[level][0];

      if (count === 0) continue;
      for (let i = 1; i < columnCount - 1; i++) {
        avg[level].push(sum[level][i] / count);
      }
    }

    return avg;
  }

  private calcGoldValue(
    category: RewardsCategory,
    avg: { [level: string]: number[] },
  ) {
    const rewardMap =
      category === RewardsCategory.카오스던전
        ? ChaosDungeonRewardMap
        : GuardianRewardMap;
    const result: { [level: string]: number[] } = JSON.parse(
      JSON.stringify(avg),
    );

    for (let level in avg) {
      let goldValue = 0;
      let tradableGoldValue = 0;

      avg[level].forEach((value, i) => {
        const itemName = rewardMap[level][i];
        let itemPrice = this.marketPriceService.getItemPrice(itemName);

        if (itemPrice) {
          if (itemName === '명예의 파편 주머니(소)') {
            goldValue += (itemPrice / 500) * value;
          } else if (itemName.includes('파괴강석')) {
            goldValue += (itemPrice / 10) * value;
            tradableGoldValue += (itemPrice / 10) * value;
          } else if (itemName.includes('수호강석')) {
            goldValue += (itemPrice / 10) * value;
            tradableGoldValue += (itemPrice / 10) * value;
          } else if (itemName.includes('돌파석')) {
            goldValue += itemPrice * value;
            if (category === RewardsCategory.가디언토벌) {
              tradableGoldValue += itemPrice * value;
            }
          } else if (itemName === '1레벨 멸화의 보석') {
            goldValue += itemPrice * value;
            tradableGoldValue += itemPrice * value;
          }
        }
      });

      if (goldValue && tradableGoldValue)
        result[level].push(goldValue, tradableGoldValue);
    }

    return result;
  }
}
