import { Injectable, Logger } from '@nestjs/common';
import { CharacterService } from 'src/character/character.service';
import { ValidateCharacter } from 'src/character/functions/character.functions';
import { Character } from 'src/character/schemas/character.schema';
import { LostarkService } from 'src/lostark/lostark.service';

@Injectable()
export class CharacterUpdateService {
  private readonly logger: Logger = new Logger(CharacterUpdateService.name);

  constructor(
    private readonly lostarkService: LostarkService,
    private readonly characterService: CharacterService,
  ) {
    setTimeout(() => {
      this.run();
    }, 1000 * 5);
  }

  private async getCharacterNames(): Promise<string[]> {
    const result = await this.characterService.findFromCache(1620, 1655, [
      'characterName',
    ]);

    if (result)
      return result.map((value) => {
        return value.characterName;
      });
  }

  private async updateCharacter(characterName: string) {
    const result = await this.lostarkService.searchCharacter(characterName);

    if (result) {
      // 정상적인 캐릭터 정보인 경우 upsert
      if (!Number.isInteger(result) && ValidateCharacter(result as Character)) {
        await this.characterService.upsert(result as Character);
      }
    } else {
      // 존재하지 않는 캐릭터면 db에서 삭제
      await this.characterService.deleteOne(characterName);
      this.logger.debug(`DELETE | ${characterName}`);
    }
  }

  private async updateFromDB() {
    while (true) {
      const characterNames = await this.getCharacterNames();
      while (characterNames.length > 0) {
        await this.updateCharacter(characterNames.pop());
        await new Promise((_) => setTimeout(_, 1000));
      }
      await new Promise((_) => setTimeout(_, 1000 * 60 * 60 * 24));
    }
  }

  private async updateFromRequest() {
    while (true) {
      const characterName = this.characterService.popRequest();
      if (characterName) {
        await this.updateCharacter(characterName);
        await new Promise((_) => setTimeout(_, 1000));
      } else await new Promise((_) => setTimeout(_, 1000 * 60 * 5));
    }
  }

  private async run() {
    this.updateFromDB();
    this.updateFromRequest();
    this.logger.log('START | CharacterUpdate');
  }
}
