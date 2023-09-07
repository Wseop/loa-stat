import { ApiProperty } from '@nestjs/swagger';
import { Reward } from '../classes/reward.class';

export class RewardDto extends Reward {
  @ApiProperty({ type: String })
  protected level: string;

  @ApiProperty({ type: Object })
  protected items: { [item: string]: number };

  @ApiProperty({ type: Number })
  protected tradableGoldValue: number;

  @ApiProperty({ type: Number })
  protected goldValue: number;
}
