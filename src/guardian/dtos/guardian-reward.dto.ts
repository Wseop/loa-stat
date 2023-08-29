import { ApiProperty } from '@nestjs/swagger';

export class GuardianRewardDto {
  @ApiProperty({ type: String })
  level: string;

  @ApiProperty({ type: Number })
  destruction: number;

  @ApiProperty({ type: Number })
  protection: number;

  @ApiProperty({ type: Number })
  leap: number;

  @ApiProperty({ type: Number })
  goldValue: number;

  @ApiProperty({ type: Number })
  tradableGoldValue: number;
}
