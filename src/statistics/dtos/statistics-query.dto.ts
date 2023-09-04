import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class StatisticsQueryDto {
  @ApiProperty({ type: Number, default: 1620 })
  @IsNumber()
  @Min(1620)
  @Max(1655)
  minItemLevel: number;

  @ApiProperty({ type: Number, default: 1655 })
  @IsNumber()
  @Min(1620)
  @Max(1655)
  maxItemLevel: number;
}
