import { MarketItemCategory } from '../../enums/lostark.enum';

export interface RequestMarketItem {
  categoryCode: MarketItemCategory;
  pageNo: number;
  characterClass?: string;
  itemGrade?: string;
  itemName?: string;
}

export interface MarketItem {
  itemName: string;
  itemGrade: string;
  iconPath: string;
  minPrice: number;
}