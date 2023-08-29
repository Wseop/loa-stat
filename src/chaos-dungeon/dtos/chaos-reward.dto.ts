import { ApiProperty } from '@nestjs/swagger';

export class ChaosRewardDto {
  @ApiProperty({ type: String })
  level: string;

  @ApiProperty({ type: Number })
  silling: number;

  @ApiProperty({ type: Number })
  shard: number;

  @ApiProperty({ type: Number })
  destruction: number;

  @ApiProperty({ type: Number })
  protection: number;

  @ApiProperty({ type: Number })
  leap: number;

  @ApiProperty({ type: Number })
  gem: number;

  @ApiProperty({ type: Number })
  goldValue: number;

  @ApiProperty({ type: Number })
  tradableGoldValue: number;
}
