import { ApiProperty } from '@nestjs/swagger';

export class CharacterStatisticsDto {
  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty()
  server: {
    [key: string]: number;
  };

  @ApiProperty()
  classEngraving: {
    [key: string]: number;
  };
}
