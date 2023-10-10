import { Injectable, Logger } from '@nestjs/common';
import { ItemPrice } from './interfaces/item-price.interface';
import { MarketPriceCategory } from '../../commons/enums/market-price.enum';
import { MarketPriceCategoryMap } from 'src/commons/consts/market-price.const';

@Injectable()
export class MarketPriceService {
  private readonly logger: Logger = new Logger(MarketPriceService.name);
  private itemPrice: { [itemName: string]: ItemPrice } = {};

  constructor() {}

  getItemPrice(itemName: string): ItemPrice {
    return this.itemPrice[itemName];
  }

  getCategoryPrice(category: MarketPriceCategory): ItemPrice[] {
    const itemPrices: ItemPrice[] = [];

    MarketPriceCategoryMap[category].forEach((itemName) => {
      itemPrices.push(this.itemPrice[itemName]);
    });

    return itemPrices;
  }

  updatePrice(itemPrice: ItemPrice) {
    if (itemPrice.price > 0) {
      this.itemPrice[itemPrice.itemName] = itemPrice;
    }
  }
}
