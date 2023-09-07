import { ApiProperty } from '@nestjs/swagger';
import { CharacterStatistics } from '../classes/character-statistics.class';

export class CharacterStatisticsDto extends CharacterStatistics {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({
    type: Object,
    properties: { serverName: { type: 'number' } },
    example: { 루페온: 0 },
  })
  protected server: {
    [key: string]: number;
  };

  @ApiProperty({
    type: Object,
    properties: { classEngravingName: { type: 'number' } },
    example: { 광기: 0 },
  })
  protected classEngraving: {
    [key: string]: number;
  };
}
