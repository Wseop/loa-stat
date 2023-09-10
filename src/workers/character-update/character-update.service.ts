import { Injectable, Logger } from '@nestjs/common';
import { CharacterService } from 'src/character/character.service';
import { ValidateCharacter } from 'src/character/functions/character.functions';
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
    const result = await this.characterService.findFromCache(['characterName']);

    if (result)
      return result.map((value) => {
        return value.characterName;
      });
  }

  private async updateCharacter(characterName: string) {
    const result = await this.lostarkService.searchCharacter(characterName);

    // 검증 후 upsert
    if (result) {
      if (ValidateCharacter(result)) {
        await this.characterService.upsert(result);
      }
    } else {
      // 더 이상 존재하지 않는 캐릭터면 db에서 삭제
      await this.characterService.deleteOne(characterName);
      this.logger.debug(`DELETE | ${characterName}`);
    }
  }

  private async run() {
    this.logger.log('START | CharacterUpdate');

    while (true) {
      const characterNames = await this.getCharacterNames();

      while (characterNames.length > 0) {
        await this.updateCharacter(characterNames.pop());
        await new Promise((_) => setTimeout(_, 1000));
      }
    }
  }
}
