import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';
import { LostarkNotice } from './interfaces/lostark-notice.interface';
import { MarketItemId } from './enums/lostark-item.enum';
import {
  AuctionItem,
  RequestAuctionItem,
} from './interfaces/lostark-auction.interface';
import {
  Character,
  Engraving,
  Profile,
} from './interfaces/lostark-character.interface';
import { EngravingService } from 'src/engraving/engraving.service';

@Injectable()
export class LostarkService {
  private readonly logger: Logger = new Logger(LostarkService.name);
  private readonly apiKeys: string[] = [];
  private apiKeyIndex: number = 0;

  constructor(
    private readonly googleSheetService: GoogleSheetService,
    private readonly engravingService: EngravingService,
  ) {
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
      if (error.response) this.logger.error(error.response.status);
      else if (error.request) this.logger.error(error.request);
      else this.logger.error(error.message);
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
      if (error.response) this.logger.error(error.response.status);
      else if (error.request) this.logger.error(error.request);
      else this.logger.error(error.message);
    }
  }

  ////////////
  // NOTICE //
  ////////////
  async getNotices(): Promise<LostarkNotice[]> {
    const result = await this.get('/news/notices');

    if (result) {
      const notices: LostarkNotice[] = [];

      result.forEach(
        (value: {
          Title: string;
          Date: string;
          Link: string;
          Type: string;
        }) => {
          notices.push({
            noticeId: Number(
              value.Link.replace(
                'https://lostark.game.onstove.com/News/Notice/Views/',
                '',
              ),
            ),
            title: value.Title,
            date: new Date(value.Date),
            link: value.Link,
          });
        },
      );

      return notices;
    } else {
      return null;
    }
  }

  ////////////
  // MARKET //
  ////////////
  async getAvgPrice(
    marketItemId: (typeof MarketItemId)[keyof typeof MarketItemId],
  ): Promise<number> {
    const result: {
      Name: string;
      TradeRemainCount: number;
      BundleCount: number;
      Stats: {
        Date: string;
        AvgPrice: number;
        TradeCount: number;
      }[];
      ToolTip: string;
    }[] = await this.get(`/markets/items/${marketItemId}`);

    if (result?.length > 0 && result[0].Stats?.length > 0)
      return result[0].Stats[0].AvgPrice;
    else return null;
  }

  /////////////
  // AUCTION //
  /////////////
  async searchAuctionItem(request: RequestAuctionItem): Promise<AuctionItem> {
    const result = await this.post('/auctions/items', {
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
    });
    let auctionItem: AuctionItem = null;

    // 검색 결과 parsing
    // 즉시구매가 가능한 최저가 아이템 반환
    if (result?.Items) {
      for (let i = 0; i < result.Items.length; i++) {
        if (result.Items[i].AuctionInfo.BuyPrice > 0) {
          const item = result.Items[i];

          auctionItem = {
            itemName: item.Name,
            itemGrade: item.Grade,
            itemQuality: item.GradeQualty,
            options: [],
            buyPrice: item.AuctionInfo.BuyPrice,
          };

          item.Options.forEach((option) => {
            auctionItem.options.push({
              optionName: option.OptionName,
              tripod: option.OptionNameTripod,
              value: option.Value,
              isPenalty: option.isPenalty,
              className: option.ClassName,
            });
          });

          break;
        }
      }
    }

    return auctionItem;
  }

  ///////////////
  // CHARACTER //
  ///////////////
  async searchCharacter(characterName: string): Promise<Character> {
    const result = await this.get(
      //`/armories/characters/${characterName}?filters=profiles%2Bequipment%2Bcombat-skills%2Bengravings%2Bgems`,
      `/armories/characters/${characterName}?filters=profiles%2Bequipment%2Bengravings`,
    );

    if (result) {
      const character: Character = {
        profile: this.parseCharacterProfile(result),
      };

      // 하나라도 유효하지 않은 값이 있으면 null을 반환
      for (let key in character) {
        if (!character[key]) return null;
      }

      return character;
    } else {
      return null;
    }
  }

  private parseCharacterProfile(character): Profile {
    if (
      character?.ArmoryProfile &&
      character.ArmoryEquipment &&
      character.ArmoryEngraving
    ) {
      const result: Profile = {
        characterName: character.ArmoryProfile.CharacterName,
        serverName: character.ArmoryProfile.ServerName,
        className: character.ArmoryProfile.CharacterClassName,
        classEngraving: null,
        itemLevel: Number(
          character.ArmoryProfile.ItemAvgLevel.replace(',', ''),
        ),
        stat: this.parseStat(character.ArmoryProfile.Stats),
        set: this.parseSet(character.ArmoryEquipment),
        engravings: this.parseEngraving(character.ArmoryEngraving),
        elixir: this.parseElixir(character.ArmoryEquipment),
      };

      // 직업각인정보 세팅
      if (result.engravings) {
        for (let engraving of result.engravings) {
          if (this.engravingService.isClassEngraving(engraving.name)) {
            result.classEngraving = engraving.name;
            break;
          }
        }
      }

      // 하나라도 유효하지 않은 값이 있으면 null을 반환
      for (let key in result) {
        if (!result[key]) return null;
      }

      return result;
    } else {
      return null;
    }
  }

  private parseStat(stats): string {
    const statValues: { stat: string; value: number }[] = [];
    let result = '';

    stats.forEach((stat) => {
      const type = stat.Type;
      const value = Number(stat.Value);

      // 치특신이면서 값이 200이상인 경우만 유효 특성으로 판단
      if (
        (type === '치명' || type === '특화' || type === '신속') &&
        value >= 200
      ) {
        statValues.push({
          stat: type,
          value,
        });
      }
    });

    // 높은 특성순으로 앞글자만 추출
    statValues.sort((a, b) => {
      return b.value - a.value;
    });
    statValues.forEach((statValue) => {
      result += statValue.stat[0];
    });

    // 유효 특성이 2개 이상인 경우만 결과 반환
    if (result.length >= 2) {
      return result;
    } else {
      return null;
    }
  }

  private parseSet(equipments): string {
    const setList = ['구원', '악몽', '사멸', '지배', '갈망', '환각'];
    const setCounts = [
      { set: '구원', count: 0 },
      { set: '악몽', count: 0 },
      { set: '사멸', count: 0 },
      { set: '지배', count: 0 },
      { set: '갈망', count: 0 },
      { set: '환각', count: 0 },
    ];
    let count = 0;
    let isEstherWeapon = false;
    let handSet = -1;
    let result = '';

    equipments.forEach((equipment) => {
      const type = equipment.Type;
      const name = equipment.Name;
      const grade = equipment.Grade;

      if (type === '무기') {
        if (grade === '에스더') {
          isEstherWeapon = true;
          count++;
        } else {
          for (let i = 0; i < setList.length; i++) {
            if (name.includes(setList[i])) {
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
        for (let i = 0; i < setList.length; i++) {
          if (name.includes(setList[i])) {
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

  private parseElixir(equipments): string {
    let elixir = null;

    for (let equipment of equipments) {
      if (equipment.Type === '장갑') {
        const tooltip = JSON.parse(equipments[1].Tooltip);

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

  private parseEngraving(engravings): Engraving[] {
    const result: Engraving[] = [];

    engravings.Effects.forEach((engraving) => {
      const data = engraving.Name;
      const name = data.substring(0, data.indexOf('Lv.') - 1);
      const level = data.substring(data.indexOf('Lv.') + 4, data.length);

      result.push({ name, level });
    });

    if (result.length === 0) return null;
    else return result;
  }
}
