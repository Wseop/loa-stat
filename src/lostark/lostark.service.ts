import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GoogleSheetService } from 'src/google-sheet/google-sheet.service';
import { LostarkNotice } from './interfaces/lostark-notice.interface';
import { MarketItemId } from './enums/lostark-item.enum';
import {
  AuctionItem,
  RequestAuctionItem,
} from './interfaces/lostark-auction.interface';

@Injectable()
export class LostarkService {
  private readonly logger: Logger = new Logger(LostarkService.name);
  private readonly apiKeys: string[] = [];
  private apiKeyIndex: number = 0;

  constructor(private readonly googleSheetService: GoogleSheetService) {
    this.loadApiKey();
  }

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
}
