import { ApiProperty } from '@nestjs/swagger';
import { ServerStatistics } from '../classes/server-statistics.class';

export class ServerStatisticsDto extends ServerStatistics {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({ type: Object })
  protected server: { [serverName: string]: number };
}
