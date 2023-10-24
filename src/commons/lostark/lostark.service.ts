import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GoogleSheetService } from 'src/commons/google-sheet/google-sheet.service';
import {
  LostarkNotice,
  APIResultNotice,
} from './interfaces/lostark-notice.interface';
import {
  APIResultAuctionItem,
  AuctionItem,
  RequestAuctionItem,
} from './interfaces/lostark-auction.interface';
import {
  CharacterBuilder,
  Profile,
} from 'src/apis/character/functions/character.functions';
import {
  APIResultMarketItem,
  APIResultMarketItemAvg,
  MarketItem,
  RequestMarketItem,
} from './interfaces/lostark-market.interface';
import { MarketItemId } from '../enums/lostark.enum';
import {
  Character,
  Engraving,
  Setting,
  Skill,
} from 'src/apis/character/schemas/character.schema';
import { Sets } from '../consts/lostark.const';
import { wait } from '../utils/time';
import {
  APIResultCharacter,
  ArmoryEngraving,
  ArmoryEquipment,
  ArmoryGem,
  ArmoryProfile,
  ArmorySkill,
  ProfileStat,
} from './interfaces/lostark-character.interface';

@Injectable()
export class LostarkService {
  private readonly logger: Logger = new Logger(LostarkService.name);
  private readonly apiKeys: string[] = [];
  private apiKeyIndex: number = 0;

  constructor(private readonly googleSheetService: GoogleSheetService) {
    this.loadApiKey();
  }

  /////////
  // API //
  /////////
  private async loadApiKey() {
    const result = await this.googleSheetService.get('apikey');

    if (result?.data?.values) {
      result.data.values.forEach((value) => {
        this.apiKeys.push(value[0]);
      });
      this.logger.log('ApiKey load success');
    } else {
      this.logger.error('ApiKey load fail');
    }
  }

  // Round-Robin 방식으로 apikey 사용
  private getApiKey(): string {
    if (this.apiKeys.length <= 0) return null;
    if (this.apiKeyIndex >= this.apiKeys.length) this.apiKeyIndex = 0;
    return this.apiKeys[this.apiKeyIndex++];
  }

