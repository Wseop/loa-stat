import { ApiProperty } from '@nestjs/swagger';

export type SkillCount = {
  count: number;
  level: { [key: string]: number };
  tripod: { [key: string]: number };
  rune: { [key: string]: number };
  myul: number;
  hong: number;
};

export class SkillStatisticsDto {
  @ApiProperty({ type: Number })
  total: number;

  [key: string]: SkillCount | number;
}
