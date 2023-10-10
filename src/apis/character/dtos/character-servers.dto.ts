import { ApiProperty } from '@nestjs/swagger';
import { CharacterServers } from '../classes/character-servers.class';

export class CharacterServersDto extends CharacterServers {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({ type: Object })
  protected server: { [serverName: string]: number };
}
