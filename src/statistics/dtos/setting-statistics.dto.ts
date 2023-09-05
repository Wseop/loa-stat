import { ApiProperty } from '@nestjs/swagger';
import { SettingStatistics } from '../classes/setting-statistics.class';

export class SettingStatisticsDto extends SettingStatistics {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty()
  protected stat: { [key: string]: number };

  @ApiProperty()
  protected set: { [key: string]: number };

  @ApiProperty()
  protected elixir: { [key: string]: number };

  @ApiProperty()
  protected engraving: {
    [key: string]: number;
  }[];
}
