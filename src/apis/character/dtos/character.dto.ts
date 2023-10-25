import { ApiProperty } from '@nestjs/swagger';
import {
  Character,
  Engraving,
  Rune,
  Setting,
  Skill,
} from '../schemas/character.schema';

class EngravingDto extends Engraving {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  level: number;
}

class SettingDto extends Setting {
  @ApiProperty({ type: String })
  stat: string;

  @ApiProperty({ type: String })
  set: string;

  @ApiProperty({ type: String })
  elixir: string;

  @ApiProperty({ type: [EngravingDto] })
  engravings: Engraving[];
}

class RuneDto extends Rune {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  grade: string;
}

class SkillDto extends Skill {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  level: number;

  @ApiProperty({ type: [String] })
  tripods: string[];

  @ApiProperty({ type: RuneDto, nullable: true })
  rune?: Rune;

  @ApiProperty({ type: [String] })
  gem: string[];
}

export class CharacterDto extends Character {
  @ApiProperty({ type: String })
  characterName: string;

  @ApiProperty({ type: String })
  serverName: string;

  @ApiProperty({ type: String })
  className: string;

  @ApiProperty({ type: String })
  classEngraving: string;

  @ApiProperty({ type: Number })
  itemLevel: number;

  @ApiProperty({ type: SettingDto })
  setting: Setting;

  @ApiProperty({ type: [SkillDto] })
  skills: Skill[];

  @ApiProperty({ type: String })
  updated: string;
}
