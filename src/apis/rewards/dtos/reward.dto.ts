import { ApiProperty } from '@nestjs/swagger';
import { Reward } from '../classes/reward.class';

export class RewardDto extends Reward {
  @ApiProperty({ type: String })
  protected level: string;

  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({ type: Object })
  protected reward: {
    [itemName: string]: { avg: number; min: number; max: number };
  };

  @ApiProperty({ type: Number })
  protected tradableGoldValue: number;

  @ApiProperty({ type: Number })
  protected goldValue: number;
}
