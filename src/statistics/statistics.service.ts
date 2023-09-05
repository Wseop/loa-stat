import { Injectable, Logger } from '@nestjs/common';
import { CharacterService } from 'src/character/character.service';
import { CharacterStatisticsDto } from './dtos/character-statistics.dto';
import { classEngravingMap, servers } from 'src/lostark/resources/const';
import { SettingStatisticsDto } from './dtos/setting-statistics.dto';
import { SkillCount, SkillStatisticsDto } from './dtos/skill-statistics.dto';

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
      const result: CharacterStatisticsDto = {
        total: data.length,
        server: {},
        classEngraving: {},
      };

      // result 초기화
      servers.forEach((value) => {
        result.server[value] = 0;
      });
      for (let classEngraving in classEngravingMap) {
        result.classEngraving[classEngraving] = 0;
      }

      // data counting
      data.forEach((value) => {
        result.server[value.serverName]++;
        result.classEngraving[value.classEngraving]++;
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
      const result: SettingStatisticsDto = {
        total: data.length,
        stat: {},
        set: {},
        elixir: {},
        engraving: Array.from({ length: 3 }, () => {
          return {};
        }),
      };

      data.forEach((value) => {
        const setting = value.setting;

        // stat
        if (!result.stat[setting.stat]) result.stat[setting.stat] = 0;
        result.stat[setting.stat]++;

        // set
        if (!result.set[setting.set]) result.set[setting.set] = 0;
        result.set[setting.set]++;

        // elixir
        if (!result.elixir[setting.elixir]) result.elixir[setting.elixir] = 0;
        result.elixir[setting.elixir]++;

        // engraving
        setting.engravings.forEach((value) => {
          if (!result.engraving[value.level - 1][value.name])
            result.engraving[value.level - 1][value.name] = 0;
          result.engraving[value.level - 1][value.name]++;
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
      const result: SkillStatisticsDto = {
        total: data.length,
      };

      data.forEach((value) => {
        value.skills.forEach((skill) => {
          let skillCount = result[skill.name] as SkillCount;

          if (!skillCount) {
            skillCount = {
              count: 0,
              level: {},
              tripod: {},
              rune: {},
              myul: 0,
              hong: 0,
            };
            result[skill.name] = skillCount;
          }

          skillCount.count++;

          // level
          if (!skillCount.level[skill.level]) skillCount.level[skill.level] = 0;
          skillCount.level[skill.level]++;

          // tripod
          skill.tripods.forEach((tripod) => {
            if (!skillCount.tripod[tripod]) skillCount.tripod[tripod] = 0;
            skillCount.tripod[tripod]++;
          });

          // rune
          if (skill.rune) {
            const key = `${skill.rune.name}(${skill.rune.grade})`;

            if (!skillCount.rune[key]) skillCount.rune[key] = 0;
            skillCount.rune[key]++;
          }

          // gem
          skill.gems.forEach((value) => {
            if (value === '멸화') skillCount.myul++;
            else if (value === '홍염') skillCount.hong++;
          });
        });
      });

      return result;
    } else {
      return null;
    }
  }
}
