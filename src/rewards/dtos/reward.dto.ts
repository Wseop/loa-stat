import { ApiProperty } from '@nestjs/swagger';
import { Reward } from '../classes/reward.class';

export class RewardDto extends Reward {
  @ApiProperty({ type: String })
  protected level: string;

  @ApiProperty({ type: Number, required: false })
  protected silling?: number;

  @ApiProperty({ type: Number, required: false })
  protected shard?: number;

  @ApiProperty({ type: Number })
  protected destruction: number;

  @ApiProperty({ type: Number })
  protected proptection: number;

  @ApiProperty({ type: Number })
  protected leap: number;

  @ApiProperty({ type: Number, required: false })
  protected gem?: number;

  @ApiProperty({ type: Number })
  protected goldValue: number;

  @ApiProperty({ type: Number })
  protected tradableGoldValue: number;
}
