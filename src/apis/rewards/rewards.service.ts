import { Inject, Injectable, Logger } from '@nestjs/common';
import { GoogleSheetService } from 'src/commons/google-sheet/google-sheet.service';
import { MarketPriceService } from 'src/apis/market-price/market-price.service';
import { RewardsCategory } from '../../commons/enums/rewards.enum';
import {
  ChaosDungeonRewardMap,
  GuardianRewardMap,
} from '../../commons/consts/rewards.const';
import { RewardDto } from './dtos/reward.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SheetMap } from 'src/commons/consts/google-sheet.const';

@Injectable()
export class RewardsService {
  private readonly logger: Logger = new Logger(RewardsService.name);

  constructor(
    private readonly googleSheetService: GoogleSheetService,
    private readonly marketPriceService: MarketPriceService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    setTimeout(() => {
      this.warmCache();
    }, 1000 * 10);
    setInterval(
      () => {
        this.warmCache();
      },
      1000 * 60 * 60 * 12,
    );
  }

  private async warmCache(): Promise<void> {
    this.logger.log('START | WarmCache');
    await this.cacheManager.set(
      SheetMap[RewardsCategory.카오스던전],
      await this.getData(RewardsCategory.카오스던전),
      { ttl: 60 * 60 * 24 },
    );
    await this.cacheManager.set(
      SheetMap[RewardsCategory.가디언토벌],
      await this.getData(RewardsCategory.가디언토벌),
      { ttl: 60 * 60 * 24 },
    );
    this.logger.log('END | WarmCache');
  }

  async getRewards(category: RewardsCategory): Promise<RewardDto[]> {
    const data = await this.getDataFromCache(category);

    if (data) {
      const levels =
        category === RewardsCategory.카오스던전
          ? Object.keys(ChaosDungeonRewardMap)
          : Object.keys(GuardianRewardMap);
      const { total, rewardMin, rewardMax, rewardAvg } = this.classifyData(
        category,
        data,
      );
      const goldValue = this.calcGoldValue(category, rewardAvg);

      // Reward 생성
      const rewards: RewardDto[] = [];
      levels.forEach((level) => {
        const reward = new RewardDto(
          level,
          total[level],
          goldValue[level].tradableGoldValue,
          goldValue[level].goldValue,
        );
        reward.setReward(rewardMin[level], rewardMax[level], rewardAvg[level]);
        rewards.push(reward);
      });
      return rewards;
    } else {
      return null;
    }
  }

  private async getDataFromCache(category: RewardsCategory): Promise<any[][]> {
    let data: any[][] = await this.cacheManager.get(SheetMap[category]);
    if (!data) {
      // cache miss
      data = await this.getData(category);
      this.cacheManager.set(SheetMap[category], data, { ttl: 60 * 60 * 24 });
    }
    return data;
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

  private classifyData(category: RewardsCategory, data: any[][]) {
    const total: { [level: string]: number } = {};
    const rewardSum: { [level: string]: number[] } = {};
    const rewardMin: { [level: string]: number[] } = {};
    const rewardMax: { [level: string]: number[] } = {};
    const rewardAvg: { [level: string]: number[] } = {};
    const levels =
      category === RewardsCategory.카오스던전
        ? Object.keys(ChaosDungeonRewardMap)
        : Object.keys(GuardianRewardMap);

    // 변수 초기화
    levels.forEach((level) => {
      total[level] = 0;
      rewardSum[level] = new Array(data[0].length - 2).fill(0);
      rewardMin[level] = new Array(data[0].length - 2).fill(
        Number.MAX_SAFE_INTEGER,
      );
      rewardMax[level] = new Array(data[0].length - 2).fill(
        Number.MIN_SAFE_INTEGER,
      );
    });

    // 누적 데이터, min, max 계산
    for (let i = 1; i < data.length; i++) {
      const level = data[i][0];
      const count = Number(data[i][1]);

      total[level] += count;
      for (let j = 2; j < data[i].length; j++) {
        const singleValue = Math.floor(
          Number(data[i][j].replace(',', '')) / count,
        );

        rewardSum[level][j - 2] += Number(data[i][j].replace(',', ''));
        rewardMin[level][j - 2] =
          rewardMin[level][j - 2] < singleValue
            ? rewardMin[level][j - 2]
            : singleValue;
        rewardMax[level][j - 2] =
          rewardMax[level][j - 2] < singleValue
            ? singleValue
            : rewardMax[level][j - 2];
      }
    }
    // 누적 데이터로 평균 데이터 계산
    for (let level in rewardSum) {
      rewardAvg[level] = rewardSum[level].map((value) => {
        return value / total[level];
      });
    }

    return {
      total,
      rewardMin,
      rewardMax,
      rewardAvg,
    };
  }

  private calcGoldValue(
    category: RewardsCategory,
    avg: { [level: string]: number[] },
  ): {
    [level: string]: {
      goldValue: number;
      tradableGoldValue: number;
    };
  } {
    const rewardMap =
      category === RewardsCategory.카오스던전
        ? ChaosDungeonRewardMap
        : GuardianRewardMap;
    const result: {
      [level: string]: {
        goldValue: number;
        tradableGoldValue: number;
      };
    } = {};

    for (let level in avg) {
      let goldValue = 0;
      let tradableGoldValue = 0;

      avg[level].forEach((value, i) => {
        const itemName = rewardMap[level][i];
        let itemPrice = this.marketPriceService.getItemPrice(itemName);

        if (itemPrice) {
          if (itemName === '명예의 파편 주머니(소)') {
            goldValue += (itemPrice.price / 500) * value;
          } else if (itemName.includes('파괴강석')) {
            goldValue += (itemPrice.price / 10) * value;
            tradableGoldValue += (itemPrice.price / 10) * value;
          } else if (itemName.includes('수호강석')) {
            goldValue += (itemPrice.price / 10) * value;
            tradableGoldValue += (itemPrice.price / 10) * value;
          } else if (itemName.includes('돌파석')) {
            goldValue += itemPrice.price * value;
            if (category === RewardsCategory.가디언토벌) {
              tradableGoldValue += itemPrice.price * value;
            }
          } else if (itemName === '1레벨 멸화의 보석') {
            goldValue += itemPrice.price * value;
            tradableGoldValue += itemPrice.price * value;
          }
        }
      });

      result[level] = {
        goldValue,
        tradableGoldValue,
      };
    }

    return result;
  }
}
