import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character } from './schemas/character.schema';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
  ) {}

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
