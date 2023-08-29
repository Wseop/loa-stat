import { Injectable, Logger } from '@nestjs/common';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';
import { ItemPriceService } from 'src/worker/item-price/item-price.service';
import { GuardianRewardDto } from './dtos/guardian-reward.dto';

@Injectable()
export class GuardianService {
  private readonly logger: Logger = new Logger(GuardianService.name);

  constructor(
    private readonly googleSheetService: GoogleSheetService,
    private readonly itemPriceService: ItemPriceService,
  ) {}

  private async getData(): Promise<any[][]> {
    const data = await this.googleSheetService.get('guardian!A:E');

    if (data?.data?.values) {
      return data.data.values;
    } else {
      this.logger.error('received invalid data');
      return null;
    }
  }

  private getSum(data: any[][]) {
    const sum = {
      하누마탄: [0, 0, 0, 0], // [count, destruction, protection, leap]
      소나벨: [0, 0, 0, 0],
      가르가디스: [0, 0, 0, 0],
    };

    if (!data) return null;

    for (let i = 1; i < data.length; i++) {
      for (let j = 1; j < data[i].length; j++) {
        const level = data[i][0];

        if (sum.hasOwnProperty(level))
          sum[level][j - 1] += Number(data[i][j].replace(',', ''));
      }
    }

    return sum;
  }

  private async updateGoldValue(avgReward: GuardianRewardDto) {
    const itemList = {
      하누마탄: ['파괴강석', '수호강석', '경이로운 명예의 돌파석'],
      소나벨: ['정제된 파괴강석', '정제된 수호강석', '찬란한 명예의 돌파석'],
      가르가디스: [
        '정제된 파괴강석',
        '정제된 수호강석',
        '찬란한 명예의 돌파석',
      ],
    };
    let goldValue = 0;
    let tradableGoldValue = 0;

    await Promise.all(
      itemList[avgReward.level].map((item: string) => {
        let itemPrice = 0;

        if (item.includes('파괴강석')) {
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
            tradableGoldValue += itemPrice * avgReward.leap;
          }
        }
      }),
    );

    avgReward.goldValue = goldValue;
    avgReward.tradableGoldValue = tradableGoldValue;
  }

  async getAvgReward(): Promise<GuardianRewardDto[]> {
    const result: GuardianRewardDto[] = [];
    const sum = this.getSum(await this.getData());
    const rewardKeys = ['destruction', 'protection', 'leap'];

    if (!sum) return null;

    for (let level in sum) {
      if (sum[level][0] === 0) continue;

      const avgReward: GuardianRewardDto = {
        level,
        destruction: 0,
        protection: 0,
        leap: 0,
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
