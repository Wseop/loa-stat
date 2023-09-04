import { ApiProperty } from '@nestjs/swagger';

export class SettingStatisticsDto {
  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty()
  stat: { [key: string]: number };

  @ApiProperty()
  set: { [key: string]: number };

  @ApiProperty()
  elixir: { [key: string]: number };

  @ApiProperty()
  engraving: {
    [key: string]: number;
  }[];
}
