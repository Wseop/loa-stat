import { Injectable, Logger } from '@nestjs/common';
import { ItemPrice } from './interfaces/item-price.interface';
import { MarketPriceCategory } from './enums/market-price.enum';

@Injectable()
export class MarketPriceService {
  private readonly logger: Logger = new Logger(MarketPriceService.name);
  private marketPrice = {};
  private itemPrice = {};

  constructor() {
    for (let category in MarketPriceCategory) {
      this.marketPrice[MarketPriceCategory[category]] = null;
    }
  }

  getMarketPrice(category: MarketPriceCategory): ItemPrice[] {
    return this.marketPrice[category];
  }

  getItemPrice(itemName: string): number {
    return this.itemPrice[itemName];
  }

  updatePrice(category: MarketPriceCategory, itemPrices: ItemPrice[]) {
    this.marketPrice[category] = itemPrices;

    itemPrices.forEach((itemPrice) => {
      this.itemPrice[itemPrice.itemName] = itemPrice.price;
    });
  }
}
