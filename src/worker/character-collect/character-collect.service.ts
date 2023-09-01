import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CharacterService } from 'src/character/character.service';
import { Character } from 'src/character/schemas/character.schema';
import { EngravingService } from 'src/engraving/engraving.service';
import { LostarkService } from 'src/lostark/lostark.service';

@Injectable()
export class CharacterCollectService {
  private readonly logger: Logger = new Logger(CharacterCollectService.name);
  private readonly MAX_ITEM_LEVEL = 1655;
  private readonly MIN_ITEM_LEVEL = 1620;
  private readonly MAX_CURSOR = 450;
  private characterNameQueue: string[] = [];
  private characterQueue: Character[] = [];

  constructor(
    private readonly lostarkService: LostarkService,
    private readonly characterService: CharacterService,
    private readonly engravingService: EngravingService,
  ) {
    setTimeout(() => {
      this.run();
    }, 1000 * 5);
  }

  // 서버, 직업각인 단위로 캐릭터명을 수집하여 CharacterNameQueue에 추가
  private async collectCharacterName(server: string, classEngraving: string) {
    let itemLevel = this.MAX_ITEM_LEVEL;
    let currentItemLevel = this.MAX_ITEM_LEVEL;
    let cursor = 0;

    while (currentItemLevel >= this.MIN_ITEM_LEVEL) {
      try {
        const result = await axios.get(
          `${process.env.CHARACTER_COLLECT_URL}?server=${server}&classEngraves[]=${classEngraving}&maxItemLevel=${itemLevel}&cursor=${cursor}`,
        );

        this.logger.debug(
          `${server} | ${classEngraving} | ${itemLevel} | ${cursor}`,
        );

        if (result?.data.data) {
          const characters = result.data.data;

          // 캐릭터명 추출
          for (let character of characters) {
            currentItemLevel = character.itemLevel;
            if (currentItemLevel >= this.MIN_ITEM_LEVEL) {
              this.characterNameQueue.push(character.name);
            } else break;
          }

          // update url parameter(cursor, itemLevel)
          if (currentItemLevel >= this.MIN_ITEM_LEVEL) {
            cursor += 50;
            if (cursor > this.MAX_CURSOR) {
              // 조회 limit 도달
              if (itemLevel === currentItemLevel) break;
              cursor = 0;
              itemLevel = currentItemLevel;
            }
          }
        }
      } catch (error) {
        if (error.response) this.logger.debug(error.response.status);
        else if (error.request) this.logger.error(error.request);
        else this.logger.error(error.message);
      }

      await new Promise((_) => setTimeout(_, 1000 * 10));
    }
  }

  // 캐릭터 정보 검색 후 CharacterQueue에 추가
  private async runSearchCharacter() {
    while (true) {
      const characterName = this.characterNameQueue.shift();

      if (characterName) {
        const character =
          await this.lostarkService.searchCharacter(characterName);

        if (character) this.characterQueue.push(character);
      } else {
        // 큐가 비어있으면 대기
        await new Promise((_) => setTimeout(_, 1000 * 60));
      }
    }
  }

  // db에 캐릭터 정보 저장
  private async runUpsertCharacter() {
    while (true) {
      const character = this.characterQueue.shift();

      if (character) {
        await this.characterService.upsert(character);
      } else {
        // 큐가 비어있으면 대기
        await new Promise((_) => setTimeout(_, 1000 * 60));
      }
    }
  }

  private async run() {
    const servers = [
      '루페온',
      '아만',
      '카단',
      '카제로스',
      '카마인',
      '아브렐슈드',
      '실리안',
      '니나브',
    ];
    const classEngravings: string[] = [];

    // 직업각인 초기화
    Object.values(this.engravingService.getClassEngravings()).forEach(
      (value) => {
        classEngravings.push(...value);
      },
    );

    this.runSearchCharacter();
    this.runUpsertCharacter();

    while (true) {
      this.logger.log('===== CHARACTER-COLLECT START =====');

      for (let server of servers) {
        for (let classEngraving of classEngravings) {
          await this.collectCharacterName(server, classEngraving);
        }
      }

      this.logger.log('===== CHARACTER-COLLECT END =====');
      await new Promise((_) => setTimeout(_, 1000 * 60 * 60 * 24 * 7));
    }
  }
}
