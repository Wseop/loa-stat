import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CharacterService } from 'src/character/character.service';
import { ValidateCharacter } from 'src/character/functions/character.functions';
import { Character } from 'src/character/schemas/character.schema';
import { classMap, servers } from 'src/lostark/consts/lostark.const';
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
  ) {
    setTimeout(() => {
      this.run();
    }, 1000 * 5);
  }

  // 서버, 직업각인 단위로 캐릭터명을 수집하여 CharacterNameQueue에 추가
  private async collectCharacterName(
    server: string,
    className: string,
    classEngravings: string[],
  ) {
    let itemLevel = this.MAX_ITEM_LEVEL;
    let currentItemLevel = this.MAX_ITEM_LEVEL;
    let cursor = 0;

    while (currentItemLevel >= this.MIN_ITEM_LEVEL) {
      try {
        const url =
          classEngravings.length === 1
            ? `${process.env.CHARACTER_COLLECT_URL}?server=${server}&className=${className}&classEngraves[]=${classEngravings[0]}&maxItemLevel=${itemLevel}&cursor=${cursor}`
            : `${process.env.CHARACTER_COLLECT_URL}?server=${server}&className=${className}&classEngraves[]=${classEngravings[0]}&classEngraves[]=${classEngravings[1]}&maxItemLevel=${itemLevel}&cursor=${cursor}`;
        const result = await axios.get(url);

        if (classEngravings.length === 1) {
          this.logger.debug(
            `${server} | ${classEngravings[0]} | ${itemLevel} | ${cursor}`,
          );
        } else {
          this.logger.debug(
            `${server} | ${classEngravings[0]}, ${classEngravings[1]} | ${itemLevel} | ${cursor}`,
          );
        }

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
    let upsertCount = 0;

    while (true) {
      const character = this.characterQueue.shift();

      if (character) {
        if (ValidateCharacter(character)) {
          await this.characterService.upsert(character);
          upsertCount++;
        }
      } else {
        // 큐가 비어있으면 대기
        this.logger.debug(`UPSERT | ${upsertCount} data`);
        upsertCount = 0;
        await new Promise((_) => setTimeout(_, 1000 * 60));
      }
    }
  }

  private async run() {
    this.runSearchCharacter();
    this.runUpsertCharacter();

    while (true) {
      await new Promise((_) => setTimeout(_, 1000 * 60 * 60 * 24 * 7));

      this.logger.log('START | CharacterCollect');

      for (let server of servers) {
        for (let className in classMap) {
          const classEngravings = classMap[className];

          await this.collectCharacterName(server, className, [
            classEngravings[0],
          ]);
          await this.collectCharacterName(server, className, [
            classEngravings[1],
          ]);
          await this.collectCharacterName(server, className, [
            ...classEngravings,
          ]);
        }
      }

      this.logger.log('END | CharacterCollect');
    }
  }
}
