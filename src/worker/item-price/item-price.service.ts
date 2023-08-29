import { Injectable, Logger } from '@nestjs/common';
import {
  AuctionItemCategory,
  MarketItemId,
} from 'src/lostark/enums/lostark-item.enum';
import { RequestAuctionItem } from 'src/lostark/interfaces/lostark-auction.interface';
import { LostarkService } from 'src/lostark/lostark.service';

@Injectable()
export class ItemPriceService {
  private readonly logger: Logger = new Logger(ItemPriceService.name);
  private marketItemPrice = {};
  private auctionItemPrice = {};

  constructor(private readonly lostarkService: LostarkService) {
    setTimeout(async () => {
      await this.updateMarketItemPrice();
      this.logger.log('MarketItemPrice initialized');
    }, 1000 * 5);
    setInterval(() => {
      this.updateMarketItemPrice();
    }, 1000 * 60);

    setTimeout(async () => {
      await this.updateAuctionItemPrice();
      this.logger.log('AuctionItemPrice initialized');
    }, 1000 * 5);
    setInterval(() => {
      this.updateAuctionItemPrice();
    }, 1000 * 60);
  }

  private async updateMarketItemPrice() {
    for (let item in MarketItemId) {
      const result = await this.lostarkService.getAvgPrice(MarketItemId[item]);
      if (result) {
        this.marketItemPrice[item] = result;
      }
    }
  }

  private async updateAuctionItemPrice() {
    const requests: RequestAuctionItem[] = [
      {
        categoryCode: AuctionItemCategory.보석,
        pageNo: 1,
        itemName: '1레벨 멸화의 보석',
      },
    ];

    requests.forEach(async (request) => {
      const result = await this.lostarkService.searchAuctionItem(request);
      if (result) {
        this.auctionItemPrice[result.itemName] = result.buyPrice;
      }
    });
  }

  getMarketItemPrice(itemName: string): number {
    return this.marketItemPrice[itemName];
  }

  getAuctionItemPrice(itemName: string): number {
    return this.auctionItemPrice[itemName];
  }
}
