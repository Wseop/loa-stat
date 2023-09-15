import { ApiProperty } from '@nestjs/swagger';
import { CharacterSkills, SkillCount } from '../classes/character-skills.class';

export class CharacterSkillsDto extends CharacterSkills {
  @ApiProperty({ type: Number })
  protected total: number;

  @ApiProperty({
    type: Object,
  })
  protected skill: { [key: string]: SkillCount };
}
