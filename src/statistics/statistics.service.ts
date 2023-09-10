import { Injectable, Logger } from '@nestjs/common';
import { CharacterService } from 'src/character/character.service';
import { SettingStatisticsDto } from './dtos/setting-statistics.dto';
import { SkillStatisticsDto } from './dtos/skill-statistics.dto';
import { ServerStatisticsDto } from './dtos/server-statistics.dto';
import { ClassEngravingStatisticsDto } from './dtos/class-engraving-statistics.dto';

@Injectable()
export class StatisticsService {
  private readonly logger: Logger = new Logger(StatisticsService.name);

  constructor(private readonly characterService: CharacterService) {}

  private async getCharacters(
    minItemLevel: number,
    maxItemLevel: number,
    fields: string[],
    classEngraving?: string,
  ) {
    const data = await this.characterService.findFromCache(
      [...fields, 'itemLevel'],
      classEngraving,
    );
    if (!data) return null;

    // itemLevel로 필터링 후 반환
    return data
      .map((value) => {
        if (value.itemLevel >= minItemLevel && value.itemLevel <= maxItemLevel)
          return value;
      })
      .filter((e) => e);
  }

  async getServerStatistics(
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<ServerStatisticsDto> {
    const data = await this.getCharacters(minItemLevel, maxItemLevel, [
      'serverName',
    ]);
    if (!data) return null;

    // 결과 생성
    const result = new ServerStatisticsDto(data.length);
    data.forEach((value) => {
      result.addServerCount(value.serverName);
    });
    result.sort();
    return result;
  }

  async getClassEngravingStatistics(
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<ClassEngravingStatisticsDto> {
    const data = await this.getCharacters(minItemLevel, maxItemLevel, [
      'classEngraving',
    ]);
    if (!data) return null;

    const result = new ClassEngravingStatisticsDto(data.length);
    data.forEach((value) => {
      result.addClassEngravingCount(value.classEngraving);
    });
    result.sort();
    return result;
  }

  async getSettingStatistics(
    classEngraving: string,
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<SettingStatisticsDto> {
    const data = await this.getCharacters(
      minItemLevel,
      maxItemLevel,
      ['setting'],
      classEngraving,
    );
    if (!data) return null;

    const result = new SettingStatisticsDto(data.length);
    data.forEach((value) => {
      result.addStatCount(value.setting.stat);
      result.addSetCount(value.setting.set);
      result.addElixirCount(value.setting.elixir);
      value.setting.engravings.forEach((engraving) => {
        result.addEngravingCount(engraving.name, engraving.level);
      });
    });
    result.sort();
    return result;
  }

  async getSkillStatistics(
    classEngraving: string,
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<SkillStatisticsDto> {
    const data = await this.getCharacters(
      minItemLevel,
      maxItemLevel,
      ['skills'],
      classEngraving,
    );
    if (!data) return null;

    const result = new SkillStatisticsDto(data.length);
    data.forEach((value) => {
      value.skills.forEach((skill) => {
        result.addSkillCount(skill);
      });
    });
    result.sort();
    return result;
  }
}
