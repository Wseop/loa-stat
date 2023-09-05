import { Injectable, Logger } from '@nestjs/common';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';
import { ChaosRewardDto } from './dtos/chaos-reward.dto';
import { ItemPriceService } from 'src/workers/item-price/item-price.service';

@Injectable()
export class ChaosDungeonService {
  private readonly logger: Logger = new Logger(ChaosDungeonService.name);

  constructor(
    private readonly googleSheetService: GoogleSheetService,
    private readonly itemPriceService: ItemPriceService,
  ) {}

  private async getData(): Promise<any[][]> {
    const data = await this.googleSheetService.get('chaos!E:L');

    if (data?.data?.values) {
      return data.data.values;
    } else {
      this.logger.error('received invalid data');
      return null;
    }
  }

  private getSum(data: any[][]) {
    const sum = {
      절망1: [0, 0, 0, 0, 0, 0, 0], // [count, silling, shard, dest, prot, leap, gem]
      절망2: [0, 0, 0, 0, 0, 0, 0],
      천공1: [0, 0, 0, 0, 0, 0, 0],
      천공2: [0, 0, 0, 0, 0, 0, 0],
      계몽1: [0, 0, 0, 0, 0, 0, 0],
    };

    if (!data) return null;

    for (let i = 1; i < data.length; i++) {
      if (data[i].length !== 8) continue;

      for (let j = 1; j < data[i].length; j++) {
        const level = data[i][0];

        if (sum.hasOwnProperty(level))
          sum[level][j - 1] += Number(data[i][j].replace(',', ''));
      }
    }

    return sum;
  }

  private async updateGoldValue(avgReward: ChaosRewardDto) {
    const itemList = {
      절망1: [
        '명예의 파편 주머니(소)',
        '파괴강석',
        '수호강석',
        '경이로운 명예의 돌파석',
        '1레벨 멸화의 보석',
      ],
      절망2: [
        '명예의 파편 주머니(소)',
        '파괴강석',
        '수호강석',
        '경이로운 명예의 돌파석',
        '1레벨 멸화의 보석',
      ],
      천공1: [
        '명예의 파편 주머니(소)',
        '정제된 파괴강석',
        '정제된 수호강석',
        '찬란한 명예의 돌파석',
        '1레벨 멸화의 보석',
      ],
      천공2: [
        '명예의 파편 주머니(소)',
        '정제된 파괴강석',
        '정제된 수호강석',
        '찬란한 명예의 돌파석',
        '1레벨 멸화의 보석',
      ],
      계몽1: [
        '명예의 파편 주머니(소)',
        '정제된 파괴강석',
        '정제된 수호강석',
        '찬란한 명예의 돌파석',
        '1레벨 멸화의 보석',
      ],
    };
    let goldValue = 0;
    let tradableGoldValue = 0;

    await Promise.all(
      itemList[avgReward.level].map((item: string) => {
        let itemPrice = 0;

        if (item === '명예의 파편 주머니(소)') {
          itemPrice = this.itemPriceService.getMarketItemPrice(item);
          if (itemPrice) {
            goldValue += (itemPrice / 500) * avgReward.shard;
          }
        } else if (item.includes('파괴강석')) {
          itemPrice = this.itemPriceService.getMarketItemPrice(item);
          if (itemPrice) {
            goldValue += (itemPrice / 10) * avgReward.destruction;
            tradableGoldValue += (itemPrice / 10) * avgReward.destruction;
          }
        } else if (item.includes('수호강석')) {
          itemPrice = this.itemPriceService.getMarketItemPrice(item);
          if (itemPrice) {
            goldValue += (itemPrice / 10) * avgReward.protection;
            tradableGoldValue += (itemPrice / 10) * avgReward.protection;
          }
        } else if (item.includes('돌파석')) {
          itemPrice = this.itemPriceService.getMarketItemPrice(item);
          if (itemPrice) {
            goldValue += itemPrice * avgReward.leap;
          }
        } else if (item === '1레벨 멸화의 보석') {
          itemPrice = this.itemPriceService.getAuctionItemPrice(item);
          if (itemPrice) {
            goldValue += itemPrice * avgReward.gem;
            tradableGoldValue += itemPrice * avgReward.gem;
          }
        }
      }),
    );

    avgReward.goldValue = goldValue;
    avgReward.tradableGoldValue = tradableGoldValue;
  }

  // 카오스던전 레벨별 보상 평균 반환
  async getAvgReward(): Promise<ChaosRewardDto[]> {
    const result: ChaosRewardDto[] = [];
    const sum = this.getSum(await this.getData());
    const rewardKeys = [
      'silling',
      'shard',
      'destruction',
      'protection',
      'leap',
      'gem',
    ];

    if (!sum) return null;

    for (let level in sum) {
      if (sum[level][0] === 0) continue;

      const avgReward: ChaosRewardDto = {
        level,
        silling: 0,
        shard: 0,
        destruction: 0,
        protection: 0,
        leap: 0,
        gem: 0,
        goldValue: 0,
        tradableGoldValue: 0,
      };
      const count: number = sum[level][0];

      for (let i = 1; i < sum[level].length; i++) {
        avgReward[rewardKeys[i - 1]] = sum[level][i] / count;
      }
      await this.updateGoldValue(avgReward);

      result.push(avgReward);
    }

    return result;
  }
}
