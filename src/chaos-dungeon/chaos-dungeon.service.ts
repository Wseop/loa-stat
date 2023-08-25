import { Injectable, Logger } from '@nestjs/common';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';
import { ChaosRewardDto } from './dtos/chaos-reward.dto';

@Injectable()
export class ChaosDungeonService {
  private readonly logger: Logger = new Logger(ChaosDungeonService.name);

  constructor(private readonly googleSheetService: GoogleSheetService) {}

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
      절망2: [0, 0, 0, 0, 0, 0, 0], // [count, silling, shard, dest, prot, leap, gem]
      천공1: [0, 0, 0, 0, 0, 0, 0],
      천공2: [0, 0, 0, 0, 0, 0, 0],
      계몽1: [0, 0, 0, 0, 0, 0, 0],
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
      };
      const count: number = sum[level][0];

      for (let i = 1; i < sum[level].length; i++) {
        avgReward[rewardKeys[i - 1]] = sum[level][i] / count;
      }

      result.push(avgReward);
    }

    return result;
  }
}
