import { Injectable, Logger } from '@nestjs/common';
import { CharacterService } from 'src/apis/character/character.service';
import { RewardsService } from 'src/apis/rewards/rewards.service';
import { ClassEngravingMap } from 'src/commons/consts/lostark.const';
import { RewardsCategory } from 'src/commons/enums/rewards.enum';

@Injectable()
export class CacheWarmerService {
  private readonly logger: Logger = new Logger(CacheWarmerService.name);

  constructor(
    private readonly characterService: CharacterService,
    private readonly rewardsService: RewardsService,
  ) {
    setTimeout(() => {
      this.warmCharacterCache();
      this.warmRewardCache();
    }, 1000 * 10);
  }

  private async warmCharacterCache() {
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
      this.logger.debug('Warm-up character cache');
      await new Promise((_) => setTimeout(_, 1000 * 60 * 60));
    }
  }

  private async warmRewardCache() {
    while (true) {
      this.rewardsService.getRewards(RewardsCategory.카오스던전);
      this.rewardsService.getRewards(RewardsCategory.가디언토벌);
      this.logger.debug('Warm-up rewards cache');
      await new Promise((_) => setTimeout(_, 1000 * 60 * 60));
    }
  }
}
