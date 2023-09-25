import { ApiProperty } from '@nestjs/swagger';
import { CharacterSettings } from '../classes/character-settings.class';

export class CharacterSettingsDto extends CharacterSettings {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({
    type: Object,
  })
  protected stat: { [key: string]: number };

  @ApiProperty({
    type: Object,
  })
  protected set: { [key: string]: number };

  @ApiProperty({
    type: Object,
  })
  protected elixir: { [key: string]: number };

  @ApiProperty({
    type: Object,
  })
  protected engraving: { [key: string]: number };
}
