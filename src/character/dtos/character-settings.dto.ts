import { ApiProperty } from '@nestjs/swagger';
import { CharacterSettings } from '../classes/character-settings.class';

export class CharacterSettingsDto extends CharacterSettings {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({
    type: Object,
    properties: { statName: { type: 'number' } },
    example: { 치신: 0 },
  })
  protected stat: { [key: string]: number };

  @ApiProperty({
    type: Object,
    properties: {
      setName: { type: 'number' },
    },
    example: { '6악몽': 0 },
  })
  protected set: { [key: string]: number };

  @ApiProperty({
    type: Object,
    properties: {
      elixirName: {
        type: 'number',
      },
    },
    example: {
      회심: 0,
    },
  })
  protected elixir: { [key: string]: number };

  @ApiProperty({
    type: [Object],
  })
  protected engraving: { [key: string]: number };
}
