import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Character } from './schemas/character.schema';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
  ) {}

  async count() {
    this.characterModel.countDocuments({});
  }

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

  async find(
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
}
