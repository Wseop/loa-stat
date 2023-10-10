import { ApiProperty } from '@nestjs/swagger';
import { CharacterClassEngravings } from '../classes/character-class-engravings.class';

export class CharacterClassEngravingsDto extends CharacterClassEngravings {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({ type: Object })
  protected classEngraving: { [classEngravingName: string]: number };
}
