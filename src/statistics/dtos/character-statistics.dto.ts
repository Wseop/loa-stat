import { ApiProperty } from '@nestjs/swagger';
import { CharacterStatistics } from '../classes/character-statistics.class';

export class CharacterStatisticsDto extends CharacterStatistics {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty()
  protected server: {
    [key: string]: number;
  };

  @ApiProperty()
  protected classEngraving: {
    [key: string]: number;
  };
}
