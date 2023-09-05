import { Injectable, Logger } from '@nestjs/common';
import { CharacterService } from 'src/character/character.service';
import { CharacterStatisticsDto } from './dtos/character-statistics.dto';
import { SettingStatisticsDto } from './dtos/setting-statistics.dto';
import { SkillStatisticsDto } from './dtos/skill-statistics.dto';

@Injectable()
export class StatisticsService {
  private readonly logger: Logger = new Logger(StatisticsService.name);

  constructor(private readonly characterService: CharacterService) {}

  async getCharacterStatistics(
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<CharacterStatisticsDto> {
    const data = await this.characterService.find(
      {
        itemLevel: { $gte: minItemLevel, $lte: maxItemLevel },
      },
      ['serverName', 'classEngraving'],
    );

    if (data?.length > 0) {
      const result = new CharacterStatisticsDto(data.length);

      data.forEach((value) => {
        result.addServerCount(value.serverName);
        result.addClassEngravingCount(value.classEngraving);
      });

      return result;
    } else {
      return null;
    }
  }

  async getSettingStatistics(
    classEngraving: string,
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<SettingStatisticsDto> {
    const data = await this.characterService.find(
      {
        classEngraving,
        itemLevel: { $gte: minItemLevel, $lte: maxItemLevel },
      },
      ['setting'],
    );

    if (data?.length > 0) {
      const result = new SettingStatisticsDto(data.length);

      data.forEach((value) => {
        result.addStatCount(value.setting.stat);
        result.addSetCount(value.setting.set);
        result.addElixirCount(value.setting.elixir);
        value.setting.engravings.forEach((engraving) => {
          result.addEngravingCount(engraving.name, engraving.level);
        });
      });

      return result;
    } else {
      return null;
    }
  }

  async getSkillStatistics(
    classEngraving: string,
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<SkillStatisticsDto> {
    const data = await this.characterService.find(
      {
        classEngraving,
        itemLevel: { $gte: minItemLevel, $lte: maxItemLevel },
      },
      ['skills'],
    );

    if (data?.length > 0) {
      const result = new SkillStatisticsDto(data.length);

      data.forEach((value) => {
        value.skills.forEach((skill) => {
          result.addSkillCount(skill);
        });
      });

      return result;
    } else {
      return null;
    }
  }
}
