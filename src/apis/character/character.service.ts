import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Character } from './schemas/character.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CharacterServersDto } from './dtos/character-servers.dto';
import { CharacterClassEngravingsDto } from './dtos/character-class-engravings.dto';
import { CharacterSettingsDto } from './dtos/character-settings.dto';
import { CharacterSkillsDto } from './dtos/character-skills.dto';
import { ClassEngravingMap } from 'src/commons/consts/lostark.const';

@Injectable()
export class CharacterService {
  private readonly logger: Logger = new Logger(CharacterService.name);
  private addRequestQ: string[] = [];

  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    setTimeout(() => {
      this.warmCache();
    }, 1000 * 10);
    setInterval(
      () => {
        this.warmCache();
      },
      1000 * 60 * 60,
    );
  }

  private async warmCache(): Promise<void> {
    await this.setCache(['serverName', 'itemLevel'], '', 0);
    await this.setCache(['classEngraving', 'itemLevel'], '', 0);
    Object.keys(ClassEngravingMap).forEach(async (classEngraving) => {
      await this.setCache(['setting', 'itemLevel'], classEngraving, 0);
      await this.setCache(['skills', 'itemLevel'], classEngraving, 0);
    });
  }

  ////////////////////
  // CharacterModel //
  ////////////////////
  async findOneByCharacterName(characterName: string): Promise<Character> {
    return await this.characterModel.findOne(
      { characterName },
      {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    );
  }

  private async find(
    filter?: FilterQuery<Character>,
    fields?: string[],
  ): Promise<Character[]> {
    const projection: ProjectionType<Character> = {
      _id: 0,
    };

    if (fields) {
      fields.forEach((field) => {
        projection[field] = 1;
      });
    }

    return await this.characterModel.find(filter, projection);
  }

  async findFromCache(
    minItemLevel: number,
    maxItemLevel: number,
    fields: string[],
    classEngraving?: string,
  ): Promise<Character[]> {
    // RedisKey생성 (classEngraving + fields + itemLevel)
    let redisKey = classEngraving ? classEngraving : '';
    fields.forEach((field) => (redisKey += field));
    redisKey += 'itemLevel';

    // itemLevel 필드는 필수로 포함
    if (!fields.includes('itemLevel')) fields.push('itemLevel');

    if (redisKey) {
      let result: Character[] = await this.cacheManager.get(redisKey);
      if (!result) {
        // cache miss (db 접근, cache에 저장)
        if (classEngraving)
          result = await this.find({ classEngraving }, fields);
        else result = await this.find(null, fields);
        this.cacheManager.set(redisKey, result, { ttl: 60 * 10 });
      }
      // itemLevel로 필터링
      return result
        .map((value) => {
          if (
            value.itemLevel >= minItemLevel &&
            value.itemLevel <= maxItemLevel
          )
            return value;
        })
        .filter((e) => e);
    } else {
      this.logger.error('RedisKey is null');
      return null;
    }
  }

  private async setCache(
    fields: string[],
    classEngraving: string,
    ttl: number,
  ) {
    let redisKey = classEngraving;
    fields.forEach((field) => (redisKey += field));

    if (redisKey) {
      let data: Character[];
      if (classEngraving) data = await this.find({ classEngraving }, fields);
      else data = await this.find(null, fields);

      if (data) {
        this.cacheManager.set(redisKey, data, { ttl });
        this.logger.debug(`Set character cache - ${redisKey}`);
      }
    }
  }

  async upsert(character: Character): Promise<Character> {
    return await this.characterModel.findOneAndUpdate(
      {
        characterName: character.characterName,
      },
      character,
      {
        upsert: true,
        new: true,
      },
    );
  }

  async deleteOne(characterName: string): Promise<number> {
    return (await this.characterModel.deleteOne({ characterName }))
      .deletedCount;
  }

  //////////////
  // RequestQ //
  //////////////
  addRequest(characterName: string) {
    this.addRequestQ.push(characterName);
    this.logger.debug(`Add request - ${characterName}`);
  }

  popRequest(): string {
    const characterName = this.addRequestQ.shift();
    if (characterName) this.logger.debug(`Pop request - ${characterName}`);
    return characterName;
  }

  ////////////////////////////////////////////
  // 캐릭터 통계 (서버, 직각, 세팅, 스킬세팅) //
  ///////////////////////////////////////////
  async getCharacterServers(
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<CharacterServersDto> {
    const data = await this.findFromCache(
      minItemLevel,
      maxItemLevel,
      ['serverName'],
      null,
    );
    if (!data) return null;

    const result = new CharacterServersDto(data.length);
    data.forEach((value) => {
      result.addServerCount(value.serverName);
    });
    result.sort();
    return result;
  }

  async getCharacterClassEngravings(
    minItemLevel: number,
    maxItemLevel: number,
  ): Promise<CharacterClassEngravingsDto> {
    const data = await this.findFromCache(
      minItemLevel,
      maxItemLevel,
      ['classEngraving'],
      null,
    );
    if (!data) return null;

    const result = new CharacterClassEngravingsDto(data.length);
    data.forEach((value) => {
      result.addClassEngravingCount(value.classEngraving);
    });
    result.sort();
    return result;
  }

  async getCharacterSettings(
    minItemLevel: number,
    maxItemLevel: number,
    classEngraving: string,
  ): Promise<CharacterSettingsDto> {
    const data = await this.findFromCache(
      minItemLevel,
      maxItemLevel,
      ['setting'],
      classEngraving,
    );
    if (!data) return null;

    const result = new CharacterSettingsDto(data.length);
    data.forEach((value) => {
      result.addStatCount(value.setting.stat);
      result.addSetCount(value.setting.set);
      result.addElixirCount(value.setting.elixir);
      result.setEngraving(value.setting.engravings);
    });
    result.sort();
    return result;
  }

  async getCharacterSkills(
    minItemLevel: number,
    maxItemLevel: number,
    classEngraving: string,
  ): Promise<CharacterSkillsDto> {
    const data = await this.findFromCache(
      minItemLevel,
      maxItemLevel,
      ['skills'],
      classEngraving,
    );
    if (!data) return null;

    const result = new CharacterSkillsDto(data.length);
    data.forEach((value) => {
      value.skills.forEach((skill) => {
        result.addSkillCount(skill);
      });
    });
    result.sort();
    return result;
  }
}