  private async get(url: string) {
    try {
      const result = await axios.get(
        `https://developer-lostark.game.onstove.com${url}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `bearer ${this.getApiKey()}`,
          },
        },
      );

      if (result) return result.data;
      else return null;
    } catch (error) {
      if (error.response) {
        this.logger.debug(error.response.status);
        return error.response.status;
      } else if (error.request) this.logger.error(error.request);
      else this.logger.error(error.message);
      return null;
    }
  }

  private async post(url: string, data: any) {
    try {
      const result = await axios.post(
        `https://developer-lostark.game.onstove.com${url}`,
        data,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `bearer ${this.getApiKey()}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (result) return result.data;
      else return null;
    } catch (error) {
      if (error.response) {
        this.logger.debug(error.response.status);
        return error.response.status;
      } else if (error.request) this.logger.error(error.request);
      else this.logger.error(error.message);
      return null;
    }
  }

  ////////////
  // NOTICE //
  ////////////
  async getNotices(): Promise<LostarkNotice[]> {
    const result: APIResultNotice[] = await this.get('/news/notices');

    if (result?.length > 0) {
      const notices: LostarkNotice[] = [];

      result.forEach((value) => {
        notices.push({
          noticeId: Number(
            value.Link.replace(
              'https://lostark.game.onstove.com/News/Notice/Views/',
              '',
            ),
          ),
          title: value.Title,
          date: value.Date,
          link: value.Link,
        });
      });

      return notices;
    } else {
      return null;
    }
  }

  ////////////
  // MARKET //
  ////////////
  async getAvgPrice(marketItemId: MarketItemId): Promise<number> {
    const result: APIResultMarketItemAvg[] = await this.get(
      `/markets/items/${marketItemId}`,
    );

    if (result?.length > 0 && result[0].Stats?.length > 0)
      return result[0].Stats[0].AvgPrice;
    else return null;
  }

  async searchMarketItems(request: RequestMarketItem): Promise<MarketItem[]> {
    const marketItems: MarketItem[] = [];
    const searchOption = {
      Sort: 'CURRENT_MIN_PRICE',
      CategoryCode: request.categoryCode,
      CharacterClass: request.characterClass,
      ItemGrade: request.itemGrade,
      ItemName: request.itemName,
      PageNo: request.pageNo,
      SortCondition: 'ASC',
    };
    let result: APIResultMarketItem = await this.post(
      '/markets/items',
      searchOption,
    );
    const pageSize = Number(result?.PageSize);

    // 전체 페이지 검색
    while (result?.Items?.length > 0 && searchOption.PageNo <= pageSize) {
      result.Items.forEach((item) => {
        marketItems.push({
          itemName: item.Name,
          itemGrade: item.Grade,
          iconPath: item.Icon,
          minPrice: item.CurrentMinPrice,
        });
      });

      searchOption.PageNo++;
      result = await this.post('/markets/items', searchOption);
    }

    return marketItems;
  }

  /////////////
  // AUCTION //
  /////////////
  async searchAuctionItem(request: RequestAuctionItem): Promise<AuctionItem> {
    const searchOption = {
      Sort: 'BUY_PRICE',
      ItemTier: 3,
      SortCondition: 'ASC',
      CategoryCode: request.categoryCode,
      PageNo: request.pageNo,
      ItemName: request.itemName,
      ItemGrade: request.itemGrade,
      ItemGradeQuality: request.itemQuality,
      CharacterClass: request.characterClass,
      SkillOptions: request.skillOptions ? [...request.skillOptions] : null,
      EtcOptions: request.etcOptions ? [...request.etcOptions] : null,
    };
    const result: APIResultAuctionItem = await this.post(
      '/auctions/items',
      searchOption,
    );
    let auctionItem: AuctionItem = null;

    // 즉시구매가 가능한 최저가 아이템 반환
    if (result?.Items) {
      for (let i = 0; i < result.Items.length; i++) {
        if (result.Items[i].AuctionInfo.BuyPrice > 0) {
          const item = result.Items[i];

          auctionItem = {
            itemName: item.Name,
            itemGrade: item.Grade,
            itemQuality: item.GradeQuality,
            options: item.Options.map((option) => {
              return {
                optionName: option.OptionName,
                tripod: option.OptionNameTripod,
                value: option.Value,
                isPenalty: option.IsPenalty,
                className: option.ClassName,
              };
            }),
            buyPrice: item.AuctionInfo.BuyPrice,
          };

          break;
        }
      }
    }

    return auctionItem;
  }

  ///////////////
  // CHARACTER //
  ///////////////
  async searchCharacter(characterName: string): Promise<Character | number> {
    let result: APIResultCharacter = await this.get(
      `/armories/characters/${characterName}?filters=profiles%2Bequipment%2Bengravings%2Bcombat-skills%2Bgems`,
    );

    // 상태코드가 반환된 경우
    while (Number.isInteger(result)) {
      const statusCode = Number(result);
      // 429 재시도
      if (statusCode === 429) {
        this.logger.warn('Rate Limit Exceeded - Retry after 1minute');
        await wait(1000 * 60);
        result = await this.get(
          `/armories/characters/${characterName}?filters=profiles%2Bequipment%2Bengravings%2Bcombat-skills%2Bgems`,
        );
      }
      // 그 외 상태코드 반환
      else {
        return statusCode;
      }
    }

    if (result) {
      return CharacterBuilder(
        this.parseCharacterProfile(result.ArmoryProfile),
        this.parseCharacterSetting(
          result.ArmoryProfile,
          result.ArmoryEquipment,
          result.ArmoryEngraving,
        ),
        this.parseCharacterSkill(result.ArmorySkills, result.ArmoryGem),
      );
    } else {
      return null;
    }
  }

  private parseCharacterProfile(armoryProfile: ArmoryProfile): Profile {
    if (armoryProfile) {
      return {
        characterName: armoryProfile.CharacterName,
        serverName: armoryProfile.ServerName,
        className: armoryProfile.CharacterClassName,
        itemLevel: Number(armoryProfile.ItemAvgLevel.replace(',', '')),
      };
    } else {
      return null;
    }
  }

  private parseCharacterSetting(
    armoryProfile: ArmoryProfile,
    armoryEquipments: ArmoryEquipment[],
    armoryEngraving: ArmoryEngraving,
  ): Setting {
    if (armoryProfile && armoryEquipments && armoryEngraving) {
      const result: Setting = {
        stat: this.parseStat(armoryProfile.Stats),
        set: this.parseSet(armoryEquipments),
        elixir: this.parseElixir(armoryEquipments),
        engravings: this.parseEngraving(armoryEngraving),
      };

      return result;
    } else {
      return null;
    }
  }

  private parseStat(stats: ProfileStat[]): string {
    const statValues: { type: string; value: number }[] = stats
      .map((stat) => {
        const type = stat.Type;
        const value = Number(stat.Value);

        // 치특신 & 200이상인 경우만 유효 특성으로 판단
        if (
          (type === '치명' || type === '특화' || type === '신속') &&
          value >= 200
        ) {
          return {
            type,
            value,
          };
        }
      })
      .filter((e) => e);
    let result = '';

    // 높은 특성순으로 앞글자만 추출
    statValues.sort((a, b) => {
      return b.value - a.value;
    });
    statValues.forEach((statValue) => {
      result += statValue.type[0];
    });

    // 유효 특성이 2개 이상인 경우만 결과 반환
    if (result.length >= 2) {
      return result;
    } else {
      return null;
    }
  }

  private parseSet(armoryEquipments: ArmoryEquipment[]): string {
    const setCounts = Sets.map((value) => {
      return { set: value, count: 0 };
    });
    let count = 0;
    let isEstherWeapon = false;
    let handSet = -1;
    let result = '';

    armoryEquipments.forEach((equipment) => {
      const type = equipment.Type;
      const name = equipment.Name;
      const grade = equipment.Grade;

      if (type === '무기') {
        if (grade === '에스더') {
          isEstherWeapon = true;
          count++;
        } else {
          for (let i = 0; i < Sets.length; i++) {
            if (name.includes(Sets[i])) {
              setCounts[i].count++;
              count++;
            }
          }
        }
      } else if (
        type === '투구' ||
        type === '상의' ||
        type === '하의' ||
        type === '장갑' ||
        type === '어깨'
      ) {
        for (let i = 0; i < Sets.length; i++) {
          if (name.includes(Sets[i])) {
            setCounts[i].count++;
            count++;
            if (type === '장갑') handSet = i;
          }
        }
      }
    });

    // 에스더무기는 장갑의 세트효과를 받음
    if (isEstherWeapon && handSet !== -1) setCounts[handSet].count++;
    // 6세트가 아닌경우 중단
    if (count !== 6) return null;

    setCounts.sort((a, b) => {
      return a.count - b.count;
    });
    setCounts.forEach((setCount) => {
      if (setCount.count > 0) {
        result += `${setCount.count}${setCount.set}`;
      }
    });

    return result;
  }

  private parseElixir(armoryEquipments: ArmoryEquipment[]): string {
    let elixir = null;

    for (let equipment of armoryEquipments) {
      if (equipment.Type === '장갑') {
        const tooltip = JSON.parse(equipment.Tooltip);

        for (let element in tooltip) {
          if (tooltip[element].type === 'IndentStringGroup') {
            const value = tooltip[element].value;

            if (value?.Element_000?.topStr) {
              const topStr = value.Element_000?.topStr;

              if (topStr.includes('연성 추가 효과')) {
                if (topStr.includes('(1단계)') || topStr.includes('(2단계)')) {
                  elixir = topStr.substring(83, topStr.indexOf('(') - 1);
                }
                break;
              }
            }
          }
        }
        break;
      }
    }

    return elixir;
  }

  private parseEngraving(armoryEngraving: ArmoryEngraving): Engraving[] {
    const result: Engraving[] = armoryEngraving.Effects.map((engraving) => {
      const data = engraving.Name;
      const name = data.substring(0, data.indexOf('Lv.') - 1);
      const level = Number(
        data.substring(data.indexOf('Lv.') + 4, data.length),
      );
      return { name, level };
    });

    if (result.length === 0) return null;
    else return result;
  }

  private parseCharacterSkill(
    armorySkills: ArmorySkill[],
    armoryGem: ArmoryGem,
  ): Skill[] {
    const result: Skill[] = [];
    const armorySkill: { [skillName: string]: Skill } = {};
    const gemSlot: string[] = new Array(11).fill('');

    if (armorySkills && armoryGem) {
      // 채용한 스킬정보 parsing (4레벨 이상 혹은 룬을 착용한 스킬)
      armorySkills.forEach((skill) => {
        if (skill.Level >= 4 || skill.Rune) {
          armorySkill[skill.Name] = {
            name: skill.Name,
            level: skill.Level,
            tripods: skill.Tripods.map((tripod) => {
              if (tripod.IsSelected) return tripod.Name;
            }).filter((e) => e),
            rune: skill.Rune
              ? {
                  name: skill.Rune.Name,
                  grade: skill.Rune.Grade,
                }
              : null,
            gems: [],
          };
        }
      });

      // 채용한 스킬들의 보석정보 추가
      armoryGem.Gems.forEach((gem) => {
        gemSlot[gem.Slot] = gem.Name;
      });
      armoryGem.Effects.forEach((gemEffect) => {
        if (armorySkill[gemEffect.Name]) {
          const gemName = gemSlot[gemEffect.GemSlot];

          if (gemName.includes('멸화')) {
            armorySkill[gemEffect.Name].gems.push('멸화');
          } else if (gemName.includes('홍염')) {
            armorySkill[gemEffect.Name].gems.push('홍염');
          }
        }
      });
    }

    for (let skillName in armorySkill) {
      result.push(armorySkill[skillName]);
    }

    return result;
  }
}
