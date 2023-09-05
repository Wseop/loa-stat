import { ApiProperty } from '@nestjs/swagger';
import { SkillCount, SkillStatistics } from '../classes/skill-statistics.class';

export class SkillStatisticsDto extends SkillStatistics {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty()
  protected skill: { [key: string]: SkillCount };
}
