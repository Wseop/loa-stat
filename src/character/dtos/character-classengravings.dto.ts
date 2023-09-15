import { ApiProperty } from '@nestjs/swagger';
import { CharacterClassEngravings } from '../classes/character-classengravings.class';

export class CharacterClassEngravingsDto extends CharacterClassEngravings {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({ type: Object })
  protected classEngraving: { [classEngravingName: string]: number };
}
