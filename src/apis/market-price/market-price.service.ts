import { Injectable, Logger } from '@nestjs/common';
import { ItemPrice } from './interfaces/item-price.interface';
import { MarketPriceCategory } from '../../commons/enums/market-price.enum';
import { MarketPriceCategoryMap } from 'src/commons/consts/market-price.const';
import { RequestMarketItem } from 'src/commons/lostark/interfaces/lostark-market.interface';
import {
  AuctionItemCategory,
  MarketItemCategory,
} from 'src/commons/enums/lostark.enum';
import { LostarkService } from 'src/commons/lostark/lostark.service';
import { getCurrentDate } from 'src/commons/utils/date';
import { RequestAuctionItem } from 'src/commons/lostark/interfaces/lostark-auction.interface';

@Injectable()
export class MarketPriceService {
  private readonly logger: Logger = new Logger(MarketPriceService.name);
  private itemPrice: { [itemName: string]: ItemPrice } = {};

  constructor(private readonly lostarkService: LostarkService) {
    setTimeout(() => {
      this.refreshMarketPrice();
    }, 1000 * 5);
    setInterval(() => {
      this.refreshMarketPrice();
    }, 1000 * 60);
  }

  getCategoryPrice(category: MarketPriceCategory): ItemPrice[] {
    const itemPrices: ItemPrice[] = [];

    MarketPriceCategoryMap[category].forEach((itemName) => {
      itemPrices.push(this.itemPrice[itemName]);
    });

    return itemPrices;
  }

  getItemPrice(itemName: string): ItemPrice {
    return this.itemPrice[itemName];
  }

  private updatePrice(itemPrice: ItemPrice) {
    if (itemPrice.price > 0) {
      this.itemPrice[itemPrice.itemName] = itemPrice;
    }
  }

  private async refreshMarketPrice() {
    this.refreshReforge();
    this.refreshGem();
    this.refreshEngravingBook();
  }

  private async refreshReforge() {
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
      '에스더의 기운',
    ];
    const request: RequestMarketItem = {
      categoryCode: MarketItemCategory['강화 재료'],
      pageNo: 1,
    };
    const result = await this.lostarkService.searchMarketItems(request);
    const currentDate = getCurrentDate();

    result.forEach((value) => {
      if (itemNames.includes(value.itemName)) {
        this.updatePrice({
          itemName: value.itemName,
          itemGrade: value.itemGrade,
          iconPath: value.iconPath,
          price: value.minPrice,
          updated: currentDate,
        });
      }
    });
  }

  private async refreshGem() {
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
        this.updatePrice({
          itemName: auctionItem.itemName,
          itemGrade: auctionItem.itemGrade,
          price: auctionItem.buyPrice,
          updated: currentDate,
        });
      }
    });
  }

  private async refreshEngravingBook() {
    const request: RequestMarketItem = {
      categoryCode: MarketItemCategory.각인서,
      pageNo: 1,
      itemGrade: '전설',
    };
    const result = await this.lostarkService.searchMarketItems(request);
    const currentDate = getCurrentDate();

    result.forEach((value) => {
      this.updatePrice({
        itemName: value.itemName,
        itemGrade: value.itemGrade,
        iconPath: value.iconPath,
        price: value.minPrice,
        updated: currentDate,
      });
    });
  }
}
