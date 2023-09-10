import { ApiProperty } from '@nestjs/swagger';
import { ClassEngravingStatistics } from '../classes/class-engraving-statistics.class';

export class ClassEngravingStatisticsDto extends ClassEngravingStatistics {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({ type: Object })
  protected classEngraving: { [classEngravingName: string]: number };
}
