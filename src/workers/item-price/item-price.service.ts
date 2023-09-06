import { Injectable, Logger } from '@nestjs/common';
import { RequestAuctionItem } from 'src/lostark/interfaces/lostark-auction.interface';
import { LostarkService } from 'src/lostark/lostark.service';
import { AuctionItemCategory, MarketItemId } from 'src/lostark/resources/enum';
import { MarketPriceCategory } from 'src/market-price/enums/market-price.enum';
import { ItemPrice } from 'src/market-price/interfaces/item-price.interface';
import { MarketPriceService } from 'src/market-price/market-price.service';
import { getCurrentDate } from 'src/utils/date';

@Injectable()
export class ItemPriceService {
  private readonly logger: Logger = new Logger(ItemPriceService.name);

  constructor(
    private readonly lostarkService: LostarkService,
    private readonly marketPriceService: MarketPriceService,
  ) {
    setTimeout(async () => {
      await Promise.all([
        this.updateReforge(),
        this.updateGem(),
        this.updateEsther(),
      ]);
      this.logger.debug('UPDATE | Item price');
    }, 1000 * 5);
    setInterval(async () => {
      this.updateReforge();
      this.updateGem();
      this.updateEsther();
    }, 1000 * 60);
  }

  private async updateReforge() {
    const items = [
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
    const currentDate = getCurrentDate();
    const result: ItemPrice[] = await Promise.all(
      items.map(async (item) => {
        return {
          itemName: item,
          price: await this.lostarkService.getAvgPrice(MarketItemId[item]),
          updated: currentDate,
        };
      }),
    );

    this.marketPriceService.updatePrice(MarketPriceCategory.Reforge, result);
  }

  private async updateEsther() {
    const itemPrice: ItemPrice = {
      itemName: '에스더의 기운',
      price: await this.lostarkService.getAvgPrice(
        MarketItemId['에스더의 기운'],
      ),
      updated: getCurrentDate(),
    };

    this.marketPriceService.updatePrice(MarketPriceCategory.Esther, [
      itemPrice,
    ]);
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

    const result: ItemPrice[] = await Promise.all(
      requests.map(async (request) => {
        const auctionItem =
          await this.lostarkService.searchAuctionItem(request);
        const itemPrice: ItemPrice = {
          itemName: request.itemName,
          price: -1,
          updated: currentDate,
        };

        if (auctionItem) itemPrice.price = auctionItem.buyPrice;

        return itemPrice;
      }),
    );

    this.marketPriceService.updatePrice(MarketPriceCategory.Gem, result);
  }
}
