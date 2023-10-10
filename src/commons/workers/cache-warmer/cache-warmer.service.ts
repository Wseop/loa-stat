import { Injectable, Logger } from '@nestjs/common';
import { CharacterService } from 'src/apis/character/character.service';
import { ClassEngravingMap } from 'src/commons/consts/lostark.const';

@Injectable()
export class CacheWarmerService {
  private readonly logger: Logger = new Logger(CacheWarmerService.name);

  constructor(private readonly characterService: CharacterService) {
    setTimeout(() => {
      this.warmCharacterCache();
    }, 1000 * 5);
  }

  private async warmCharacterCache() {
    // 1시간마다 character 관련 cache warming
    while (true) {
      // server
      await this.characterService.setCache(['serverName', 'itemLevel'], '', 0);
      // classEngraving
      await this.characterService.setCache(
        ['classEngraving', 'itemLevel'],
        '',
        0,
      );
      // setting & skills
      for (let classEngraving in ClassEngravingMap) {
        await this.characterService.setCache(
          ['setting', 'itemLevel'],
          classEngraving,
          0,
        );
        await this.characterService.setCache(
          ['skills', 'itemLevel'],
          classEngraving,
          0,
        );
      }
      this.logger.debug('Warming character cache end');
      await new Promise((_) => setTimeout(_, 1000 * 60 * 60));
    }
  }
}
