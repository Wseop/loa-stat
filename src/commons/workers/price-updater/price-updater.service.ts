import { Injectable, Logger } from '@nestjs/common';
import { MarketPriceService } from 'src/apis/market-price/market-price.service';
import {
  AuctionItemCategory,
  MarketItemCategory,
} from 'src/commons/enums/lostark.enum';
import { RequestAuctionItem } from 'src/commons/lostark/interfaces/lostark-auction.interface';
import { RequestMarketItem } from 'src/commons/lostark/interfaces/lostark-market.interface';
import { LostarkService } from 'src/commons/lostark/lostark.service';
import { getCurrentDate } from 'src/commons/utils/date';

@Injectable()
export class PriceUpdaterService {
  private readonly logger: Logger = new Logger(PriceUpdaterService.name);

  constructor(
    private readonly lostarkService: LostarkService,
    private readonly marketPriceService: MarketPriceService,
  ) {
    setTimeout(async () => {
      await Promise.all([
        this.updateReforge(),
        this.updateGem(),
        this.updateEsther(),
        this.updateEngravingBook(),
      ]);
      this.logger.debug('UPDATE | Item price');
    }, 1000 * 5);
    setInterval(async () => {
      this.updateReforge();
      this.updateGem();
      this.updateEsther();
      this.updateEngravingBook();
    }, 1000 * 60);
  }

  private async updateReforge() {
    const itemNames = [
      '명예의 파편 주머니(소)',
      '명예의 파편 주머니(중)',
      '명예의 파편 주머니(대)',
      '파괴강석',
      '정제된 파괴강석',
      '수호강석',
      '정제된 수호강석',
      '경이로운 명예의 돌파석',
      '찬란한 명예의 돌파석',
      '태양의 은총',
      '태양의 축복',
      '태양의 가호',
      '상급 오레하 융화 재료',
      '최상급 오레하 융화 재료',
    ];
    const request: RequestMarketItem = {
      categoryCode: MarketItemCategory['강화 재료'],
      pageNo: 1,
    };
    const result = await this.lostarkService.searchMarketItems(request);
    const currentDate = getCurrentDate();

    result.forEach((value) => {
      if (itemNames.includes(value.itemName)) {
        this.marketPriceService.updatePrice({
          itemName: value.itemName,
          itemGrade: value.itemGrade,
          iconPath: value.iconPath,
          price: value.minPrice,
          updated: currentDate,
        });
      }
    });
  }

  private async updateEsther() {
    const request: RequestMarketItem = {
      categoryCode: MarketItemCategory['강화 재료'],
      pageNo: 1,
      itemGrade: '에스더',
      itemName: '에스더의 기운',
    };
    const result = await this.lostarkService.searchMarketItems(request);
    const currentDate = getCurrentDate();

    this.marketPriceService.updatePrice({
      itemName: result[0].itemName,
      itemGrade: result[0].itemGrade,
      iconPath: result[0].iconPath,
      price: result[0].minPrice,
      updated: currentDate,
    });
  }

  private async updateGem() {
    const requests: RequestAuctionItem[] = [];
    const currentDate = getCurrentDate();

    for (let i = 1; i <= 10; i++) {
      requests.push({
        categoryCode: AuctionItemCategory.보석,
        pageNo: 1,
        itemName: `${i}레벨 멸화의 보석`,
      });
      requests.push({
        categoryCode: AuctionItemCategory.보석,
        pageNo: 1,
        itemName: `${i}레벨 홍염의 보석`,
      });
    }

    requests.forEach(async (request) => {
      const auctionItem = await this.lostarkService.searchAuctionItem(request);
      if (auctionItem?.buyPrice) {
        this.marketPriceService.updatePrice({
          itemName: auctionItem.itemName,
          itemGrade: auctionItem.itemGrade,
          price: auctionItem.buyPrice,
          updated: currentDate,
        });
      }
    });
  }

  private async updateEngravingBook() {
    const request: RequestMarketItem = {
      categoryCode: MarketItemCategory.각인서,
      pageNo: 1,
      itemGrade: '전설',
    };
    const result = await this.lostarkService.searchMarketItems(request);
    const currentDate = getCurrentDate();

    result.forEach((value) => {
      this.marketPriceService.updatePrice({
        itemName: value.itemName,
        itemGrade: value.itemGrade,
        iconPath: value.iconPath,
        price: value.minPrice,
        updated: currentDate,
      });
    });
  }
}
