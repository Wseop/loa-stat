import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Character } from './schemas/character.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CharacterService {
  private readonly logger: Logger = new Logger(CharacterService.name);
  private addRequestQ: string[] = [];

  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

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
    fields: string[],
    classEngraving?: string,
  ): Promise<Character[]> {
    // field + classEngraving으로 redisKey생성
    let redisKey = classEngraving ? classEngraving : '';
    fields.forEach((field) => (redisKey += field));

    if (redisKey) {
      let result: Character[] = await this.cacheManager.get(redisKey);
      if (!result) {
        // cache miss (db 접근, cache에 저장)
        this.logger.debug(`Character cache miss - ${redisKey}`);
        if (classEngraving)
          result = await this.find({ classEngraving }, fields);
        else result = await this.find(null, fields);
        this.cacheManager.set(redisKey, result, { ttl: 60 * 10 });
      }
      return result;
    } else {
      this.logger.error('RedisKey is null');
      return null;
    }
  }

  async setCache(fields: string[], classEngraving: string, ttl: number) {
    let redisKey = classEngraving;
    fields.forEach((field) => (redisKey += field));

    if (redisKey) {
      let data;
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
}
